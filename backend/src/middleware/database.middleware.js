import { getDatabaseState } from "../config/db.js";

const DATABASE_UNAVAILABLE_MESSAGE =
  "No se puede procesar la solicitud porque MongoDB no está conectado. " +
  "Revisa MONGODB_URI, credenciales y la IP permitida en MongoDB Atlas Network Access.";

export const requireDatabaseConnection = (
  req,
  res,
  next
) => {
  const database = getDatabaseState();

  if (database.connected) {
    return next();
  }

  return res.status(503).json({
    success: false,
    code: "DATABASE_UNAVAILABLE",
    message: DATABASE_UNAVAILABLE_MESSAGE,
    database,
  });
};
