import { Router } from "express";
import { executeCode } from "../controllers/judge.controller.js";

const router = Router();

// Temporary open route for testing Judge0 integration
router.post("/run", executeCode);

export default router;