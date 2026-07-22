import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { connectSocket, disconnectSocket } from "../service/socket.service";
import { socket } from "../api/socket";

export const useSocket = () => {
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!user) return;

        connectSocket();

        socket.on("connect", () => {
            console.log("✅ Socket Connected:", socket.id);
        });

        socket.on("disconnect", (reason) => {
            console.log("❌ Socket Disconnected:", reason);
        });

        socket.on("connect_error", (error) => {
            console.error("Socket Error:", error.message);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");

            disconnectSocket();
        };
    }, [user]);
};