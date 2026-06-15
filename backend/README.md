# Backend

## Desarrollo local

1. Copia las variables de entorno de ejemplo:

   ```bash
   cp .env.example .env
   ```

2. Completa `MONGODB_URI` y `JWT_SECRET` en `.env`.

3. Si usas MongoDB Atlas y ves un error como `Could not connect to any servers in your MongoDB Atlas cluster`, entra en **Network Access > IP Access List** y permite tu IP actual. También verifica que el usuario y la contraseña de la URI sean correctos.

4. Inicia el servidor:

   ```bash
   npm run dev
   ```

El servidor puede quedarse escuchando en desarrollo aunque MongoDB no conecte para evitar errores de proxy en Vite. En ese estado, `/api/health` responde con `database.connected: false` y las rutas que necesitan base de datos devuelven `503 DATABASE_UNAVAILABLE` hasta que la conexión a MongoDB sea válida.
