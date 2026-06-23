import { AppError } from "../../utils/AppError";
import { deleteAvatarFromS3, uploadAvatarToS3 } from "../../utils/s3.utils";
import userModel from "../auth/auth.model";
import { UpdateProfileDTO, UserProfileResponse } from "./user.types";

const mapUserProfile = (
    user: any
): UserProfileResponse => {
    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        status: user.status,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen
    };
};

export const getMyProfile = async (
    userId: string
): Promise<UserProfileResponse> => {

    const user = await userModel.findById(userId);

    if (!user) {
        throw new AppError(
            'User Not Found',
            404
        );
    };

    return mapUserProfile(user);
};

export const updateProfile = async (
    userId: string,
    data: UpdateProfileDTO
): Promise<UserProfileResponse> => {

    const user = await userModel.findById(userId);

    if (!user) {
        throw new AppError(
            'User Not Found',
            404
        );
    };

    if (data.username !== undefined) {
        const existingUser = await userModel.findOne({
            username: data.username
        });

        if (existingUser && existingUser._id.toString() !== user.id) {
            throw new AppError(
                'Username Already exists',
                409
            );
        };

        user.username = data.username;
    };

    if (data.bio !== undefined) {
        user.bio = data.bio
    };

    if (data.status !== undefined) {
        user.status = data.status;
    };

    await user.save();

    return mapUserProfile(user);
};

export const uploadAvatar = async (
    userId: string,
    file: Express.Multer.File
) => {

    if (!file) {
        throw new AppError(
            'Avatar is required',
            400
        );
    };

    const user = await userModel.findById(userId);

    if (!user) {
        throw new AppError(
            'User Not Found',
            404
        );
    };

    const oldAvatarKey = user.avatar?.key;

    console.log(oldAvatarKey)

    const uploadedAvatar = await uploadAvatarToS3({
        file,
        userId
    });

    user.avatar = {
        key: uploadedAvatar.key,
        url: uploadedAvatar.url
    };

    await user.save();

    if (oldAvatarKey) {
        try {
            await deleteAvatarFromS3(
                oldAvatarKey
            );
        } catch (error) {
            console.error('Failed to delete Old Avatar'),
                error
        };
    };

    return user.avatar;
};