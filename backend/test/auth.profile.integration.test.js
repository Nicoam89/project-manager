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
   { method = "PUT", token, body } = {}
) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
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
  User.create = originalCreate;
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
        user: {
        _id: authUser._id,
        name: "Usuario Actualizado",
        email: "actualizado@example.com",
        age: null,
        sex: "",
        profession: "",
      },
    });
    assert.equal(persistedUser.age, null);
    assert.equal(persistedUser.sex, "");
    assert.equal(persistedUser.profession, "");
  } finally {
    await server.close();
  }
});

test("auth endpoints use a consistent user response shape", async () => {
  const authUser = {
    _id: "64b7f5f0f5f0f5f0f5f0f5f3",
    name: "Usuario Tres",
    email: "tres@example.com",
    age: 31,
    sex: "masculino",
    profession: "Diseñador",
  };
  const createdUser = {
    _id: "64b7f5f0f5f0f5f0f5f0f5f4",
    name: "Usuario Nuevo",
    email: "nuevo@example.com",
    age: null,
    sex: "",
    profession: "",
  };

  const passwordHash = await bcrypt.hash(
    "password123",
    10
  );
  let findOneCalls = 0;

  User.findById = () => createSelectableQuery(authUser);
  User.findOne = async () => {
    findOneCalls += 1;

    if (findOneCalls === 2) {
      return {
        ...authUser,
        password: passwordHash,
      };
    }

    return null;
  };
  User.create = async () => createdUser;

  const server = await createTestServer();

  try {
    const registerResponse = await request(
      server.baseUrl,
      "/api/auth/register",
      {
        method: "POST",
        body: {
          name: createdUser.name,
          email: createdUser.email,
          password: "password123",
        },
      }
    );
    const loginResponse = await request(
      server.baseUrl,
      "/api/auth/login",
      {
        method: "POST",
        body: {
          email: authUser.email,
          password: "password123",
        },
      }
    );
    const meResponse = await request(
      server.baseUrl,
      "/api/auth/me",
      {
        method: "GET",
        token: generateToken(authUser._id),
      }
    );

    assert.equal(registerResponse.status, 201);
    assert.equal(typeof registerResponse.body.token, "string");
    assert.deepEqual(registerResponse.body.user, createdUser);

    assert.equal(loginResponse.status, 200);
    assert.equal(typeof loginResponse.body.token, "string");
    assert.deepEqual(loginResponse.body.user, authUser);

    assert.equal(meResponse.status, 200);
    assert.deepEqual(meResponse.body, {
      user: authUser,
    });
  } finally {
    await server.close();
  }
});
