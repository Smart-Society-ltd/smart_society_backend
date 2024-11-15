import { Request, Response, NextFunction } from 'express';
import Society from '../models/AuthModels/societyModel.js';
import User from '../models/AuthModels/userModel.js';
import ApiError from './api_error.js';

const authorizeUser = async (req: Request) => {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);
    if (!user) {
        throw new ApiError("User not found", 404);
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society.admin_ids.includes(user._id.toString())) {
        throw new ApiError("User is not authorized to raise announcement", 403);
    }
}

export default authorizeUser;