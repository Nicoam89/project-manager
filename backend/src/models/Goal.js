import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    objective: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Objective",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "BOOLEAN",
        "MONETARY",
        "HOURS",
        "QUALITATIVE",
        "ACTIVITIES",
      ],
      required: true,
    },

    targetValue: {
      type: mongoose.Schema.Types.Mixed,
         required() {
        return ![
          "ACTIVITIES",
          "QUALITATIVE",
        ].includes(this.type);
      },
    },

    startDate: Date,

    endDate: Date,

    comments: {
      type: String,
      default: "",
    },

    currentValue: {
      type: mongoose.Schema.Types.Mixed,
      default: 0,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Goal",
  goalSchema
);