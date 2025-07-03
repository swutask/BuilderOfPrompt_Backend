import { body } from "express-validator";
import validateFields from "../utils/validation.utils.js";

const userValidationRules = {
  verifyUser: [
    body("token")
      .exists()
      .withMessage("Token field is required.")
      .notEmpty()
      .withMessage("Token field cannot be empty.")
      .isString()
      .withMessage("Token field must be a string."),

    validateFields(["token"]),
  ],
};

export default userValidationRules;
