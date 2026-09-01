import useSession from "./hooks/auth/useSession";
import { useMessageEvents } from "./hooks/chat/useMessageEvents";
import { useRoom } from "./hooks/chat/useRoom";
import { usePresence } from "./hooks/socket/usePresence";
import { useSocket } from "./hooks/socket/useSocket";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./store/auth.store";

function App() {
  useSession();

  useSocket();

  usePresence();

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
