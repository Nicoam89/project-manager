import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(
      `Servidor ejecutándose en puerto ${PORT}`
    );
  });

  try {
    await connectDB();
  } catch (error) {
    console.error(error.message);

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }

    console.warn(
      "El servidor continúa levantado para desarrollo, pero las rutas que requieren base de datos responderán 503 hasta que MongoDB conecte."
    );
  }
};

startServer();
