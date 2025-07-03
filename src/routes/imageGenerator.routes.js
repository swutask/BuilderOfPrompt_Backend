import express from "express";
import { generateImage, leonardoImageGenerate } from "../controllers/imageGenerator.controller.js";
import imageGenerateValidationRules from "../validators/imageGenerator.validators.js";
import validate from "../middlewares/validate.middleware.js";
import authenticateToken from "../middlewares/authenticate.middleware.js";


const router = express.Router();

router.post(
  "/generate-image",
  imageGenerateValidationRules.generateImage,
  validate,
  authenticateToken,  
  leonardoImageGenerate
);

export default router;
