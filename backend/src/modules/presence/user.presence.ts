import { Server } from "socket.io";
import { socketManager } from "../../socket/socket.manager";
import { setUserOffline, setUserOnline } from "./presence.service";
import { markUserOffline, markUserOnline } from "../users/user.service";

export const handleUserConnected = async(
    userId: string,
    io: Server
) : Promise<void> => {

    if (socketManager.getSocketCount(userId) !== 1) {
        return;
    };

    await setUserOnline(userId);

    await markUserOnline(userId);

    io.emit("user:online", 
        {
            userId
        }
    );
};

export const handleUserDisconnected = async(
    userId: string,
    io: Server
) : Promise<void> => {

    if (socketManager.getSocketCount(userId) > 0) {
        return;
    };

    await setUserOffline(userId);

    await markUserOffline(userId);

    io.emit("user:offline", 
        {
            userId,
            lastSeen: new Date()
        }
    );
};

