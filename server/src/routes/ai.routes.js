// src/routes/ai.routes.js - AI API Routes
import { Router } from 'express';
import { reviewCode } from '../controllers/ai.controller.js';

const router = Router();

router.post('/review', reviewCode);

export default router;
