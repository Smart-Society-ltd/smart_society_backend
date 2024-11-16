import { Request, Response } from "express";
import User from "../../models/AuthModels/userModel.js";
import Society from "../../models/AuthModels/societyModel.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiResponse from './../../utils/api_success.js';
import ApiError from './../../utils/api_error.js';

const updateSociety = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUserId = req.user._id.toString();

    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser || loggedInUser.role != 'admin') {
      throw new ApiError("Unauthorized user", 401);
    }

    const society = await Society.findOne({ society_code: req.body.society_code });

    if (!society) {
      throw new ApiError("Society not found", 404);
    }

    Object.assign(society, req.body.updateFields);
    await society.save();

    res.status(200).json(new ApiResponse({ society }, "Society updated successfully"));
  }
);

export default updateSociety;
