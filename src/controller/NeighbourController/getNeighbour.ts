import { Request, Response } from "express";
import User from "../../models/AuthModels/userModel.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

const getNeighbour = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const neighbours = await User.find({ society_code: user.society_code })
      .populate('flat');

    res.status(200).json(new ApiResponse({ neighbours }, "Neighbours fetched successfully"));
  }
);

export default getNeighbour;
