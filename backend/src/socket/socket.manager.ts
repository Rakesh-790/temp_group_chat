import { Socket } from "socket.io";

class SocketManager {

    private userSockets: Map<string, Set<Socket>> = new Map();

    registerSocket(userId: string, socket: Socket): void {

        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        };

        this.userSockets.get(userId)!.add(socket);

        console.log(`User ${userId} connected (${this.userSockets.get(userId)!.size} socket(s))`);
    };

    removeSocket(userId: string, socket: Socket): void {

        const sockets = this.userSockets.get(userId);

        if (!sockets) return;

        sockets.delete(socket);

        if (sockets.size === 0) {
            this.userSockets.delete(userId);
        };

        console.log(
            `User ${userId} disconnected (${sockets.size} socket(s) remaining)`
        );
    };

    getSocketCount(userId: string): number {

        return this.userSockets.get(userId)?.size ?? 0;
    }

    getUserSockets(userId: string): Socket[] {

        return Array.from(this.userSockets.get(userId) ?? []);
    };

    isUserOnline(userId: string): boolean {

        return this.userSockets.has(userId);
    };

    emitToUser(userId: string, event: string, payload: unknown): void {

        const sockets = this.getUserSockets(userId);

        for (const socket of sockets) {
            socket.emit(event, payload);
        };
    };

    removeUserFromRoom(
        userId: string,
        roomId: string
    ): void {

        const sockets = this.getUserSockets(userId);

        for (const socket of sockets) {
            socket.leave(roomId);
        }
    }
};

export const socketManager = new SocketManager();