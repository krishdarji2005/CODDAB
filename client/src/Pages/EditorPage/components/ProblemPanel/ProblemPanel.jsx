import React from "react";
import styles from "./ProblemPanel.module.css";

const ProblemPanel = ({ problem }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.badge}>{problem?.difficulty || "Easy"}</span>
        <h2 className={styles.title}>{problem?.title || "Waiting for problem..."}</h2>
      </div>

      {problem?.description?.map((para, index) => (
        <p key={index} className={styles.description}>
          {para}
        </p>
      ))}

      {problem?.examples?.map((example, index) => (
        <div key={index} className={styles.section}>
          <h3>{example.title}</h3>
          <pre className={styles.code}>{example.content}</pre>
        </div>
      ))}

      {problem?.constraints && (
        <div className={styles.section}>
          <h3>Constraints</h3>
          <ul>
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProblemPanel;
  