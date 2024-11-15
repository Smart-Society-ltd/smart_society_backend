import { Request, Response, NextFunction } from 'express';
import User from "../../models/AuthModels/userModel.js";
import Society from "../../models/AuthModels/societyModel.js";
import Announcement from "../../models/AnnonucementModel/announcemenetModel.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import asyncHandler from "../../utils/asynchandler.js";
import { s3 } from "../../middleware/s3ForDocument.js"
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

const deleteAnnouncement = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError("Announcement ID is required", 401)
  }

  const loggedInUserId = req.user._id;
  const user = await User.findById(loggedInUserId);

  if (!user) {
    throw new ApiError("User not found", 404)
  }

  const society = await Society.findOne({ society_code: user.society_code });

  if (!society || !society.admin_ids.includes(user._id.toString())) {
    throw new ApiError("User is not authorized to delete announcement", 403)
  }

  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new ApiError("Announcement not found", 404);
  }

  if (announcement.photo) {
    // Extract the key from the photo URL
    const photoUrl = announcement.photo;
    const photoKey = photoUrl.split("/").slice(-2).join("/");

    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: "announcementphoto",
          Key: photoKey,
        })
      );
      console.log(`Successfully deleted ${photoKey} from S3.`);
    } catch (err) {
      console.error("Error deleting file from S3:", err);
      throw new ApiError("Error deleting file from S3", 500)
    }
  }

  await Announcement.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse({}, "Announcement deleted successfully",));
});

export default deleteAnnouncement;
