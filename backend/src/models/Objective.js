import mongoose from "mongoose";

const objectiveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "COMPLETED",
        "ARCHIVED",
      ],
      default: "ACTIVE",
    },

    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Objective",
  objectiveSchema
);