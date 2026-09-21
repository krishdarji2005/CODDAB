// judge.controller.js
import { runCode } from "../services/codeExecution.service.js";
import { evaluateSubmission } from "../services/testcase.service.js";
import { problems } from "../data/problems.js";

export async function executeCode(req, res) {
  try {
    const { problemId, sourceCode, language = "cpp", stdin = "" } = req.body;

    if (!sourceCode) {
      return res.status(400).json({
        success: false,
        message: "sourceCode is required",
      });
    }

    let executableCode = sourceCode;

    if (problemId) {
      const problem = problems[problemId];
      if (!problem) {
        return res.status(400).json({
          success: false,
          message: `Problem not found: ${problemId}`,
        });
      }

      const driverTemplate = problem.driverCode?.[language];
      if (driverTemplate) {
        executableCode = driverTemplate.replace("{{USER_CODE}}", sourceCode);
      }
    }

    const result = await runCode({
      sourceCode: executableCode,
      language,
      stdin,
    });

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("executeCode error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Code execution failed",
    });
  }
}

export async function evaluateCode(req, res) {
  try {
   const {
  problemId,
  sourceCode,
  language = "cpp",
} = req.body;

    if (!sourceCode) {
      return res.status(400).json({
        success: false,
        message: "sourceCode is required",
      });
    }

   const result = await evaluateSubmission({
  problemId,
  sourceCode,
  language,
});

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("evaluateCode error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Code evaluation failed",
    });
  }
}

/*
// /run
// -> execute code once
//
// /evaluate
// -> run code against test cases
*/