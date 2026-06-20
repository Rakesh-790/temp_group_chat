import { Request } from "express";
import { ISession } from "./session.types";

export interface LoginData {

    email: string;

    password: string;

    ipAddress?: string;

    userAgent?: string;

    deviceInfo?: string;

};

export interface LoginResponse {

    user: any;

    accessToken: string;

    refreshToken: string;

};

export interface RegisterData {

    username: string;

    email: string;

    password: string;

    ipAddress?: string;

    userAgent?: string;

    deviceInfo?: string;
};

export interface AuthRequest extends Request {
    user?: {
        id: string,
        role: string,
        sessionId: string
    };
    session?: ISession
};