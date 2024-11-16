import { Request, Response } from "express";
import Folder from "../../models/DocumentModel/folder.js";
import User from "../../models/AuthModels/userModel.js";
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';
import asyncHandler from './../../utils/asynchandler.js';

const getFolders = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      throw new ApiError("Unauthorized user", 401);
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      throw new ApiError("Unauthorized user", 401);
    }

    const society_code = user.society_code;

    const folders = await Folder.find({ society_code }).select("folder_name");



    res.status(200).json(new ApiResponse({ folders }, "Folders fetched successfully"));
  }
);

export default getFolders;
