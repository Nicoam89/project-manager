import Objective from "../models/Objective.js";
import Goal from "../models/Goal.js";
import Activity from "../models/Activity.js";

export const getSummary = async (
  req,
  res
) => {
  try {
    const owner = req.user._id;

    const objectives =
      await Objective.countDocuments({
        owner,
      });

    const goals =
      await Goal.countDocuments({
        owner,
      });

    const activities =
      await Activity.countDocuments({
        owner,
      });

    res.json({
      objectives,
      goals,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};