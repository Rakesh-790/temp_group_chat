import { AuthenticatedUser, LoginData, LoginResponse, RegisterData } from "../auth/auth.types";
import { AppError } from "../../utils/AppError";
import { generateAccessToken, generateRefreshToken, generateSessionId, hashRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../utils/auth.utils";
import sessionModel from "../session/session.model";
import { createSession, findValidSession, invalidateSession, rotateSessionToken } from '../session/session.service';
import userModel from "./auth.model";
import bcrypt from "bcryptjs";
import { setUserOffline, setUserOnline } from "../presence/presence.service";

export const loginUser = async (
    loginData: LoginData
): Promise<LoginResponse> => {

    const { email, password, ipAddress, userAgent, deviceInfo } = loginData;

    const user = await userModel.findOne({ email });

    if (!user) {
        throw new AppError(
            "Invalid Credentials",
            401
        );
    };

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new AppError(
            "Invalid Credentials",
            401
        );
    };

    if (user.isBlocked) {
        throw new AppError(
            "Account is Blocked",
            403
        );
    };

    if (user.isDeleted) {
        throw new AppError(
            "Account is Deleted",
            403
        );
    };

    const { accessToken, refreshToken } = await createUserSession(

        user,

        ipAddress,

        userAgent,

        deviceInfo

    );

    await setUserOnline(user._id.toString());

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

        throw new AppError(
            'Email already exists',
            409
        );

    }

    const existingUsername = await userModel.findOne({ username });

    if (existingUsername) {

        throw new AppError(
            'Username already exists',
            409
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

    await setUserOnline(user._id.toString());

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

        throw new AppError(
            "Refresh token reuse detected",
            400
        );
    };

    const user = await userModel.findById(payload.id);

    if (!user) {
        throw new AppError(
            "User Not Found",
            404
        );
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

export const authenticateAccessToken = async (
    accessToken: string
): Promise<AuthenticatedUser> => {

    let decoded: {
        sessionId: string;
        id: string;
    };

    try {
        decoded = verifyAccessToken(accessToken) as {
            sessionId: string;
            id: string;
        };
    } catch {
        throw new AppError(
            "Invalid or Expired Token",
            401
        )
    }

    const session = await findValidSession(decoded.sessionId);

    if (!session) {
        throw new AppError(
            "Session not Found",
            401
        )

    };

    if (session.isRevoked) {

        throw new AppError(
            "Session Revoked",
            401
        )
    };

    const user = await userModel.findById(decoded.id);

    if (!user) {
        throw new AppError(
            "User not Found",
            404
        )
    };

    return {
        id: user._id.toString(),
        role: user.role,
        sessionId: session.toString()
    };
}

export const logout = async (sessionId: string) => {

    const session = await sessionModel.findOne({
        _id: sessionId,
        isRevoked: false
    });

    if (!session) {
        throw new AppError('Session not found', 404);
    }

    session.isRevoked = true;
    session.revokedAt = new Date();

    await session.save();

    const activeSessions = await sessionModel.countDocuments({
        user: session.user,
        isRevoked: false
    });

    if (activeSessions === 0) {
        await setUserOffline(session.user.toString());

        await userModel.findByIdAndUpdate(
            session.user,
            {
                lastSeen: new Date()
            }
        );
    };
};

export const logoutAll = async (userId: string) => {

    await sessionModel.updateMany(
        {
            user: userId,
            isRevoked: false
        },
        {
            $set: {
                isRevoked: true,
                revokedAt: new Date()
            }
        }
    );

    await setUserOffline(userId);

    await userModel.findByIdAndUpdate(
        userId,
        {
            lastSeen: new Date()
        }
    );
};
