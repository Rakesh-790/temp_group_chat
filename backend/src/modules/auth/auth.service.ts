import { LoginData, LoginResponse, RegisterData } from "../../types/auth.types";
import { generateAccessToken, generateRefreshToken, generateSessionId, hashRefreshToken } from "../../utils/auth.utils";
import { createSession } from '../session/session.service';
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


const createUserSession = async (
    user: any,
    ipAddress?: string,
    userAgent?: string,
    deviceInfo?: string
) => {
    const sessionId = generateSessionId();

    const accessToken = generateAccessToken(user.id, user.role, sessionId);

    const refreshToken = generateRefreshToken(user.id, sessionId, user.tokenVersion);

    const refreshTokenHash = await hashRefreshToken(refreshToken);

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
