import assert from "node:assert/strict";
import test from "node:test";

import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const renderTimeline = async (props) => {
  const vite = await createServer({
    appType: "custom",
    server: { middlewareMode: true },
  });

  try {
    const { TimelineView } = await vite.ssrLoadModule(
      "/src/pages/Timeline.jsx"
    );

    return renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(TimelineView, props)
      )
    );
  } finally {
    await vite.close();
  }
};

test("TimelineView renders loading state", async () => {
  const html = await renderTimeline({
    isLoading: true,
    error: "",
    events: [],
  });

  assert.match(html, /Cargando línea de tiempo/);
});

test("TimelineView renders chronological planning events", async () => {
  const html = await renderTimeline({
    isLoading: false,
    error: "",
    events: [
      {
        id: "goal-1",
        type: "goal",
        title: "Validar mercado",
        description: "Entender usuarios clave",
        status: "IN_PROGRESS",
        startDate: new Date("2026-07-05T00:00:00.000Z"),
        dueDate: new Date("2026-07-20T00:00:00.000Z"),
        href: "/goals/goal-1",
        parent: "Lanzar producto",
      },
      {
        id: "activity-1",
        type: "activity",
        title: "Entrevistar usuarios",
        description: "Hablar con cinco usuarios",
        status: "PENDING",
        startDate: new Date("2026-07-08T00:00:00.000Z"),
        dueDate: new Date("2026-07-12T00:00:00.000Z"),
        href: "/activities/activity-1",
        parent: "Validar mercado",
      },
    ],
  });

  assert.match(html, /Línea de tiempo/);
  assert.match(html, /Validar mercado/);
  assert.match(html, /Entrevistar usuarios/);
  assert.match(html, /Relacionado con/);
  assert.match(html, /julio de 2026/);
});
