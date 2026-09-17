// src/services/ai.service.js - Gemini AI Code Review Service

export async function generateCodeReview({ code, language = 'javascript' }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please add it to your server .env file.');
  }

  const systemPrompt = `You are a senior staff engineer performing a concise, high-signal code review.
Evaluate the given code focusing on:
1. Correctness & potential bugs
2. Edge cases
3. Time & space complexity
4. Clean code & best practice recommendations

Keep the review concise, constructive, actionable, and structured with clear markdown headings and bullet points.`;

  const modelsToTry = [
    process.env.GEMINI_MODEL,
    'gemini-3.6-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ].filter(Boolean);

  const requestBody = {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        parts: [
          {
            text: `Please review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
          },
        ],
      },
    ],
  };

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.error?.message || response.statusText || 'Failed to call Gemini API';
        lastError = new Error(`Gemini API error (${model}): ${errorMsg}`);
        // If it's a model not found / deprecated error, try the next model
        if (response.status === 404 || errorMsg.includes('not found') || errorMsg.includes('not available') || errorMsg.includes('deprecated')) {
          continue;
        }
        throw lastError;
      }

      const reviewText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reviewText) {
        return reviewText;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('No review response received from Gemini.');
}
