import User from "../models/user.model.js";
import WebhookLog from "../models/webhookLog.model.js";
import Prompt from "../models/prompt.model.js";
import { removeFile, savePromptImage } from "../utils/file.utils.js";
import { sendWebUrlEmail } from "../services/email.services.js";
import {
  generateFallbackShopifyEventId,
  generateTokenFromEmail,
  verifyShopifyWebhook,
} from "../utils/encryption.utils.js";
import logger from "../utils/logger.utils.js";
import dotenv from "dotenv";
import { VARIANTS_MAPPING } from "../constants/webhook.constants.js";
dotenv.config();

export const sendWeburl = async (req, res) => {
  let response;

  let eventId = req.headers["x-shopify-event-id"];
  const hmacSecret = req.headers["x-shopify-hmac-sha256"];

  const fallbackEventId = generateFallbackShopifyEventId();

  const usedEventId = eventId || fallbackEventId;

  let webhookLogId;

  const parsedBody = JSON.parse(req.body.toString("utf8"));

  try {
    const newLog = await WebhookLog.create({
      eventId: usedEventId,
      headers: req.headers,
      request: parsedBody,
      status: "PENDING",
    });

    webhookLogId = newLog._id;

    if (!eventId) {
      response = { success: false, message: "Event ID is required" };
      return res.status(400).json(response);
    }

    const existingWebhook = await WebhookLog.findOne({
      eventId: usedEventId,
      _id: { $ne: webhookLogId },
    });

    if (existingWebhook) {
      response = { success: false, mesage: "Duplicate webhook." };
      return res.status(200).json();
    }

    if (!hmacSecret) {
      response = { success: false, message: "Hmac Secret is required." };
      return res.status(400).json(response);
    }

    if (!verifyShopifyWebhook(hmacSecret, req.body)) {
      response = { success: false, message: "Unauthorized." };
      return res.status(401).json(response);
    }

    const { email, user_id: userId, line_items: purchases } = parsedBody;

    const variants = purchases?.map((purchase) => purchase?.variant_id);

    let tokens = 0;

    variants?.map((variantId) => {
      if (variantId in VARIANTS_MAPPING) {
        tokens += VARIANTS_MAPPING[variantId]?.tokens;
      }
    });

    let existingUser = null;

    existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.wallet += tokens;

      existingUser.save();
    } else {
      const token = generateTokenFromEmail(email);
      const wallet = tokens;

      existingUser = await User.create({
        email,
        userId,
        token,
        wallet,
      });
    }

    await sendWebUrlEmail({
      email,
      token: existingUser?.token,
    });

    response = { success: true, message: "Webhook received." };
    return res.status(200).json(response);
  } catch (error) {
    logger.error(
      "An error occurred while send web url controller: %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    response = {
      success: false,
      message:
        error?.message ??
        `An error occurred while send web url: ${error.message}`,
    };
    return res.status(error?.statusCode ?? 500).json(response);
  } finally {
    if (webhookLogId) {
      await WebhookLog.updateOne(
        { _id: webhookLogId },
        { $set: { status: response.success ? "SUCCESS" : "FAILED", response } }
      );
    }
  }
};

export const imagesGenerated = async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const callbackKey = auth.replace(/^Bearer\s+/i, "").trim();

    if (callbackKey !== process.env.LEONARDO_WEBHOOK_API_KEY) {
      return res.status(401).json({ message: "Unauthorized webhook" });
    }

    const { data: { object: { id: generationId, images = [] } = {} } = {} } =
      req.body;

    if (!generationId || !images.length) {
      console.warn("Invalid webhook payload:", req.body);
      return res.sendStatus(400);
    }

    const urls = images.map(({ url }) => url).filter(Boolean);

    if (!urls.length) {
      console.warn("No valid URLs in payload for", generationId);
      return res.sendStatus(400);
    }

    const prompt = await Prompt.findOne({ generationId });

    const userId = prompt.userId;

    await User.findByIdAndUpdate(
      userId,
      { $inc: { wallet: -3 } },
      { new: true }
    );

    if (!prompt) {
      console.error("Prompt not found for", generationId);
      return res.sendStatus(404);
    }

    const savedImages = await Promise.all(
      urls.map((url) => savePromptImage(url, prompt.userId))
    );

    prompt.images.push(...savedImages);
    prompt.isGenerating = false;

    await prompt.save();

    console.log(`Stored ${savedImages.length} images for prompt ${prompt._id}`);
    return res.sendStatus(204);
  } catch (err) {
    console.error("imagesGenerated error:", err);
    return res.sendStatus(500);
  }
};
