import React from "react";
import styles from "./ProblemPanel.module.css";

const ProblemPanel = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.badge}>Easy</span>
        <h2 className={styles.title}>Two Sum</h2>
      </div>

      <p className={styles.description}>
        Given an array of integers <code>nums</code> and an integer{" "}
        <code>target</code>, return indices of the two numbers such that they
        add up to <code>target</code>.
      </p>

      <p className={styles.description}>
        You may assume that each input would have exactly one solution, and
        you may not use the same element twice.
      </p>

      <div className={styles.section}>
        <h3>Example 1</h3>
        <pre className={styles.code}>
          {`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] == 9`}
        </pre>
      </div>

      <div className={styles.section}>
        <h3>Constraints</h3>
        <ul>
          <li>2 ≤ nums.length ≤ 10⁴</li>
          <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
          <li>Only one valid answer exists</li>
        </ul>
      </div>
    </div>
  );
};

export default ProblemPanel;
  