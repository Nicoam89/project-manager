import Activity from "../models/Activity.js";
import Goal from "../models/Goal.js";

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

    const activity =
      await Activity.create({
        ...req.body,
        owner: req.user._id,
      });

    await Goal.findByIdAndUpdate(
      goal._id,
      {
        $inc: {
          activitiesCount: 1,
        },
      }
    );

    res.status(201).json(activity);
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

    res.json(activity);
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

    const activity =
      await Activity.findOneAndUpdate(
        {
          _id: req.params.id,
          owner: req.user._id,
        },
        req.body,
        {
          new: true,
        }
      );

    if (!activity) {
      return res.status(404).json({
        message:
          "Actividad no encontrada",
      });
    }

    res.json(activity);
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
            sum + entry.hours,
          0
        );

      const completedSubtasks =
        activity.subtasks.filter(
          (subtask) =>
            subtask.completed
        );

      res.json({
        activity,

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

        hours: req.body.hours,

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
        await Activity.findOneAndUpdate(
          {
            _id: req.params.id,
            owner: req.user._id,
          },
          {
            status: req.body.status,
          },
          {
            new: true,
          }
        );

      if (!activity) {
        return res.status(404).json({
          message:
            "Actividad no encontrada",
        });
      }

      res.json(activity);
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
        await Activity.find(
          filter
        );

      res.json(
        activities
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };