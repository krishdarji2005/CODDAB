import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Editor from "./components/Editor/Editor";
import ProblemPanel from "./components/ProblemPanel/ProblemPanel";
import styles from "./EditorPage.module.css";
import { initSocket } from "../../socket";
import ACTIONS from "../../Actions";
import { useLocation,useNavigate,Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const codeRef = useRef(null);

  const socketRef = useRef(null);
 
  const reactNavigator = useNavigate();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [opponentSubmitted, setOpponentSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // seconds; null = waiting for opponent
  // Battle language selector — default C++ (most competitive-programming-friendly)
  const [language, setLanguage] = useState("cpp");

  //.current property hai wo refers directly to the active Socket.io client instance
  //send event to servert to join
  useEffect(() => {
    let isActive = true;

    const init = async () => {
      socketRef.current = await initSocket();

      // StrictMode mounts → unmounts → remounts in dev. If cleanup ran
      // before the await resolved, bail out immediately and disconnect
      // the socket we just created so it never sends a JOIN.
      if (!isActive) {
        socketRef.current?.disconnect();
        return;
      }

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      console.log("Sending mode to server:", location.state?.roomType);
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
        mode: location.state?.roomType || "collab",
      });

      // Listen for JOINED event from server
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId, mode }) => {
        // Show toast only for OTHER users joining (not yourself)
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
          // Sync our current code to the newly joined user
          if (mode === "collab") {
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              socketId,
              code: codeRef.current,
            });
          }
        }
        // Update members list with real connected clients from server
        setMembers(clients);
        console.log("Room mode from server:", mode);
      });

      socketRef.current.on(ACTIONS.SUBMITTED, ({ username }) => {
        if (username !== location.state?.username) {
          setOpponentSubmitted(true);
          toast.success(`${username} submitted their solution`);
        }
      });

      // Start the countdown when both players are in the battle room
      socketRef.current.on(ACTIONS.BATTLE_START, ({ duration }) => {
        setTimeLeft(duration);
      });

      // Listen for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setMembers(prev => prev.filter(client => client.socketId !== socketId));
      });
    };

    init();

    // Cleanup: disconnect + remove listeners on unmount
    return () => {
      isActive = false;
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
      socketRef.current?.off(ACTIONS.SUBMITTED);
      socketRef.current?.off(ACTIONS.BATTLE_START);
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

  // ── Guard: if no username in state, redirect to /join ──
  // This happens when someone navigates directly to /editor/:roomId
  // without going through JoinPage (so location.state is null/undefined)
  if (!location.state?.username) {
    return <Navigate to="/join" />;
  }

  // Lock the editor and disable submission once the battle clock hits 0
  const isTimedOut = timeLeft === 0;
  const handleSubmit = () => {
    if(!socketRef.current) return;
    socketRef.current.emit(ACTIONS.SUBMIT, {
      roomId,
      username: location.state?.username,
    });
    toast.success("Solution submitted");
    setHasSubmitted(true);
  }

  return (

    <div className={styles.layout}>
      <Sidebar roomId={roomId} members={members} roomType={location.state?.roomType} />

      <div className={styles.mainArea}>
        {location.state?.roomType === "battle" && <ProblemPanel />}

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

              {/* Language selector — battle only, no execution yet */}
              <select
                id="language-select"
                className={styles.langSelect}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isTimedOut || hasSubmitted}
              >
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
              </select>

              <div className={styles.submitStatus}>
                {hasSubmitted && (
                  <span className={styles.statusItem}>You submitted ✓</span>
                )}
                {opponentSubmitted && (
                  <span className={styles.statusItem}>Opponent submitted ✓</span>
                )}
              </div>

              <button
                type="button"
                className="tactile-btn-primary tactile-btn-sm"
                onClick={handleSubmit}
                disabled={hasSubmitted || isTimedOut}
              >
                {hasSubmitted ? "Submitted" : isTimedOut ? "Time's up" : "Submit Solution"}
              </button>
            </div>
          )}

          <Editor
            socketRef={socketRef}
            roomId={roomId}
            roomType={location.state?.roomType || "collab"}
            language={location.state?.roomType === "battle" ? language : "javascript"}
            readOnly={hasSubmitted || isTimedOut}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
