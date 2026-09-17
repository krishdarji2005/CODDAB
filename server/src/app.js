// src/app.js – Express app configuration
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import judgeRoutes from "./routes/judge.routes.js";
import aiRoutes from "./routes/ai.routes.js";
const app = express();

// Basic middleware – can be extended later
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Coddab API is running 🚀' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/judge', judgeRoutes);
app.use('/api/ai', aiRoutes);

export default app;
