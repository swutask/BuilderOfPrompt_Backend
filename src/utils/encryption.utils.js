import crypto from "crypto";
import logger from "./logger.utils.js";

export const generateTokenFromEmail = (email) => {
  return crypto.createHash("sha256").update(email).digest("hex");
};

export const verifyShopifyWebhook = (hmac, body) => {
  try {
    const digest = crypto
      .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SIGNING_SECRET)
      .update(body, "utf8")
      .digest("base64");
    return digest === hmac;
  } catch (error) {
    logger.error(
      "An error occurred while verify shopify webhook util : %s",
      error.message
    );
    throw error;
  }
};

export const generateFallbackShopifyEventId = () => {
  return `fallback_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
};
