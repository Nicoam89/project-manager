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

const renderPlanningGrid = async (props) => {
  const vite = await createServer({
    appType: "custom",
    server: { middlewareMode: true },
  });

  try {
    const { PlanningGridView } = await vite.ssrLoadModule(
      "/src/pages/PlanningGrid.jsx"
    );

    return renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(PlanningGridView, props)
      )
    );
  } finally {
    await vite.close();
  }
};

test("PlanningGridView renders the loading state", async () => {
  const html = await renderPlanningGrid({
    isLoading: true,
    error: "",
    groupedObjectives: [],
  });

  assert.match(
    html,
    /Cargando grilla de planificación\.\.\./
  );
});

test("PlanningGridView renders the error state", async () => {
  const html = await renderPlanningGrid({
    isLoading: false,
    error: "No se pudo cargar la grilla",
    groupedObjectives: [],
  });

  assert.match(html, /No se pudo cargar la grilla/);
});

test("PlanningGridView renders the empty state", async () => {
  const html = await renderPlanningGrid({
    isLoading: false,
    error: "",
    groupedObjectives: [],
  });

  assert.match(
    html,
    /Aún no hay objetivos para mostrar en la grilla de planificación\./
  );
});

test("PlanningGridView renders objectives, goals, activities, and subtasks", async () => {
  const html = await renderPlanningGrid({
    isLoading: false,
    error: "",
    groupedObjectives: [
      {
        _id: "objective-1",
        title: "Lanzar producto",
        status: "ACTIVE",
        progress: 45,
        goals: [
          {
            _id: "goal-1",
            title: "Validar mercado",
            status: "IN_PROGRESS",
            endDate: "2026-07-01T00:00:00.000Z",
            progress: 60,
            activities: [
              {
                _id: "activity-1",
                title: "Entrevistar usuarios",
                status: "IN_PROGRESS",
                dueDate: "2026-06-20T00:00:00.000Z",
                subtasks: [
                  {
                    _id: "subtask-1",
                    title: "Preparar guion",
                    completed: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  assert.match(html, /Objetivo · WBS 1/);
  assert.match(html, /Meta · WBS 1\.1/);
  assert.match(html, /<td[^>]*>\s*1\.1\.1\s*<\/td>/);
  assert.match(html, /1\.1\.1\.1/);
  assert.match(html, /Lanzar producto/);
  assert.match(html, /Validar mercado/);
  assert.match(html, /Entrevistar usuarios/);
  assert.match(html, /Preparar guion/);
  assert.match(html, /100%/);
});
