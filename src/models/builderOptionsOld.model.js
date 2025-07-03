import mongoose from "mongoose";
import { MODE_TYPE } from "../constants/builder.constants.js";

const valueSchema = new mongoose.Schema(
  {
    value: String,
    type: {
      type: String,
      enum: MODE_TYPE,
      required: true,
      default: "DEFAULT",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "USER";
      },
    },
  },
  { _id: false }
);

const builderOptionSchema = new mongoose.Schema({
  digitalProduct: [valueSchema],
  theme: [valueSchema],
  object: [valueSchema],
  objectDetails: [valueSchema],
  background: [valueSchema],
  vibe: [valueSchema],
  // customObject: String,
  // customDetails: String,

  colorPlatte: [valueSchema],
  colorPreset: [valueSchema],
  // customColor: [valueSchema],
  basicStyle: [valueSchema],
  artStyle: [valueSchema],
  styleDetails: [valueSchema],
  // customStyle: [valueSchema],

  midJourneyVersion: [valueSchema],
  stylizeValue: [valueSchema],
  aspectRatio: [valueSchema],
  // imageReference: [valueSchema],
  // characterReference: [valueSchema],
  // styleReference: [valueSchema],
  excludedParameters: [valueSchema],
});

const BuilderOption = mongoose.model("BuilderOption", builderOptionSchema);

export default BuilderOption;
