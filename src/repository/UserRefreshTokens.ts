import mongoose from "mongoose";

const UserRefreshTokenSchema = new mongoose.Schema({
    userId: {type: String, required: true, index: true},
    refreshToken: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, expires: '7d'}
})

export const UserRefreshTokenModel = mongoose.model('UserRefreshToken', UserRefreshTokenSchema);