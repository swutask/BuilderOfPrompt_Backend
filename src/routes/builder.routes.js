import express from "express";
import {
  addBuilderOptions,
  getBuilderOptions,
  getUserOptions,
  deleteUserSetting
} from "../controllers/builder.controller.js";
import authenticateToken from "../middlewares/authenticate.middleware.js";
import builderValidationRules from "../validators/builder.validators.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, getBuilderOptions);

router.post(
  "/",
  authenticateToken,
  builderValidationRules.addBuilderOptions,
  validate,
  addBuilderOptions
);

router.get("/user", authenticateToken, getUserOptions);

router.delete("/delete/setting", authenticateToken, deleteUserSetting);


export default router;
