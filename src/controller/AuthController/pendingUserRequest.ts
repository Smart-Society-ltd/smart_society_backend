import { Request, Response } from "express";
import mongoose from "mongoose";
import generateToken from "../../utils/jwt/generateToken.js";
import User from "../../models/AuthModels/userModel.js";
import TempUser from "../../models/AuthModels/tempUserModel.js";
import Society from "../../models/AuthModels/societyModel.js";
import assignFlat from "../../utils/society/assignFlats.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

const pendingUsers = asyncHandler(async (req: Request, res: Response) => {
  const { society_code } = req.params;

  const loggedInUserId = req.user._id;
  const user = await User.findById(loggedInUserId);

  if (!user || society_code != user.society_code) {
    throw new ApiError("User not found", 404);
  }

  const pendingUsers = await User.find({ society_code, isVerified: false })
    .populate('tempUserId', 'flat_type floor_no');


  res.status(200).json(new ApiResponse({ pendingUsers }, "Pending users fetched successfully"));
});

const processUsers = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.body;
    const tempUser = await TempUser.findOne({ user_id: id });
    const user = await User.findOne({ _id: id });

    if (!tempUser || !user) {
      throw new ApiError("Registration Req not found", 404);
    }

    const loggedInUserId = req.user._id;
    const loggedInuser = await User.findById(loggedInUserId);
    const society = await Society.findOne({ society_code: loggedInuser.society_code });

    if (!society) {
      throw new ApiError("Society not found", 404);
    }

    user.isVerified = true;
    user.role = "user";

    await assignFlat(user);

    const savedUser = await user.save();
    const token = generateToken(user);

    await TempUser.findOneAndDelete({ user_id: id });

    res.status(200).json(new ApiResponse({
      user: savedUser,
      token
    },
      "User verified successfully"
    ));
  });

export { pendingUsers, processUsers };