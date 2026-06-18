import assert from "node:assert/strict";
import test from "node:test";

import { calculateDueUrgency } from "../dueUrgency.js";

const now = "2026-06-18T12:00:00.000Z";

test("calculateDueUrgency marks overdue dates with highest score", () => {
  const urgency = calculateDueUrgency("2026-06-16", { now });

  assert.equal(urgency.urgency, "OVERDUE");
  assert.equal(urgency.daysUntilDue, -2);
  assert.equal(urgency.score, 102);
});

test("calculateDueUrgency marks dates due today", () => {
  const urgency = calculateDueUrgency("2026-06-18", { now });

  assert.equal(urgency.urgency, "DUE_TODAY");
  assert.equal(urgency.daysUntilDue, 0);
  assert.equal(urgency.score, 90);
});

test("calculateDueUrgency marks dates inside the due soon window", () => {
  const urgency = calculateDueUrgency("2026-06-22", {
    now,
    dueSoonDays: 7,
  });

  assert.equal(urgency.urgency, "DUE_SOON");
  assert.equal(urgency.daysUntilDue, 4);
  assert.equal(urgency.score, 76);
});

test("calculateDueUrgency handles activities without due date", () => {
  const urgency = calculateDueUrgency(null, { now });

  assert.equal(urgency.urgency, "NO_DUE_DATE");
  assert.equal(urgency.daysUntilDue, null);
  assert.equal(urgency.score, 0);
});
