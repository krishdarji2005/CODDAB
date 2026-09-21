import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Editor from "./components/Editor/Editor";
import ProblemPanel from "./components/ProblemPanel/ProblemPanel";
import AiReviewModal from "./components/AiReviewModal/AiReviewModal";
import styles from "./EditorPage.module.css";
import { initSocket } from "../../socket";
import ACTIONS from "../../Actions";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const EditorPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const codeRef = useRef(null);
  const socketRef = useRef(null);
  const reactNavigator = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [opponentSubmitted, setOpponentSubmitted] = useState(false);
  const [opponentResult, setOpponentResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null); // seconds; null = waiting for opponent
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");

  // Code Execution (Run Code) States
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState("input"); // 'input' | 'output'

  // AI Review States (Collab mode only)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReviewContent, setAiReviewContent] = useState("");

  // Initialize socket synchronously and attach room event listeners
  useEffect(() => {
    const socket = initSocket();
    socketRef.current = socket;

    socket.on("connect_error", (err) => handleErrors(err));
    socket.on("connect_failed", (err) => handleErrors(err));

    function handleErrors(e) {
      console.log("socket error", e);
      toast.error("Socket connection failed, try again later.");
      reactNavigator("/");
    }

    // Handle authentication / authorization error when joining
    socket.on("join-error", ({ message }) => {
      toast.error(message || "Failed to join room.");
      reactNavigator("/login");
    });

    console.log("Sending mode to server:", location.state?.roomType);
    socket.emit(ACTIONS.JOIN, {
      roomId,
      username: location.state?.username,
      mode: location.state?.roomType || "collab",
      token: localStorage.getItem("token"),
      isCreate: location.state?.isCreate,
    });

    // Listen for JOINED event from server
    socket.on(ACTIONS.JOINED, ({ clients, username, socketId, mode }) => {
      // Show toast only for OTHER users joining (not yourself)
      if (username !== location.state?.username) {
        toast.success(`${username} joined the room`);
        // Sync our current code to the newly joined user
        if (mode === "collab") {
          socket.emit(ACTIONS.SYNC_CODE, {
            socketId,
            code: codeRef.current,
          });
        }
      }
      // Update members list with real connected clients from server
      setMembers(clients);
      console.log("Room mode from server:", mode);
    });

    // Handle submission results from server
    socket.on(ACTIONS.SUBMITTED, ({ username, result, isSelf }) => {
      console.log("SUBMITTED received:", {
        username,
        result,
        isSelf,
      });

      const isCurrentPlayer = username === location.state?.username;

      if (isCurrentPlayer) {
        setIsSubmitting(false);
        setSubmissionResult(result);
        if (result?.success) {
          // Accepted — lock the editor permanently
          setHasSubmitted(true);
          toast.success(
            `Accepted! (${result.passedTests}/${result.totalTests} tests passed)`
          );
        } else {
          // Wrong Answer — allow the player to edit and resubmit
          setHasSubmitted(false);
          toast.error(
            `Wrong Answer (${result?.passedTests ?? 0}/${result?.totalTests ?? 0} tests passed)`
          );
        }
      } else {
        setOpponentSubmitted(true);
        setOpponentResult(result);
        toast.success(`${username} submitted their solution`);
      }
    });

    socket.on("submit-error", ({ message }) => {
      setIsSubmitting(false);
      toast.error(message || "Submission evaluation failed.");
    });

    // Start the countdown when both players are in the battle room
    socket.on(ACTIONS.BATTLE_START, ({ duration, problem }) => {
      setTimeLeft(duration);
      setProblem(problem);
    });

    // Listen for battle termination
    socket.on(ACTIONS.BATTLE_END, ({ winnerSocketId, winnerUsername, result, reason }) => {
      const isWinner = winnerSocketId ? socket.id === winnerSocketId : false;

      reactNavigator(`/battle-result/${roomId}`, {
        state: {
          isWinner,
          winnerUsername,
          result,
          reason,
        },
      });
    });

    // Listen for disconnected
    socket.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
      toast.success(`${username} left the room`);
      setMembers((prev) => prev.filter((client) => client.socketId !== socketId));
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socket.off(ACTIONS.JOINED);
      socket.off(ACTIONS.DISCONNECTED);
      socket.off(ACTIONS.SUBMITTED);
      socket.off("submit-error");
      socket.off("join-error");
      socket.off(ACTIONS.BATTLE_START);
      socket.off(ACTIONS.BATTLE_END);
    };
  }, []);

  // Real members list — populated from the server via JOINED socket event
  const [members, setMembers] = useState([]);

  // Countdown — ticks once per second using setTimeout for drift-free behavior
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const id = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [timeLeft]);

  // ── Guards ──
  if (!location.state?.username) {
    return <Navigate to="/join" />;
  }

  if (location.state?.roomType === "battle" && !isAuthenticated && !authLoading) {
    toast.error("Please log in first to access 1v1 Battles.");
    return <Navigate to="/login" replace />;
  }

  // Lock the editor and disable submission once the battle clock hits 0
  const isTimedOut = timeLeft === 0;

  const handleRunCode = async () => {
    const currentCode = codeRef.current;
    if (!currentCode || !currentCode.trim()) {
      toast.error("Please write some code first before running.");
      return;
    }
    if (isRunning || isTimedOut) return;

    setIsRunning(true);
    setIsConsoleOpen(true);
    setActiveConsoleTab("output");
    setRunResult(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const res = await fetch(`${backendUrl}/api/judge/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId: problem?.id,
          sourceCode: currentCode,
          language: location.state?.roomType === "battle" ? language : "javascript",
          stdin: customInput,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Code execution failed.");
      }

      setRunResult(data.result);
    } catch (err) {
      console.error("Run code error:", err);
      toast.error(err.message || "Code execution failed.");
      setRunResult({
        stderr: err.message || "Execution failed",
        status: { description: "Error" },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    // hasSubmitted is only true when the player has an Accepted result; block resubmit then.
    if (!socketRef.current || hasSubmitted || isSubmitting || isTimedOut) return;

    setIsSubmitting(true);
    console.log("Sending submission:", {
      roomId,
      username: location.state?.username,
      sourceCode: codeRef.current,
      language,
    });

    socketRef.current.emit(ACTIONS.SUBMIT, {
      roomId,
      username: location.state?.username,
      sourceCode: codeRef.current,
      language,
    });
  };

  const handleAiReview = async () => {
    const currentCode = codeRef.current;
    if (!currentCode || !currentCode.trim()) {
      toast.error("Please write some code first before requesting a review.");
      return;
    }

    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiReviewContent("");

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const res = await fetch(`${backendUrl}/api/ai/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: currentCode,
          language: location.state?.roomType === "battle" ? language : "javascript",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to generate AI code review.");
      }

      setAiReviewContent(data.review);
    } catch (err) {
      console.error("AI Review error:", err);
      toast.error(err.message || "Failed to generate AI review.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        roomId={roomId}
        members={members}
        roomType={location.state?.roomType}
        onAiReview={handleAiReview}
        isAiLoading={isAiLoading}
      />

      <div className={styles.mainArea}>
        {location.state?.roomType === "battle" && <ProblemPanel problem={problem} />}

        <div className={styles.editorWrap}>
          {location.state?.roomType === "battle" && (
            <div className={styles.battleBar}>
              <div className={`${styles.timer}${isTimedOut ? " " + styles.timerExpired : ""}`}>
                {isTimedOut
                  ? "Time's up"
                  : timeLeft !== null
                  ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
                  : "Waiting for opponent..."}
              </div>

              {/* Language selector — battle only */}
              <select
                id="language-select"
                className={styles.langSelect}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isTimedOut || hasSubmitted || isSubmitting}
              >
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
              </select>

              <div className={styles.submitStatus}>
                {isSubmitting && (
                  <span className={styles.statusEvaluating}>Evaluating...</span>
                )}
                {hasSubmitted && submissionResult && (
                  <span
                    className={
                      submissionResult.success
                        ? styles.statusAccepted
                        : styles.statusWrong
                    }
                  >
                    {submissionResult.success ? "Accepted ✓" : "Wrong Answer ✗"} (
                    {submissionResult.passedTests}/{submissionResult.totalTests})
                  </span>
                )}
                {hasSubmitted && !submissionResult && !isSubmitting && (
                  <span className={styles.statusItem}>You submitted ✓</span>
                )}
                {opponentSubmitted && (
                  <span className={styles.statusOpponent}>
                    Opponent submitted ✓
                  </span>
                )}
              </div>

              <div className={styles.btnGroup}>
                <button
                  type="button"
                  className="tactile-btn-secondary tactile-btn-sm"
                  onClick={handleRunCode}
                  disabled={isRunning || isTimedOut}
                >
                  {isRunning ? "Running..." : "Run Code"}
                </button>

                <button
                  type="button"
                  className="tactile-btn-primary tactile-btn-sm"
                  onClick={handleSubmit}
                  disabled={hasSubmitted || isSubmitting || isTimedOut}
                >
                  {isSubmitting
                    ? "Evaluating..."
                    : hasSubmitted
                    ? "Accepted ✓"
                    : isTimedOut
                    ? "Time's up"
                    : "Submit Solution"}
                </button>
              </div>
            </div>
          )}

          <div className={styles.editorContentArea}>
            <Editor
              socketRef={socketRef}
              roomId={roomId}
              roomType={location.state?.roomType || "collab"}
              language={location.state?.roomType === "battle" ? language : "javascript"}
              starterCode={problem?.starterCode}
              readOnly={hasSubmitted || isTimedOut}
              onCodeChange={(code) => {
                codeRef.current = code;
              }}
            />
          </div>

          {/* Console Drawer for Battle Mode (Custom Input & Output) */}
          {location.state?.roomType === "battle" && (
            <div className={`${styles.consoleDrawer} ${isConsoleOpen ? styles.consoleOpen : styles.consoleClosed}`}>
              <div className={styles.consoleHeader}>
                <div className={styles.consoleTabs}>
                  <button
                    type="button"
                    className={`${styles.consoleTabBtn} ${activeConsoleTab === "input" ? styles.consoleTabActive : ""}`}
                    onClick={() => {
                      setActiveConsoleTab("input");
                      setIsConsoleOpen(true);
                    }}
                  >
                    Custom Input (stdin)
                  </button>
                  <button
                    type="button"
                    className={`${styles.consoleTabBtn} ${activeConsoleTab === "output" ? styles.consoleTabActive : ""}`}
                    onClick={() => {
                      setActiveConsoleTab("output");
                      setIsConsoleOpen(true);
                    }}
                  >
                    Output Console {runResult && <span className={styles.outputDot} />}
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.consoleToggleBtn}
                  onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                  title={isConsoleOpen ? "Collapse Console" : "Expand Console"}
                >
                  {isConsoleOpen ? "▼ Minimize Console" : "▲ Open Console (stdin/stdout)"}
                </button>
              </div>

              {isConsoleOpen && (
                <div className={styles.consoleBody}>
                  {activeConsoleTab === "input" ? (
                    <div className={styles.inputTabContent}>
                      <textarea
                        className={styles.stdinTextarea}
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter standard input (stdin) for your run test..."
                        spellCheck={false}
                      />
                    </div>
                  ) : (
                    <div className={styles.outputTabContent}>
                      {isRunning ? (
                        <div className={styles.outputLoading}>
                          <span className={styles.spinner} />
                          <span>Executing code in Judge0 sandbox...</span>
                        </div>
                      ) : runResult ? (
                        <div className={styles.outputDetails}>
                          <div className={styles.outputMeta}>
                            <span className={runResult.status?.id === 3 ? styles.statusBadgeSuccess : styles.statusBadgeWarn}>
                              {runResult.status?.description || "Executed"}
                            </span>
                            {runResult.time && (
                              <span className={styles.metaItem}>Time: <strong>{runResult.time}s</strong></span>
                            )}
                            {runResult.memory && (
                              <span className={styles.metaItem}>Memory: <strong>{runResult.memory} KB</strong></span>
                            )}
                          </div>

                          {runResult.stdout && (
                            <div className={styles.outputBlock}>
                              <div className={styles.outputBlockLabel}>stdout:</div>
                              <pre className={styles.stdoutPre}>{runResult.stdout}</pre>
                            </div>
                          )}

                          {(runResult.stderr || runResult.compile_output) && (
                            <div className={styles.outputBlock}>
                              <div className={styles.outputBlockLabel}>stderr / compiler output:</div>
                              <pre className={styles.stderrPre}>
                                {runResult.stderr || runResult.compile_output}
                              </pre>
                            </div>
                          )}

                          {!runResult.stdout && !runResult.stderr && !runResult.compile_output && (
                            <div className={styles.outputEmpty}>
                              (Program completed with no stdout/stderr output)
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.outputEmpty}>
                          Click "Run Code" above to execute your solution against custom input.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Code Review Modal (Collab Mode) */}
      <AiReviewModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        isLoading={isAiLoading}
        review={aiReviewContent}
      />
    </div>
  );
};

export default EditorPage;
