import Activity from "../models/Activity.js";
import Goal from "../models/Goal.js";

import {
  getInitialWorkflowStatus,
  isWorkflowStatus,
} from "../utils/workflows.js";
import { pickAllowedFields } from "../utils/payload.js";
import { activityUpdateFields } from "../validators/activity.validator.js";
import { calculateDueUrgency } from "../../../shared/dueUrgency.js";

const withDueUrgency = (activity) => {
  const data = activity.toObject
    ? activity.toObject()
    : activity;

  return {
    ...data,
    dueUrgency: calculateDueUrgency(data.dueDate),
  };
};

export const createActivity = async (
  req,
  res
) => {
  try {
    const goal = await Goal.findOne({
      _id: req.body.goal,
      owner: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Meta no encontrada",
      });
    }

    const workflowType =
      req.body.workflowType ||
      "STANDARD";

    const activity =
      await Activity.create({
        ...req.body,
        workflowType,
        status: getInitialWorkflowStatus(
          workflowType
        ),

        owner: req.user._id,
      });


    res.status(201).json(withDueUrgency(activity));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getActivityById = async (
  req,
  res
) => {
  try {
    const activity =
      await Activity.findOne({
        _id: req.params.id,
        owner: req.user._id,
      }).populate(
        "goal",
        "title"
      );

    if (!activity) {
      return res.status(404).json({
        message:
          "Actividad no encontrada",
      });
    }

    res.json(withDueUrgency(activity));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateActivity = async (
  req,
  res
) => {
  try {
    if (req.body.goal) {
      const goal = await Goal.findOne({
        _id: req.body.goal,
        owner: req.user._id,
      });

      if (!goal) {
        return res.status(404).json({
          message: "Meta no encontrada",
        });
      }
    }

const existingActivity =
      await Activity.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });

    if (!existingActivity) {
      return res.status(404).json({
        message:
          "Actividad no encontrada",
      });
    }

    const updatePayload = pickAllowedFields(
      req.body,
      activityUpdateFields
    );

    const workflowType =
      updatePayload.workflowType ||
      existingActivity.workflowType;

    const status = updatePayload.status;

    if (
      status &&
      !isWorkflowStatus(
        workflowType,
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Estado inválido para el flujo de trabajo",
      });
    }

    if (
      updatePayload.workflowType &&
      !updatePayload.status &&
      !isWorkflowStatus(
        updatePayload.workflowType,
        existingActivity.status
      )
    ) {
      updatePayload.status =
        getInitialWorkflowStatus(
          updatePayload.workflowType
        );
    }

    const activity =
      await Activity.findOneAndUpdate(
        {
          _id: req.params.id,
          owner: req.user._id,
        },
        updatePayload,
        {
          new: true,
          runValidators: true,

        }
      );

    if (!activity) {
      return res.status(404).json({
        message:
          "Actividad no encontrada",
      });
    }

    res.json(withDueUrgency(activity));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteActivity = async (
  req,
  res
) => {
  try {
    const activity =
      await Activity.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id,
      });

    if (!activity) {
      return res.status(404).json({
        message:
          "Actividad no encontrada",
      });
    }

    res.json({
      message:
        "Actividad eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getActivityDetails =
  async (req, res) => {
    try {
      const activity =
        await Activity.findOne({
          _id: req.params.id,
          owner: req.user._id,
        })
          .populate(
            "dependencies",
            "title status"
          )
          .populate(
            "goal",
            "title"
          );

      if (!activity) {
        return res.status(404).json({
          message:
            "Actividad no encontrada",
        });
      }

      const trackedHours =
        activity.timeEntries.reduce(
          (sum, entry) =>
            sum + Number(entry.hours),
          0
        );

      const completedSubtasks =
        activity.subtasks.filter(
          (subtask) =>
            subtask.completed
        );

      res.json({
         activity: withDueUrgency(activity),

        stats: {
          trackedHours,

          subtasks:
            activity.subtasks.length,

          completedSubtasks:
            completedSubtasks.length,

          comments:
            activity.comments.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const addTimeEntry =
  async (req, res) => {
    try {
      const activity =
        await Activity.findOne({
          _id: req.params.id,
          owner: req.user._id,
        });

      if (!activity) {
        return res.status(404).json({
          message:
            "Actividad no encontrada",
        });
      }

      activity.timeEntries.push({
        description:
          req.body.description,

        hours: Number(req.body.hours),

        user: req.user._id,
      });

      await activity.save();

      res.status(201).json({
        message:
          "Tiempo registrado",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const updateActivityStatus =
  async (req, res) => {
    try {
      const activity =
        await Activity.findOne({
          _id: req.params.id,
          owner: req.user._id,
        });

      if (!activity) {
        return res.status(404).json({
          message:
            "Actividad no encontrada",
        });
      }

      if (
        !isWorkflowStatus(
          activity.workflowType,
          req.body.status
        )
      ) {
        return res.status(400).json({
          message:
            "Estado inválido para el flujo de trabajo",
        });
      }

      activity.status = req.body.status;

      await activity.save();

      res.json(withDueUrgency(activity));
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  export const getActivities =
  async (req, res) => {
    try {
      const filter = {
        owner: req.user._id,
      };

      if (
        req.query.workflowType
      ) {
        filter.workflowType =
          req.query.workflowType;
      }

      const activities =
        await Activity.find(filter)
          .populate("goal", "title")
          .sort({
            createdAt: -1,
          });

       res.json(
        activities.map((activity) =>
          withDueUrgency(activity)
        )
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
