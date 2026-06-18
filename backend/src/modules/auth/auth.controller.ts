import { Request, Response } from "express";
import { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from "./auth.constants";
import { loginUser, registerUser } from "./auth.service";

export const register = async (
    req: Request,
    res: Response
) => {

    const {
        username,
        email,
        password
    } = req.body;

    const {
        user,
        accessToken,
        refreshToken
    } = await registerUser({
        username,
        email,
        password,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        deviceInfo: 'Unknown'
    });


    res.cookie(
        'accessToken',
        accessToken,
        ACCESS_COOKIE_OPTIONS
    );

    res.cookie(
        'refreshToken',
        refreshToken,
        REFRESH_COOKIE_OPTIONS
    );

    return res.status(201).json({
        success: true,
        message: 'User Registered',
        user
    });


};

export const login = async (
    req: Request,
    res: Response
) => {

    const {
        email,
        password
    } = req.body;

    const {
        user,
        accessToken,
        refreshToken
    } = await loginUser({
        email,
        password,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        deviceInfo: 'Unknown'
    });

    res.cookie(
        'accessToken',
        accessToken,
        ACCESS_COOKIE_OPTIONS
    );

    res.cookie(
        'refreshToken',
        refreshToken,
        REFRESH_COOKIE_OPTIONS
    );

    return res.status(200).json({
        success: true,
        message: 'Login Successful',
        user
    });

};