import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            index: true
        },
        sessionId: {
            type: String,
            unique: true,
            required: true
        },
        refreshTokenHash: {
            type: String,
            required: true
        },
        userAgent: {
            type: String
        },
        ipAddress: {
            type: String
        },
        deviceInfo: {
            type: String
        },
        isRevoked: {
            type: Boolean,
            default: false
        },
        revokedAt: {
            type: Date,
            default: null
        },
        lastActivityAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

const sessionModel = mongoose.model('session', sessionSchema);

export default sessionModel;