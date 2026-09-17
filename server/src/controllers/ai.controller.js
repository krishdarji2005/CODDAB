// src/controllers/ai.controller.js - AI Review Controller
import { generateCodeReview } from '../services/ai.service.js';

export async function reviewCode(req, res) {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Code is required to perform an AI review',
      });
    }

    const review = await generateCodeReview({
      code,
      language,
    });

    return res.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('AI Review Error:', error.message);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate code review',
    });
  }
}
