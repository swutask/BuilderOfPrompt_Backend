import express from "express";

import {
  generateChatGptResponse,
  generateMoodBasedResponse,
  saveResponse,
  clearHistory,
  getUserHistory,
  getUserSavedPrompts,
  deleteSavedPrompt,
  generateCreativeSpark,
} from "../controllers/prompt.controller.js";

import authenticateToken from "../middlewares/authenticate.middleware.js";

import promptValidationRules from "../validators/prompt.validators.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/chatGptResponse", authenticateToken, generateChatGptResponse);

router.post("/moodBasedResponse", authenticateToken, generateMoodBasedResponse);

router.post(
  "/save-prompt",
  authenticateToken,
  promptValidationRules.savePrompt,
  validate,
  saveResponse
);

router.delete("/clear-history", authenticateToken, clearHistory);

router.get("/get-history", authenticateToken, getUserHistory);

router.get("/get-saved-prompts", authenticateToken, getUserSavedPrompts);

router.delete(
  "/delete-saved-prompt/:promptId",
  authenticateToken,
  promptValidationRules.deletePrompt,
  validate,
  deleteSavedPrompt
);

router.post("/creativeSpark", authenticateToken, generateCreativeSpark);

export default router;
