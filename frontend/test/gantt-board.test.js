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

const renderGanttBoard = async (props) => {
  const vite = await createServer({
    appType: "custom",
    server: { middlewareMode: true },
  });

  try {
    const { GanttBoardView } = await vite.ssrLoadModule(
      "/src/pages/GanttBoard.jsx"
    );

    return renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(GanttBoardView, props)
      )
    );
  } finally {
    await vite.close();
  }
};

test("GanttBoardView renders loading state", async () => {
  const html = await renderGanttBoard({
    isLoading: true,
    error: "",
    items: [],
  });

  assert.match(html, /Cargando tablero de Gantt/);
});

test("GanttBoardView renders objective, goal, and activity rows", async () => {
  const html = await renderGanttBoard({
    isLoading: false,
    error: "",
    items: [
      {
        id: "objective-1",
        type: "objective",
        label: "Objetivo",
        title: "Lanzar producto",
        status: "ACTIVE",
        progress: 40,
        startDate: new Date("2026-07-01T00:00:00.000Z"),
        endDate: new Date("2026-07-31T00:00:00.000Z"),
        href: "/objectives/objective-1",
        hasCompleteDates: true,
      },
      {
        id: "goal-1",
        type: "goal",
        label: "Meta",
        title: "Validar mercado",
        status: "IN_PROGRESS",
        progress: 60,
        startDate: new Date("2026-07-05T00:00:00.000Z"),
        endDate: new Date("2026-07-20T00:00:00.000Z"),
        href: "/goals/goal-1",
        hasCompleteDates: true,
      },
      {
        id: "activity-1",
        type: "activity",
        label: "Actividad",
        title: "Entrevistar usuarios",
        status: "COMPLETED",
        progress: 100,
        startDate: new Date("2026-07-08T00:00:00.000Z"),
        endDate: new Date("2026-07-12T00:00:00.000Z"),
        href: "/activities/activity-1",
        hasCompleteDates: true,
      },
    ],
  });

  assert.match(html, /Tablero de Gantt/);
  assert.match(html, /Lanzar producto/);
  assert.match(html, /Validar mercado/);
  assert.match(html, /Entrevistar usuarios/);
  assert.match(html, /Objetivos/);
  assert.match(html, /Metas/);
  assert.match(html, /Actividades/);
  assert.match(html, /100%/);
});

test("GanttBoardView warns about incomplete dates", async () => {
  const html = await renderGanttBoard({
    isLoading: false,
    error: "",
    items: [
      {
        id: "activity-1",
        type: "activity",
        label: "Actividad",
        title: "Actividad sin inicio",
        status: "PENDING",
        progress: 0,
        startDate: null,
        endDate: new Date("2026-07-12T00:00:00.000Z"),
        href: "/activities/activity-1",
        hasCompleteDates: false,
      },
    ],
  });

  assert.match(html, /Algunos elementos no tienen fecha de inicio o fin/);
});
