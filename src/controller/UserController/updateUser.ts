import { Request, Response } from "express";
import User from "../../models/AuthModels/userModel.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

interface updateUserRequestBody {
  name: string;
  mb_no: string;
  email: string;
  flat_no: string;
  flat_type: string;
  floor_no: string;
  family_members_count: string;
}

const updateUser = asyncHandler(
  async (
    req: Request<{}, {}, updateUserRequestBody>,
    res: Response
  ) => {
    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      throw new ApiError("Unauthorized user", 401);
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    Object.assign(user, req.body);

    const updatedUser = await user.save();

    res.status(200).json(new ApiResponse({ user: updatedUser }, "User updated successfully"));
  }
);

export default updateUser;
