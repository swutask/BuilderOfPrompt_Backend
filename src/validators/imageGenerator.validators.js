import { body } from "express-validator";
import validateFields from "../utils/validation.utils.js";

const imageGenerateValidationRules = {
  generateImage: [
    body("prompt")
      .exists()
      .withMessage("Prompt field is required.")
      .notEmpty()
      .withMessage("Prompt field cannot be empty.")
      .isString()
      .withMessage("Prompt field must be a string."),

    validateFields(["prompt"]),
  ],
};

export default imageGenerateValidationRules;
