// judge.routes.js
import { Router } from "express";
import {
  executeCode,
  evaluateCode,
} from "../controllers/judge.controller.js";


const router = Router();

// Temporary open route for testing Judge0 integration
router.post("/run", executeCode);
router.post("/evaluate", evaluateCode);


export default router;