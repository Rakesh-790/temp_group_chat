import { useEffect } from "react";
import { socket } from "../api/socket";
import { useAuthStore } from "../store/auth.store";
import {
    connectSocket,
    disconnectSocket,
} from "../service/socket.service";

export const useSocket = () => {

    const user = useAuthStore((state) => state.user);

    useEffect(() => {

        if (!user) {
            disconnectSocket();
            return;
        }

        connectSocket();

        const onConnect = () => {
            console.log("✅ Socket Connected:", socket.id);
        };

        const onDisconnect = (reason: string) => {
            console.log("❌ Socket Disconnected:", reason);
        };

        const onConnectError = (error: Error) => {
            console.error("Socket Error:", error.message);
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);

        return () => {

            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);

            disconnectSocket();

        };

    }, [user]);

};