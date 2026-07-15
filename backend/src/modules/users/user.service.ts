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

export const searchUsers = async (
    currentUserId: string,
    query: string,
    page = 1,
    limit = 20
) => {

    const skip = (page - 1) * limit;

    const filter = {
        _id: {
            $ne: currentUserId
        },
        username: {
            $regex: query,
            $options: 'i'
        }
    };

    const users = await userModel.find(filter)
        .select(
            '_id username avatar isOnline lastSeen'
        )
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await userModel.countDocuments(
        filter
    );

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

export const getAllUsers = async (
    page: number = 1,
    limit: number = 5
) => {

    const skip = (page - 1) * limit;

    const users = await userModel
        .find()
        .select('-password -key -__v')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const totalUsers = await userModel.countDocuments();

    return {
        users,
        totalUsers: totalUsers,
        hasNextPage: page * limit < totalUsers,
        hasPreviousPage : page > 1
    };
};

export const getUserPresence = async (
    userId: string
): Promise<{
    isOnline: boolean;
    lastSeen: Date | null;
}> => {

    const user = await userModel
        .findById(userId)
        .select("isOnline lastSeen");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return {
        isOnline: user.isOnline,
        lastSeen: user.lastSeen ?? null
    };
};

export const markUserOnline = async(
    userId: string
) : Promise<void> => {

    const user = await userModel.findByIdAndUpdate(
        userId,
        {
            isOnline: true
        },
        {
            new: true
        }
    );

    if (!user) {
        throw new AppError(
            'User Not Found',
            404
        );
    };

};

export const markUserOffline = async(
    userId: string
) : Promise<void> => {

    const user = await userModel.findByIdAndUpdate(
        userId,
        {
            isOnline: false,
            lastSeen: new Date()
        },
        {
            new: true
        }
    );

    if (!user) {
        throw new AppError(
            'User Not Found',
            404
        );
    };

};