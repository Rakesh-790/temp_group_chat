import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config/config';
import bcrypt from 'bcryptjs';

export const generateAccessToken = (
    id: string,
    role: string,
    sessionId: string
): string => {

    return jwt.sign(
        {
            id,
            role,
            sessionId
        },
        JWT_ACCESS_SECRET!,
        {
            expiresIn: '15m'
        }
    );

};

export const generateRefreshToken = (
    id: string,
    sessionId: string,
    tokenVersion: number
): string => {

    return jwt.sign(
        {
            id,
            sessionId,
            tokenVersion
        },
        JWT_REFRESH_SECRET!,
        {
            expiresIn: '30d'
        }
    );

};

export const verifyAccessToken = (
    token: string
) => {

    return jwt.verify(
        token,
        JWT_ACCESS_SECRET!
    );

};

export const verifyRefreshToken = (
    token: string
) => {

    return jwt.verify(
        token,
        JWT_REFRESH_SECRET!
    );

};

export const generateSessionId = () : string => {
    return crypto.randomUUID();
};

export const hashRefreshToken = async (
    refreshToken: string
): Promise<string> => {

    return await bcrypt.hash(
        refreshToken,
        12
    );

};

export const compareRefreshToken = async (
    refreshToken: string,
    hashedToken: string
): Promise<boolean> => {

    return await bcrypt.compare(
        refreshToken,
        hashedToken
    );

};