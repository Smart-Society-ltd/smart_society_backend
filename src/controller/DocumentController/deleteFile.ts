import { Request, Response } from "express";
import Folder from "../../models/DocumentModel/folder.js";
import User from "../../models/AuthModels/userModel.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from '../../middleware/s3ForDocument.js'
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

const deleteFile = asyncHandler(
  async (req: Request, res: Response) => {
    const { folder_name, fileName } = req.body;
    const loggedInUserId = req.user?._id;

    const user = await User.findById(loggedInUserId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    // TODO : kya bakchodi chalu he ye bhai
    const society_code = user.society_code;
    // if (user.society_code != society_code) {
    //   res.status(404).json({ errorMsg: "Invalid Society code" });
    // }

    if (user.role != 'admin') {
      throw new ApiError("Only admin can delete files", 403);
    }

    const folder = await Folder.findOne({ society_code, folder_name });

    if (!folder) {
      throw new ApiError("Folder not found", 404);
    }

    const fileIndex = folder.files.findIndex(file => file.fileName === fileName);

    if (fileIndex === -1) {
      throw new ApiError("File not found", 404);
    }

    const fileToDelete = folder.files[fileIndex];

    folder.files.splice(fileIndex, 1);

    await folder.save();

    const fileKey = `${society_code}/${folder_name}/${fileToDelete.fileName}`;

    const params = {
      Bucket: "ssdocument",
      Key: fileKey,
    };

    const command = new DeleteObjectCommand(params);

    await s3.send(command);

    res.status(200).json(new ApiResponse({}, "File deleted successfully"));
  }
);

export default deleteFile;
