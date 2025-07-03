import mongoose from "mongoose";
import { PROMPT_TYPE } from "../constants/builder.constants.js";

const schema = mongoose.Schema;

const promptSchema = new schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: PROMPT_TYPE,
    default: "HISTORY",
  },
  generationId: {
    type: String
  },
  isGenerating: {
    type: Boolean
  },
  images: {
    type: Array,
  },
},
  {
  timestamps: true
  }
);

const Prompt = mongoose.model("Prompt", promptSchema);

export default Prompt;
