import { body } from "express-validator";
import validateFields from "../utils/validation.utils.js";

const builderValidationRules = {
  addBuilderOptions: [
    body("digitalProducts")
      .optional()
      .notEmpty()
      .withMessage("Digital Product field cannot be empty.")
      .isString()
      .withMessage("Digital Product field must be a string."),

    body("theme")
      .optional()
      .notEmpty()
      .withMessage("Theme field cannot be empty.")
      .isString()
      .withMessage("Theme field must be a string."),

    body("object")
      .optional()
      .notEmpty()
      .withMessage("Object field cannot be empty.")
      .isString()
      .withMessage("Object field must be a string."),

    body("objectDetails")
      .optional()
      .notEmpty()
      .withMessage("Object details field cannot be empty.")
      .isString()
      .withMessage("Object details field must be a string."),

    body("background")
      .optional()
      .notEmpty()
      .withMessage("Background field cannot be empty.")
      .isString()
      .withMessage("Background field must be a string."),

    body("vibe")
      .optional()
      .notEmpty()
      .withMessage("Vibe field cannot be empty.")
      .isString()
      .withMessage("Vibe field must be a string."),

    body("colorPlatte")
      .optional()
      .notEmpty()
      .withMessage("Color platte field cannot be empty.")
      .isString()
      .withMessage("Color platte field must be a string."),

    body("colorPreset")
      .optional()
      .notEmpty()
      .withMessage("Color preset field cannot be empty.")
      .isString()
      .withMessage("Color preset field must be a string."),

    body("basicStyle")
      .optional()
      .notEmpty()
      .withMessage("Basic style field cannot be empty.")
      .isString()
      .withMessage("Basic style field must be a string."),

    body("artStyle")
      .optional()
      .notEmpty()
      .withMessage("Art style field cannot be empty.")
      .isString()
      .withMessage("Art style field must be a string."),

    body("styleDetails")
      .optional()
      .notEmpty()
      .withMessage("Style details field cannot be empty.")
      .isString()
      .withMessage("Style details field must be a string."),

    body("stylizeValue")
      .optional()
      .notEmpty()
      .withMessage("Stylize value field cannot be empty.")
      .isString()
      .withMessage("Stylize value field must be a string."),

    body("aspectRatio")
      .optional()
      .notEmpty()
      .withMessage("Aspect ratio field cannot be empty.")
      .isString()
      .withMessage("Aspect ratio field must be a string."),

    body("exculdedParameters")
      .optional()
      .notEmpty()
      .withMessage("Excluded parameters field cannot be empty.")
      .isString()
      .withMessage("Excluded parameters field must be a string."),

    body().custom((value, { req }) => {
      if (Object.keys(req.body).length === 0) {
        throw new Error("Atleast one field is required.");
      }

      return true;
    }),

    validateFields([
      "digitalProducts",
      "theme",
      "object",
      "objectDetails",
      "background",
      "vibe",
      "colorPlatte",
      "colorPreset",
      "basicStyle",
      "artStyle",
      "styleDetails",
      "stylizeValue",
      "aspectRatio",
      "exculdedParameters",
    ]),
  ],
};

export default builderValidationRules;
