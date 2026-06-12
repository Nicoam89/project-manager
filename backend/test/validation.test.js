import assert from "node:assert/strict";
import test from "node:test";

import { validationResult } from "express-validator";

import { validateAllowedFields } from "../src/middleware/allowedFields.middleware.js";
import { pickAllowedFields } from "../src/utils/payload.js";
import {
  objectiveUpdateFields,
  updateObjectiveValidation,
} from "../src/validators/objective.validator.js";
import {
  goalUpdateFields,
  updateGoalValidation,
} from "../src/validators/goal.validator.js";
import {
  activityUpdateFields,
  updateActivityValidation,
} from "../src/validators/activity.validator.js";

const runValidations = async (
  validations,
  body
) => {
  const req = { body };

  for (const validation of validations) {
    await validation.run(req);
  }

  return validationResult(req).array();
};

const runAllowedFields = (
  allowedFields,
  body
) => {
  const req = { body };
  const response = {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
  let nextWasCalled = false;

  validateAllowedFields(allowedFields)(
    req,
    response,
    () => {
      nextWasCalled = true;
    }
  );

  return {
    response,
    nextWasCalled,
  };
};

test("pickAllowedFields keeps only whitelisted keys", () => {
  const payload = pickAllowedFields(
    {
      title: "Nuevo título",
      owner: "attacker-user-id",
      progress: 50,
    },
    objectiveUpdateFields
  );

  assert.deepEqual(payload, {
    title: "Nuevo título",
    progress: 50,
  });
});

test("validateAllowedFields rejects mass-assignment fields", () => {
  const { response, nextWasCalled } =
    runAllowedFields(objectiveUpdateFields, {
      title: "Objetivo válido",
      owner: "attacker-user-id",
    });

  assert.equal(nextWasCalled, false);
  assert.equal(response.statusCode, 400);
  assert.equal(response.payload.success, false);
  assert.equal(
    response.payload.errors[0].path,
    "owner"
  );
});



test("validateAllowedFields rejects empty update payloads", () => {
  const { response, nextWasCalled } =
    runAllowedFields(objectiveUpdateFields, {});

  assert.equal(nextWasCalled, false);
  assert.equal(response.statusCode, 400);
  assert.equal(
    response.payload.message,
    "Debe enviar al menos un campo para actualizar"
  );
});

test("validateAllowedFields passes whitelisted goal updates", () => {
  const { response, nextWasCalled } =
    runAllowedFields(goalUpdateFields, {
      title: "Meta actualizada",
      progress: 75,
    });

  assert.equal(nextWasCalled, true);
  assert.equal(response.statusCode, null);
});

test("updateObjectiveValidation rejects invalid progress", async () => {
  const errors = await runValidations(
    updateObjectiveValidation,
    {
      progress: 101,
    }
  );

  assert.equal(errors.length, 1);
  assert.equal(errors[0].path, "progress");
});

test("updateGoalValidation rejects invalid objective ids and types", async () => {
  const errors = await runValidations(
    updateGoalValidation,
    {
      objective: "not-an-object-id",
      type: "INVALID",
    }
  );

  assert.deepEqual(
    errors.map((error) => error.path).sort(),
    ["objective", "type"]
  );
});

test("updateActivityValidation rejects invalid workflow and estimated hours", async () => {
  const errors = await runValidations(
    updateActivityValidation,
    {
      workflowType: "UNKNOWN",
      estimatedHours: -1,
    }
  );

  assert.deepEqual(
    errors.map((error) => error.path).sort(),
    ["estimatedHours", "workflowType"]
  );
});

test("activity update whitelist rejects owner changes", () => {
  const { response, nextWasCalled } =
    runAllowedFields(activityUpdateFields, {
      title: "Actividad válida",
      owner: "attacker-user-id",
    });

  assert.equal(nextWasCalled, false);
  assert.equal(response.statusCode, 400);
  assert.equal(
    response.payload.errors[0].path,
    "owner"
  );
});
