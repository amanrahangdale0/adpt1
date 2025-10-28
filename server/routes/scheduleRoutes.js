import express from "express";
import { generateAISchedule } from "../controllers/scheduleController.js";
const router = express.Router();

router.post("/", generateAISchedule);

export default router;
