import express from "express";
import { analyzeSentiment } from "../controllers/sentimentController.js";

const router = express.Router();

// Route to analyze sentiment of a text
router.post("/sentiment", analyzeSentiment);

export default router;
