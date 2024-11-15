import { NextFunction, Request, Response } from "express";
import User from "../../models/AuthModels/userModel.js";
import Society from "../../models/AuthModels/societyModel.js";
import Announcement from "../../models/AnnonucementModel/announcemenetModel.js";
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';
import asyncHandler from './../../utils/asynchandler.js';

const getAnnouncement = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const loggedInUserId = req.user._id;
  const user = await User.findById(loggedInUserId);

  if (!user) {
    throw new ApiError("Unauthorized user", 401);
  }

  const society = await Society.findOne({ society_code: user.society_code });

  const announcements = await Announcement.find({
    society_code: user.society_code,
  }).sort({ createdAt: -1 });

  if (announcements.length === 0) {
    res.status(200).json(new ApiResponse({
      announcements: []
    },
      "No announcements found"
    ));
  }

  res.status(200).json(new ApiResponse({ announcements }, "Announcements fetched successfully"));
});

export default getAnnouncement;
