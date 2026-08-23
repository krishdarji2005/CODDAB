import { runCode } from "../services/codeExecution.service.js";

export async function executeCode(req, res) {
  try {
    const { sourceCode, language = "cpp", stdin = "" } = req.body;

    if (!sourceCode) {
      return res.status(400).json({
        success: false,
        message: "sourceCode is required",
      });
    }

    const result = await runCode({
      sourceCode,
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