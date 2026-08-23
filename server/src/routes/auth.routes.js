// src/routes/auth.routes.js – Authentication route definitions
import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import {authenticationMiddleware } from '../middlewares/auth.middleware.js'
import { getMe } from '../controllers/auth.controller.js'
const router = express.Router();

/**
 * Zod validation middleware factory.
 * Takes a Zod schema and returns an Express middleware that validates req.body.
 * If validation fails, responds with 400 and the Zod error details.
 * If validation passes, replaces req.body with the parsed (clean) data and calls next().
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    // Replace body with parsed data (strips unknown fields)
    req.body = result.data;
    next();
  };
}

// POST /api/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

router.get('/me',authenticationMiddleware, getMe);

export default router;
