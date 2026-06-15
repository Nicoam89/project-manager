import mongoose from "mongoose";

const DEFAULT_SERVER_SELECTION_TIMEOUT_MS = 5000;

const isAtlasUri = (uri = "") =>
  uri.includes("mongodb+srv://") ||
  uri.includes("mongodb.net");

export const getDatabaseState = () => ({
  connected: mongoose.connection.readyState === 1,
  host: mongoose.connection.host || null,
  name: mongoose.connection.name || null,
  readyState: mongoose.connection.readyState,
});

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI no está configurada. Define la variable en backend/.env para conectar la base de datos."
    );
  }

  try {
    const conn = await mongoose.connect(
      mongoUri,
      {
        serverSelectionTimeoutMS:
          Number(
            process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS
          ) ||
          DEFAULT_SERVER_SELECTION_TIMEOUT_MS,
      }
    );

    console.log(
      `MongoDB conectado: ${conn.connection.host}`
    );

    return conn;
  } catch (error) {
    const atlasHint = isAtlasUri(mongoUri)
      ? " Si usas MongoDB Atlas, revisa que tu IP actual esté permitida en Network Access/IP Access List y que el usuario/password sean correctos."
      : "";

    throw new Error(
      `Error conectando MongoDB: ${error.message}.${atlasHint}`
    );
  }
};
