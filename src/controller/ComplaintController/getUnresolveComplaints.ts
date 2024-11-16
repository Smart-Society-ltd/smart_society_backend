import { Request, Response } from "express";
import User from "../../models/AuthModels/userModel.js";
import Society from "../../models/AuthModels/societyModel.js";
import Complaint from "../../models/ComplaintModel/complaintModel.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

const getUnresolvedComplaints = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const society = await Society.findOne({ society_code: user.society_code });

    const complaints = await Complaint.find({
      society_code: user.society_code,
      isResolved: false,
    }).sort({ createdAt: -1 });



    res.status(200).json(new ApiResponse({ complaints }, "Unresolved complaints fetched successfully"));
  }
)

export default getUnresolvedComplaints;
