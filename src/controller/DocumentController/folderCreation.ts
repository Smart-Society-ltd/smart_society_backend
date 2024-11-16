import { Request, Response } from "express";
import Folder from "../../models/DocumentModel/folder.js";
import Society from "../../models/AuthModels/societyModel.js";
import User from "../../models/AuthModels/userModel.js";
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

const FolderCreation = async (req: Request, res: Response) => {
  const { folder_name } = req.body;

  const loggedInUserId = req.user._id;
  const user = await User.findById(loggedInUserId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const society = await Society.findOne({ society_code: user.society_code });

  if (!society.admin_ids.includes(user._id.toString())) {
    throw new ApiError("User is not authorized to create folder", 403);
  }

  const folderNameCheck = await Folder.findOne({
    society_code: user.society_code,
    folder_name,
  });

  if (folderNameCheck) {
    throw new ApiError("Folder with same name already exists", 400);
  }

  const newFolder = new Folder({
    folder_name,
    society_code: user.society_code,
    created_by: user._id,
  });

  await newFolder.save();

  res
    .status(200)
    .json(new ApiResponse({}, "Folder created successfully"));
};

export default FolderCreation;
