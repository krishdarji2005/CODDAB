import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BattleResult.module.css";

const BattleResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    isWinner,
    winnerUsername,
    result,
    reason,
  } = location.state || {};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {reason === "timeout" ? (
          <>
            <h1 className={styles.titleLose}>⏱️ Time's Up!</h1>
            <p className={styles.subtext}>Neither player solved the problem before time expired.</p>
          </>
        ) : isWinner ? (
          <>
            <h1 className={styles.titleWin}>🏆 You Won!</h1>
            <p className={styles.subtext}>You solved the problem first.</p>
          </>
        ) : (
          <>
            <h1 className={styles.titleLose}>Better Luck Next Time!</h1>
            <p className={styles.subtext}>{winnerUsername || "Your opponent"} won the battle.</p>
          </>
        )}

        {result && (
          <div className={styles.resultDetails}>
            <p>
              Your Result: <strong>{result.passedTests}</strong> / <strong>{result.totalTests}</strong> tests passed
            </p>
          </div>
        )}

        <button className={styles.homeBtn} onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BattleResult;
