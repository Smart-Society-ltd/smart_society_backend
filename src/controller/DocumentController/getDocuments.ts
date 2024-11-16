import { Request, Response } from "express";
import Folder from "../../models/DocumentModel/folder.js";
import User from "../../models/AuthModels/userModel.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

const getDocuments = asyncHandler(
  async (req: Request, res: Response) => {
    const { folder_name } = req.body;

    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      throw new ApiError("Unauthorized user", 401);
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const society_code = user.society_code;
    const documents = await Folder.findOne({ society_code, folder_name });

    if (!documents) {
      throw new ApiError("Documents not found", 404);
    }

    res.status(200).json(new ApiResponse({ documents }, "Documents fetched successfully"));
  }
);

export default getDocuments;
