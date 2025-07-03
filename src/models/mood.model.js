import mongoose from "mongoose";
import { MODE_TYPE } from "../constants/builder.constants.js";


const valueSchema = new mongoose.Schema(
  {
    value: {type : String, required : true},
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

const moodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    values: [valueSchema],
    },
    {
        timestamps: true
    }
);

moodSchema.statics.getAllValues = function () {
    return this.find(
        { "values.0": { $exists: true } },
        { name: 1, values: 1, createdAt: 1, updatedAt: 1 }
    );
};
  

const Mood = mongoose.model("Mood", moodSchema);

export default Mood;
