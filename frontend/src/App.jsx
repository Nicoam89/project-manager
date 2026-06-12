import { useEffect } from "react";

import AppRouter from "./routes/AppRouter";
import useAuthStore from "./store/authStore";

function App() {
  const loadMe = useAuthStore(
    (state) => state.loadMe
  );

  useEffect(() => {
    loadMe().catch(() => {});
  }, [loadMe]);

  return <AppRouter />;
}

export default App;
