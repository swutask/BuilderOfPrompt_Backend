import { body, param } from "express-validator";
import validateFields from "../utils/validation.utils.js";
import { PROMPT_TYPE } from "../constants/builder.constants.js";
import { isValidObjectId } from "mongoose";

const builderValidationRules = {
  savePrompt: [
    body("prompt")
      .exists()
      .withMessage("Prompt field is required.")
      .notEmpty()
      .withMessage("Prompt field cannot be empty.")
      .isString()
      .withMessage("Prompt field must be a valid string."),

    validateFields(["prompt"]),
  ],

  deletePrompt: [
    param("promptId")
      .exists()
      .withMessage("PromptId field is required.")
      .notEmpty()
      .withMessage("PromptId field cannot be empty.")
      .isString()
      .withMessage("PromptId field must be a valid string.")
      .custom((value) => {
        if (!isValidObjectId(value)) {
          throw new Error("PromptId should be a valid object id.");
        }

        return true;
      }),
  ],
};

export default builderValidationRules;
