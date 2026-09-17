// src/services/testcase.service.js
import { runCode } from "./codeExecution.service.js";
import { problems } from "../data/problems.js";


function normalizeOutput(output) {
  return (output || "").trim();
}

export async function evaluateSubmission({
  problemId,
  sourceCode,
  language = "cpp",
}) {
  const problem = problems[problemId];

if (!problem) {
  throw new Error(`Problem not found: ${problemId}`);
}

  const driverTemplate = problem.driverCode?.[language];
  const executableCode = driverTemplate
    ? driverTemplate.replace("{{USER_CODE}}", sourceCode)
    : sourceCode;

  const testCases = problem.testCases;
  const results = [];

  for (const testCase of testCases) {
    const result = await runCode({
      sourceCode: executableCode,
      language,
      stdin: testCase.input,
    });

    const actualOutput = normalizeOutput(result.stdout);
    const expectedOutput = normalizeOutput(testCase.expectedOutput);

    const passed = actualOutput === expectedOutput;

    results.push({
      passed,
      input: testCase.input,
      expectedOutput,
      actualOutput,
      status: result.status,
      time: result.time,
      memory: result.memory,
    });

    // Stop immediately if compilation/runtime error occurs.
    if (result.status?.id !== 3) {
      break;
    }
  }

  const passedTests = results.filter((test) => test.passed).length;

  return {
   success: passedTests === testCases.length,
    passedTests,
 totalTests: testCases.length,
    results,
  };
}