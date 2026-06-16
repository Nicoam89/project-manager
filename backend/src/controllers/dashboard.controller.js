import Objective from "../models/Objective.js";
import Goal from "../models/Goal.js";
import Activity from "../models/Activity.js";
import { isCompletedActivityStatus } from "../utils/activityStatus.js";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const round = (value) => Math.round(value * 100) / 100;

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const sumTimeEntries = (activity) =>
  (activity.timeEntries || []).reduce(
    (total, entry) => total + toNumber(entry.hours),
    0
  );

export const getSummary = async (req, res) => {
  try {
    const owner = req.user._id;
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const soonLimit = new Date(
      today.getTime() + 7 * DAY_IN_MS
    );

    const [objectives, goals, activities] =
      await Promise.all([
        Objective.find({ owner }).select(
          "status progress"
        ),
        Goal.find({ owner }).select(
          "status progress"
        ),
        Activity.find({ owner }).select(
          "status dueDate estimatedHours timeEntries"
        ),
      ]);

    const completedObjectives = objectives.filter(
      (objective) =>
        objective.status === "COMPLETED"
    ).length;

    const completedGoals = goals.filter(
      (goal) => goal.status === "COMPLETED"
    ).length;

    const completedActivities = activities.filter(
      (activity) =>
        isCompletedActivityStatus(activity.status)
    ).length;

    const activeActivities =
      activities.length - completedActivities;

    const averageObjectiveProgress = objectives.length
      ? Math.round(
          objectives.reduce(
            (total, objective) =>
              total + toNumber(objective.progress),
            0
          ) / objectives.length
        )
      : 0;

    const averageGoalProgress = goals.length
      ? Math.round(
          goals.reduce(
            (total, goal) =>
              total + toNumber(goal.progress),
            0
          ) / goals.length
        )
      : 0;

    const totalEstimatedHours = activities.reduce(
      (total, activity) =>
        total + toNumber(activity.estimatedHours),
      0
    );

    const totalLoggedHours = activities.reduce(
      (total, activity) =>
        total + sumTimeEntries(activity),
      0
    );

    const overdueActivities = activities.filter(
      (activity) =>
        !isCompletedActivityStatus(activity.status) &&
        activity.dueDate &&
        activity.dueDate < today
    ).length;

    const dueSoonActivities = activities.filter(
      (activity) =>
        !isCompletedActivityStatus(activity.status) &&
        activity.dueDate &&
        activity.dueDate >= today &&
        activity.dueDate <= soonLimit
    ).length;

    const activityStatusCounts = activities.reduce(
      (counts, activity) => ({
        ...counts,
        [activity.status]:
          (counts[activity.status] || 0) + 1,
      }),
      {}
    );

    res.json({
      objectives: objectives.length,
      goals: goals.length,
      activities: activities.length,
      completedObjectives,
      completedGoals,
      completedActivities,
      activeActivities,
      overdueActivities,
      dueSoonActivities,
      averageObjectiveProgress,
      averageGoalProgress,
      activityCompletionRate: activities.length
        ? Math.round(
            (completedActivities / activities.length) *
              100
          )
        : 0,
      totalEstimatedHours: round(totalEstimatedHours),
      totalLoggedHours: round(totalLoggedHours),
      remainingEstimatedHours: round(
        Math.max(
          totalEstimatedHours - totalLoggedHours,
          0
        )
      ),
      activityStatusCounts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const mapAgendaItem = (item, type, dueDateField, parentLabel, today) => {
  const dueDate = item[dueDateField];
  const due = new Date(dueDate);

  return {
    id: item._id,
    type,
    title: item.title,
    description: item.description || "",
    status: item.status,
    dueDate,
    daysUntilDue: Math.ceil((due.getTime() - today.getTime()) / DAY_IN_MS),
    urgency: due < today ? "OVERDUE" : "DUE_SOON",
    parent: parentLabel,
  };
};

export const getAgenda = async (req, res) => {
  try {
    const owner = req.user._id;
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const soonLimit = new Date(
      today.getTime() + 7 * DAY_IN_MS
    );

    const [goals, activities] = await Promise.all([
      Goal.find({
        owner,
        status: { $ne: "COMPLETED" },
        endDate: { $ne: null, $lte: soonLimit },
      })
        .select(
          "title description status progress endDate objective"
        )
        .populate("objective", "title"),
      Activity.find({
        owner,
        dueDate: { $ne: null, $lte: soonLimit },
      })
        .select(
          "title description status dueDate priority goal"
        )
        .populate("goal", "title"),
    ]);

    const pendingActivities = activities.filter(
      (activity) =>
        !isCompletedActivityStatus(activity.status)
    );

    const agendaItems = [
      ...goals.map((goal) =>
        mapAgendaItem(
          goal,
          "GOAL",
          "endDate",
          goal.objective?.title || "Sin objetivo",
          today
        )
      ),
      ...pendingActivities.map((activity) =>
        mapAgendaItem(
          activity,
          "ACTIVITY",
          "dueDate",
          activity.goal?.title || "Sin meta",
          today
        )
      ),
    ].sort((first, second) => {
      const firstDate = new Date(first.dueDate).getTime();
      const secondDate = new Date(second.dueDate).getTime();

      return firstDate - secondDate;
    });

    res.json({
      generatedAt: now,
      dueSoonDays: 7,
      items: agendaItems,
      totals: {
        overdue: agendaItems.filter(
          (item) => item.urgency === "OVERDUE"
        ).length,
        dueSoon: agendaItems.filter(
          (item) => item.urgency === "DUE_SOON"
        ).length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
