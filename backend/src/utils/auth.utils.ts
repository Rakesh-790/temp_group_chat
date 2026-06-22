import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config/config';
import bcrypt from 'bcryptjs';
import { RefreshPayload } from '../modules/session/session.types';
import crypto from 'crypto';


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
) : RefreshPayload => {

    return jwt.verify(
        token,
        JWT_REFRESH_SECRET!
    ) as RefreshPayload;

};

export const generateSessionId = () : string => {
    return crypto.randomUUID();
};

export const hashRefreshToken = (
    token: string
): string => {

    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

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