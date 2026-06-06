import Goal from "../models/Goal.js";
import Objective from "../models/Objective.js";
import Activity from "../models/Activity.js";


export const createGoal = async (
  req,
  res
) => {
  try {
    const objective =
      await Objective.findOne({
        _id: req.body.objective,
        owner: req.user._id,
      });

    if (!objective) {
      return res.status(404).json({
        message:
          "Objetivo no encontrado",
      });
    }

    const goal = await Goal.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getGoals = async (
  req,
  res
) => {
  try {
    const goals = await Goal.find({
      owner: req.user._id,
    })
      .populate("objective", "title")
      .sort({
        createdAt: -1,
      });

    res.json(goals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getGoalById = async (
  req,
  res
) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }).populate(
      "objective",
      "title"
    );

    if (!goal) {
      return res.status(404).json({
        message:
          "Meta no encontrada",
      });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateGoal = async (
  req,
  res
) => {
  try {
    const goal =
      await Goal.findOneAndUpdate(
        {
          _id: req.params.id,
          owner: req.user._id,
        },
        req.body,
        {
          new: true,
        }
      );

    if (!goal) {
      return res.status(404).json({
        message:
          "Meta no encontrada",
      });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteGoal = async (
  req,
  res
) => {
  try {
    const goal =
      await Goal.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id,
      });

    if (!goal) {
      return res.status(404).json({
        message:
          "Meta no encontrada",
      });
    }

    res.json({
      message:
        "Meta eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getGoalDetails =
  async (req, res) => {
    try {
      const goal = await Goal.findOne({
        _id: req.params.id,
        owner: req.user._id,
      }).populate(
        "objective",
        "title"
      );
      if (!goal) {
        return res.status(404).json({
          message: "Meta no encontrada",
        });
      }

      const activities =
        await Activity.find({
          goal: goal._id,
          owner: req.user._id,
        });

      const completed =
        activities.filter(
          (activity) =>
            activity.status ===
              "COMPLETED" ||
            activity.status ===
              "CLOSED"
        );

      const progress =
        activities.length > 0
          ? Math.round(
              (completed.length /
                activities.length) *
                100
            )
          : 0;

      res.json({
        goal,

        activities,

        stats: {
          activities:
            activities.length,

          completedActivities:
            completed.length,

          pendingActivities:
            activities.length -
            completed.length,

          progress,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };