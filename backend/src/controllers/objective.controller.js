import Objective from "../models/Objective.js";
import Goal from "../models/Goal.js";
import Activity from "../models/Activity.js";

export const createObjective = async (
  req,
  res
) => {
  try {
    const objective =
      await Objective.create({
        ...req.body,
        owner: req.user._id,
      });

    res.status(201).json(objective);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getObjectives = async (
  req,
  res
) => {
  try {
    const objectives =
      await Objective.find({
        owner: req.user._id,
      }).sort({
        createdAt: -1,
      });

    res.json(objectives);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getObjectiveById = async (
  req,
  res
) => {
  try {
    const objective =
      await Objective.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });

    if (!objective) {
      return res.status(404).json({
        message:
          "Objetivo no encontrado",
      });
    }

    res.json(objective);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateObjective = async (
  req,
  res
) => {
  try {
    const objective =
      await Objective.findOneAndUpdate(
        {
          _id: req.params.id,
          owner: req.user._id,
        },
        req.body,
        {
          new: true,
        }
      );

    if (!objective) {
      return res.status(404).json({
        message:
          "Objetivo no encontrado",
      });
    }

    res.json(objective);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteObjective = async (
  req,
  res
) => {
  try {
    const objective =
      await Objective.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id,
      });

    if (!objective) {
      return res.status(404).json({
        message:
          "Objetivo no encontrado",
      });
    }

    res.json({
      message:
        "Objetivo eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getObjectiveDetails =
  async (req, res) => {
    try {
      const objective =
        await Objective.findOne({
          _id: req.params.id,
          owner: req.user._id,
        });

      if (!objective) {
        return res.status(404).json({
          message:
            "Objetivo no encontrado",
        });
      }

      const goals = await Goal.find({
        objective: objective._id,
        owner: req.user._id,
      });

      const goalIds = goals.map(
        (g) => g._id
      );

      const activities =
        await Activity.find({
          goal: {
            $in: goalIds,
          },
          owner: req.user._id,
        });

      const completedActivities =
        activities.filter(
          (a) =>
            a.status ===
              "COMPLETED" ||
            a.status === "CLOSED"
        );

      res.json({
        objective,
        goals,

        stats: {
          goals: goals.length,

          activities:
            activities.length,

          completedActivities:
            completedActivities.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };