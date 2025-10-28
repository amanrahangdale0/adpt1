import express from "express";
import { generateMiniGoals, extractNotesController } from "../controllers/goalsController.js";
const router = express.Router();

router.post("/generate", generateMiniGoals);
router.post("/notes/extract", extractNotesController);

export default router;
