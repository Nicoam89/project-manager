import assert from "node:assert/strict";
import test from "node:test";

import { sortItems } from "../src/utils/urgencySort.js";

test("sortItems orders highest urgency first", () => {
  const items = [
    {
      title: "future",
      endDate: "2026-07-01",
      createdAt: "2026-06-01T00:00:00.000Z",
    },
    {
      title: "overdue",
      endDate: "2026-06-15",
      createdAt: "2026-06-02T00:00:00.000Z",
    },
    {
      title: "today",
      endDate: "2026-06-18",
      createdAt: "2026-06-03T00:00:00.000Z",
    },
  ];

  const sorted = sortItems(items, {
    dueDateField: "endDate",
    sortBy: "urgencyDesc",
  });

  assert.deepEqual(
    sorted.map((item) => item.title),
    ["overdue", "today", "future"]
  );
});
