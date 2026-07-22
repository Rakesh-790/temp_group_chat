import { useMessageEvents } from "./hooks/useMessageEvents";
import { useRoom } from "./hooks/useRoom";
import useSession from "./hooks/useSession";
import { useSocket } from "./hooks/useSocket";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./store/auth.store";

function App() {
  useSession();

  useSocket();

  useRoom();

  useMessageEvents();

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
