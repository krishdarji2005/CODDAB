// ye service apan use krege for 
//Responsibility:

// take sourceCode, language, stdin
// map language → Judge0 language_id (C++ = 54)
// POST to ${JUDGE0_URL}/submissions?base64_encoded=true&wait=true
// return Judge0 result
// throw clear errors if Judge0 is down

const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358";

const LANGUAGE_IDS = {
  cpp: 54,         // C++ (GCC 9.2.0)
  javascript: 63,  // Node.js
};

function decodeBase64(val) {
  return val ? Buffer.from(val, "base64").toString("utf-8") : val;
}

export async function runCode({ sourceCode, language = "cpp", stdin = "" }) {
  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  if (!sourceCode || !sourceCode.trim()) {
    throw new Error("sourceCode is required");
  }

  const encodedSourceCode = Buffer.from(sourceCode, "utf-8").toString("base64");
  const encodedStdin = stdin ? Buffer.from(stdin, "utf-8").toString("base64") : "";

  const response = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: encodedSourceCode,
        language_id: languageId,
        stdin: encodedStdin,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Judge0 request failed: ${response.status} ${text}`);
  }

  const data = await response.json();

  return {
    ...data,
    stdout: decodeBase64(data.stdout),
    stderr: decodeBase64(data.stderr),
    compile_output: decodeBase64(data.compile_output),
    message: decodeBase64(data.message),
  };
}