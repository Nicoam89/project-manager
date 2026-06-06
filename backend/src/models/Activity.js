import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
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

    workflowType: {
      type: String,
      enum: [
        "STANDARD",
        "SCRUM",
        "KANBAN",
        "MARKETING",
        "CRM",
      ],
      default: "STANDARD",
    },

      status: {
        type: String,
        enum: [
          "PENDING",
          "IN_PROGRESS",
          "COMPLETED",
        ],
        default: "PENDING",
      },

    priorityType: {
      type: String,
      enum: [
        "STANDARD",
        "ALPHABETIC",
        "NUMERIC",
      ],
      default: "STANDARD",
    },

    priority: {
      type: String,
      default: "MEDIUM",
    },

    startDate: Date,

    dueDate: Date,

    completedAt: Date,

    estimatedHours: {
      type: Number,
      default: 0,
    },

    linkedActivities: [
      {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],

    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        text: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

      timeEntries: [
        {
          description: String,

          hours: {
            type: Number,
            required: true,
          },

          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],

      subtasks: [
        {
          title: String,

          completed: {
            type: Boolean,
            default: false,
          },
        },
      ],

      dependencies: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "Activity",
        },
      ],

  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Activity",
  activitySchema
);