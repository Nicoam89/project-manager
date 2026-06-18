const DAY_IN_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

const parseDate = (date) => {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate;
};

export const calculateDueUrgency = (
  dueDate,
  options = {}
) => {
  const due = parseDate(dueDate);

  if (!due) {
    return {
      urgency: "NO_DUE_DATE",
      daysUntilDue: null,
      score: 0,
      label: "Sin vencimiento",
      isOverdue: false,
    };
  }

  const dueSoonDays = Number.isFinite(
    Number(options.dueSoonDays)
  )
    ? Number(options.dueSoonDays)
    : 7;
  const today = startOfDay(
    parseDate(options.now) || new Date()
  );
  const dueDay = startOfDay(due);
  const daysUntilDue = Math.ceil(
    (dueDay.getTime() - today.getTime()) / DAY_IN_MS
  );

  if (daysUntilDue < 0) {
    const overdueDays = Math.abs(daysUntilDue);

    return {
      urgency: "OVERDUE",
      daysUntilDue,
      score: 100 + overdueDays,
      label: `Vencida hace ${overdueDays} día${overdueDays === 1 ? "" : "s"}`,
      isOverdue: true,
    };
  }

  if (daysUntilDue === 0) {
    return {
      urgency: "DUE_TODAY",
      daysUntilDue,
      score: 90,
      label: "Vence hoy",
      isOverdue: false,
    };
  }

  if (daysUntilDue <= dueSoonDays) {
    return {
      urgency: "DUE_SOON",
      daysUntilDue,
      score: 80 - daysUntilDue,
      label: `Vence en ${daysUntilDue} día${daysUntilDue === 1 ? "" : "s"}`,
      isOverdue: false,
    };
  }

  return {
    urgency: "UPCOMING",
    daysUntilDue,
    score: 20,
    label: `Vence en ${daysUntilDue} días`,
    isOverdue: false,
  };
};
