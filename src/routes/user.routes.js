import express from "express";
import { getMyDetails, verifyUser } from "../controllers/user.controller.js";
import userValidationRules from "../validators/user.validators.js";
import validate from "../middlewares/validate.middleware.js";
import authenticateToken from "../middlewares/authenticate.middleware.js";

const router = express.Router();

router.post(
  "/verify-user",
  userValidationRules.verifyUser,
  validate,
  verifyUser
);

router.get("/me", authenticateToken, getMyDetails);

export default router;