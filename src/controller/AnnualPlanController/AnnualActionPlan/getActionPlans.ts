import { Request, Response } from "express";
import User from "../../../models/AuthModels/userModel.js";
import Society from "../../../models/AuthModels/societyModel.js";
import ActionPlan from "../../../models/AnnualActionPlanModel/annualPlanModel.js";
import asyncHandler from './../../../utils/asynchandler.js';
import ApiError from './../../../utils/api_error.js';
import ApiResponse from './../../../utils/api_success.js';

const getAnnualPlan = asyncHandler(async (req: Request, res: Response) => {
  const loggedInUserId = req.user._id;
  const user = await User.findById(loggedInUserId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const society = await Society.findOne({ society_code: user.society_code });

  if (!society.admin_ids.includes(user._id.toString())) {
    throw new ApiError("User is not authorized to raise announcement", 403);
  }


  const plans = await ActionPlan.find({ society_code: user.society_code });

  res.status(200).json(new ApiResponse({ plans }, "Annual Plan fetched successfully"));
})

export default getAnnualPlan;
