import { Request, Response } from "express";
import Folder from "../../models/DocumentModel/folder.js";
import User from '../../models/AuthModels/userModel.js';
import Society from '../../models/AuthModels/societyModel.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';
import asyncHandler from './../../utils/asynchandler.js';

interface DocumentRequestBody {
  society_code: string;
  folder_name: string;
}

const uploadDocument = asyncHandler(
  async (
    req: Request<{}, {}, DocumentRequestBody>,
    res: Response
  ) => {
    const file = req.file;

    const {
      folder_name
    } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society.admin_ids.includes(user._id.toString())) {
      throw new ApiError("User is not authorized to upload document", 403);
    }

    if (!file) {
      throw new ApiError("File not found", 400);
    }

    const society_code = user.society_code;

    const folder = await Folder.findOne({
      society_code,
      folder_name
    });

    if (!folder) {
      throw new ApiError("Folder not found", 404);
    }

    folder.files.push({
      fileName: file.originalname,
      filePath: (file as any).location,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadDate: new Date(),
    });

    await folder.save();

    res.status(200).json(new ApiResponse({ folder }, "File uploaded successfully"));
  }
);

export default uploadDocument;