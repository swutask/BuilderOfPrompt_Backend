import mongoose from "mongoose";
import { WEBHOOK_LOG_STATUS } from "../constants/webhook.constants.js";

const webhookLogSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
    },
    headers: {
      type: Object,
      required: true,
    },
    request: {
      type: Object,
      required: true,
    },
    response: {
      type: Object,
    },
    status: {
      type: String,
      enum: WEBHOOK_LOG_STATUS,
      required: true,
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const WebhookLog = mongoose.model("WebhookLog", webhookLogSchema);

export default WebhookLog;
