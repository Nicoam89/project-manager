import assert from "node:assert/strict";
import { afterEach, before, test } from "node:test";
import http from "node:http";

import express from "express";

import authRoutes from "../src/routes/auth.routes.js";
import User from "../src/models/User.js";
import generateToken from "../src/utils/generateToken.js";

const originalFindById = User.findById;
const originalFindOne = User.findOne;

const createTestServer = () => {
  const app = express();

  app.use(express.json());
  app.use("/api/auth", authRoutes);

  const server = http.createServer(app);

  return new Promise((resolve) => {
    server.listen(0, () => {
      const { port } = server.address();
      resolve({
        baseUrl: `http://127.0.0.1:${port}`,
        close: () =>
          new Promise((closeResolve, closeReject) => {
            server.close((error) => {
              if (error) {
                closeReject(error);
                return;
              }

              closeResolve();
            });
          }),
      });
    });
  });
};

const request = async (
  baseUrl,
  path,
  { token, body } = {}
) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
};

const createSelectableQuery = (value) => ({
  select: async () => value,
});

before(() => {
  process.env.JWT_SECRET = "test-secret";
});

afterEach(() => {
  User.findById = originalFindById;
  User.findOne = originalFindOne;
});

test("PUT /api/auth/profile rejects duplicate email updates", async () => {
  const authUser = {
    _id: "64b7f5f0f5f0f5f0f5f0f5f0",
    name: "Usuario Uno",
    email: "uno@example.com",
  };
  const duplicateUser = {
    _id: "64b7f5f0f5f0f5f0f5f0f5f1",
    email: "duplicado@example.com",
  };
  const duplicateLookupCalls = [];

  User.findById = () => createSelectableQuery(authUser);
  User.findOne = async (query) => {
    duplicateLookupCalls.push(query);
    return duplicateUser;
  };

  const server = await createTestServer();

  try {
    const response = await request(
      server.baseUrl,
      "/api/auth/profile",
      {
        token: generateToken(authUser._id),
        body: {
          name: "Usuario Uno",
          email: "duplicado@example.com",
        },
      }
    );

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: "Email ya está en uso",
    });
    assert.deepEqual(duplicateLookupCalls, [
      {
        email: "duplicado@example.com",
        _id: { $ne: authUser._id },
      },
    ]);
  } finally {
    await server.close();
  }
});

test("PUT /api/auth/profile clears optional fields when empty values are submitted", async () => {
  const authUser = {
    _id: "64b7f5f0f5f0f5f0f5f0f5f2",
    name: "Usuario Dos",
    email: "dos@example.com",
  };
  const persistedUser = {
    _id: authUser._id,
    name: "Usuario Dos",
    email: "dos@example.com",
    age: 39,
    sex: "femenino",
    profession: "Ingeniera",
    save: async function save() {
      return this;
    },
  };

  User.findById = () => createSelectableQuery(persistedUser);
  User.findOne = async () => null;

  const server = await createTestServer();

  try {
    const response = await request(
      server.baseUrl,
      "/api/auth/profile",
      {
        token: generateToken(authUser._id),
        body: {
          name: "Usuario Actualizado",
          email: "actualizado@example.com",
          age: "",
          sex: "",
          profession: "",
        },
      }
    );

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      _id: authUser._id,
      name: "Usuario Actualizado",
      email: "actualizado@example.com",
      age: null,
      sex: "",
      profession: "",
    });
    assert.equal(persistedUser.age, null);
    assert.equal(persistedUser.sex, "");
    assert.equal(persistedUser.profession, "");
  } finally {
    await server.close();
  }
});
