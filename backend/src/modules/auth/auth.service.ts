import { LoginData, LoginResponse, RegisterData } from "../../types/auth.types";
import { generateAccessToken, generateRefreshToken, generateSessionId, hashRefreshToken, verifyRefreshToken } from "../../utils/auth.utils";
import { createSession, findValidSession, invalidateSession, rotateSessionToken } from '../session/session.service';
import userModel from "./auth.model";
import bcrypt from "bcryptjs";

export const loginUser = async (
    loginData: LoginData
): Promise<LoginResponse> => {

    const { email, password, ipAddress, userAgent, deviceInfo } = loginData;

    const user = await userModel.findOne({ email });

    if (!user) {
        throw new Error("Invalid Credentials");
    };

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new Error("Invalid Credentials");
    };

    if (user.isBlocked) {
        throw new Error('Account is blocked');
    };

    if (user.isDeleted) {
        throw new Error('Account is deleted');
    };

    const { accessToken, refreshToken } = await createUserSession(

        user,

        ipAddress,

        userAgent,

        deviceInfo

    );

    return { user, accessToken, refreshToken };
};

export const registerUser = async (
    registerData: RegisterData
) => {
    const {

        username,

        email,

        password,

        ipAddress,

        userAgent,

        deviceInfo

    } = registerData;



    const existingEmail = await userModel.findOne({ email });

    if (existingEmail) {

        throw new Error(
            'Email already exists'
        );

    }

    const existingUsername = await userModel.findOne({ username });

    if (existingUsername) {

        throw new Error(

            'Username already exists'

        );

    }

    const hashedPassword = await bcrypt.hash(
        password,
        12
    );

    const user = await userModel.create({

        username,

        email,

        password: hashedPassword

    });

    const { accessToken, refreshToken } = await createUserSession(

        user,

        ipAddress,

        userAgent,

        deviceInfo

    );

    return {
        user,
        accessToken,
        refreshToken
    };

};

export const createUserSession = async (
    user: any,
    ipAddress?: string,
    userAgent?: string,
    deviceInfo?: string
) => {
    const sessionId = generateSessionId();

    const accessToken = generateAccessToken(user.id, user.role, sessionId);

    const refreshToken = generateRefreshToken(user.id, sessionId, user.tokenVersion);

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await createSession({

        userId: user.id,

        sessionId,

        refreshTokenHash,

        userAgent,

        ipAddress,

        deviceInfo,

        expiresAt

    });

    return { accessToken, refreshToken };
};

export const refreshAccessToken = async (
    refreshToken: string
) => {

    const payload = verifyRefreshToken(refreshToken) as { id: string, sessionId: string, tokenVersion: number };

    const session = await findValidSession(payload.sessionId);

    const incomingHash = hashRefreshToken(
        refreshToken
    );

    const validToken = incomingHash === session.refreshTokenHash;

    if (!validToken) {
        await invalidateSession(session.sessionId);

        throw new Error("Refresh token reuse detected");
    };

    const user = await userModel.findById(payload.id);

    if (!user) {
        throw new Error("User Not Found");
    };

    const accessToken = generateAccessToken(
        user.id,
        user.role,
        session.sessionId
    );

    const newRefreshToken = generateRefreshToken(
        user.id,
        session.sessionId,
        user.tokenVersion
    );

    const refreshTokenHash = hashRefreshToken(newRefreshToken);

    const expireAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    await rotateSessionToken(
        session.sessionId,
        refreshTokenHash,
        expireAt
    );


    return {
        accessToken,
        refreshToken: newRefreshToken
    };
};
