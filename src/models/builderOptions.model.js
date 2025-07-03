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

const modeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    values: [valueSchema],
  },
  { _id: false }
);

const builderOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    modes: [modeSchema],
  },
  {
    timestamps: true,
  }
);

// This function get all the default value and user specific value
builderOptionSchema.statics.filteredWithUserId = function (userId) {
  return this.aggregate([
    {
      $addFields: {
        modes: {
          $map: {
            input: "$modes",
            as: "mode",
            in: {
              name: "$$mode.name",
              values: {
                $filter: {
                  input: "$$mode.values",
                  as: "val",
                  cond: {
                    $or: [
                      { $eq: ["$$val.type", "DEFAULT"] },
                      {
                        $and: [
                          { $eq: ["$$val.type", "USER"] },
                          {
                            $eq: ["$$val.userId", userId],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $match: {
        modes: {
          $elemMatch: {
            values: { $not: { $size: 0 } },
          },
        },
      },
    },
  ]);
};

builderOptionSchema.statics.onlyUserValues = function (userId) {
  return this.aggregate([
    {
      $addFields: {
        modes: {
          $map: {
            input: "$modes",
            as: "mode",
            in: {
              name: "$$mode.name",
              values: {
                $filter: {
                  input: "$$mode.values",
                  as: "val",
                  cond: {
                    $and: [
                      { $eq: ["$$val.type", "USER"] },
                      { $eq: ["$$val.userId", userId] },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        name: 1,
        createdAt: 1,
        updatedAt: 1,
        modes: {
          $filter: {
            input: "$modes",
            as: "mode",
            cond: { $gt: [{ $size: "$$mode.values" }, 0] },
          },
        },
      },
    },
    {
      $match: {
        "modes.0": { $exists: true }
      }
    }
  ]);
};

builderOptionSchema.statics.deleteUserValues = function (userId) {

  const uid = new mongoose.Types.ObjectId(userId);

  return this.updateMany(
    {},
    {
      $pull: {
        "modes.$[].values": {
          type: "USER",
          userId: uid,
        },
      },
    }
  );
};


const BuilderOption = mongoose.model("BuilderOption", builderOptionSchema);

export default BuilderOption;
