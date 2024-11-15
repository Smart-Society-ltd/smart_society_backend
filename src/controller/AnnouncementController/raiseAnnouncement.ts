import { Request, Response } from "express";
import User from "../../models/AuthModels/userModel.js";
import Society from '../../models/AuthModels/societyModel.js';
import Announcement from "../../models/AnnonucementModel/announcemenetModel.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

const raiseAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const loggedInUserId = req.user._id;
  const user = await User.findById(loggedInUserId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const society = await Society.findOne({ society_code: user.society_code });

  if (!society.admin_ids.includes(user._id.toString())) {
    throw new ApiError("User is not authorized to raise announcement", 403);
  }

  let photoUrl = null;
  if (req.file) {
    const fileKey = (req.file as any).key;
    const bucketName = (req.file as any).bucket;

    photoUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
  }

  const newAnnouncement = new Announcement({
    title,
    content,
    raised_by: user.name,
    society_code: user.society_code,
    photo: photoUrl,
  });

  await newAnnouncement.save();

  res.status(201).json(new ApiResponse({ announcement: newAnnouncement, }, "Announcement raised successfully"));

});

export default raiseAnnouncement;
