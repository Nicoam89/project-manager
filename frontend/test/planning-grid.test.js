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
 assert.match(
    html,
    /WBS 1 identifica el objetivo estratégico/
  );
  assert.match(
    html,
    /WBS 1\.1 identifica una meta vinculada al objetivo/
  );
  assert.match(
    html,
    /WBS 1\.1\.1 identifica una actividad operativa/
  );
  assert.match(
    html,
    /WBS 1\.1\.1\.1 identifica una subactividad/
  );
  assert.match(html, /100%/);

});
test("PlanningGridView generates hierarchical WBS numbering for multiple levels", async () => {
  const html = await renderPlanningGrid({
    isLoading: false,
    error: "",
    groupedObjectives: [
      {
        _id: "objective-1",
        title: "Objetivo uno",
        status: "ACTIVE",
        progress: 20,
        goals: [
          {
            _id: "goal-1",
            title: "Meta uno",
            status: "IN_PROGRESS",
            endDate: "",
            progress: 10,
            activities: [
              {
                _id: "activity-1",
                title: "Actividad uno",
                status: "PENDING",
                dueDate: "",
                subtasks: [
                  {
                    _id: "subtask-1",
                    title: "Subactividad uno",
                    completed: false,
                  },
                  {
                    _id: "subtask-2",
                    title: "Subactividad dos",
                    completed: true,
                  },
                ],
              },
              {
                _id: "activity-2",
                title: "Actividad dos",
                status: "COMPLETED",
                dueDate: "",
                subtasks: [],
              },
            ],
          },
          {
            _id: "goal-2",
            title: "Meta dos",
            status: "PENDING",
            endDate: "",
            progress: 0,
            activities: [
              {
                _id: "activity-3",
                title: "Actividad tres",
                status: "PENDING",
                dueDate: "",
                subtasks: [],
              },
            ],
          },
        ],
      },
      {
        _id: "objective-2",
        title: "Objetivo dos",
        status: "ACTIVE",
        progress: 70,
        goals: [
          {
            _id: "goal-3",
            title: "Meta tres",
            status: "IN_PROGRESS",
            endDate: "",
            progress: 40,
            activities: [
              {
                _id: "activity-4",
                title: "Actividad cuatro",
                status: "PENDING",
                dueDate: "",
                subtasks: [],
              },
            ],
          },
        ],
      },
    ],
  });

  assert.match(html, /Objetivo · WBS 1/);
  assert.match(html, /Objetivo · WBS 2/);
  assert.match(html, /Meta · WBS 1\.1/);
  assert.match(html, /Meta · WBS 1\.2/);
  assert.match(html, /Meta · WBS 2\.1/);
  assert.match(html, /<td[^>]*>\s*1\.1\.1\s*<\/td>/);
  assert.match(html, /<td[^>]*>\s*1\.1\.2\s*<\/td>/);
  assert.match(html, /<td[^>]*>\s*1\.2\.1\s*<\/td>/);
  assert.match(html, /<td[^>]*>\s*2\.1\.1\s*<\/td>/);
  assert.match(html, /1\.1\.1\.1/);
  assert.match(html, /1\.1\.1\.2/);
});

test("PlanningGridView exposes visual progress validation attributes", async () => {
  const html = await renderPlanningGrid({
    isLoading: false,
    error: "",
    groupedObjectives: [
      {
        _id: "objective-1",
        title: "Objetivo con avance fuera de rango",
        status: "ACTIVE",
        progress: 125,
        goals: [
          {
            _id: "goal-1",
            title: "Meta con avance negativo",
            status: "IN_PROGRESS",
            endDate: "",
            progress: -15,
            activities: [
              {
                _id: "activity-1",
                title: "Actividad parcialmente completada",
                status: "PENDING",
                dueDate: "",
                subtasks: [
                  {
                    _id: "subtask-1",
                    title: "Subactividad lista",
                    completed: true,
                  },
                  {
                    _id: "subtask-2",
                    title: "Subactividad pendiente",
                    completed: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  assert.match(
    html,
    /aria-label="Avance 100%"[\s\S]*?aria-valuenow="100"[\s\S]*?width:100%/
  );
  assert.match(
    html,
    /aria-label="Avance 0%"[\s\S]*?aria-valuenow="0"[\s\S]*?width:0%/
  );
  assert.match(
    html,
    /aria-label="Avance 50%"[\s\S]*?aria-valuenow="50"[\s\S]*?width:50%/
  );
});
