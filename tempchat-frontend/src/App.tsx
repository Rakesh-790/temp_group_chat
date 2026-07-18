import useSession from "./hooks/useSession";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./store/auth.store";

function App() {
  useSession();

  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  return <AppRouter />

}

export default App;
