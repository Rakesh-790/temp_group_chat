import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: [
                'user', 'admin'
            ],
            default: 'user'
        },
        tokenVersion: {
            type: Number,
            default: 0
        },
        passwordChangedAt: {
            type: Date
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const userModel = mongoose.model('user', userSchema);

export default userModel;