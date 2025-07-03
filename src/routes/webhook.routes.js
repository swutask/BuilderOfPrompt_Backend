import express from "express";
import { sendWeburl, imagesGenerated } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post(
  "/send-weburl",
  express.raw({ type: "application/json" }),
  sendWeburl
);

// webhook for leonardo image generation

router.post(
  "/image-generation",
  express.json(),
  imagesGenerated
)

export default router;
