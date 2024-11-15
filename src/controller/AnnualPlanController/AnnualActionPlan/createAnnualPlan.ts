import { Request, Response } from "express";
import User from '../../../models/AuthModels/userModel.js';
import Society from "../../../models/AuthModels/societyModel.js";
import Plan from '../../../models/AnnualActionPlanModel/annualPlanModel.js'
import asyncHandler from './../../../utils/asynchandler.js';
import ApiError from './../../../utils/api_error.js';
import ApiResponse from './../../../utils/api_success.js';

interface AnnualPlanRequestBody {
  goals: string;
}

const createAnnualPlan = asyncHandler(async (req: Request, res: Response) => {
  const { goals } = req.body;

  const loggedInUserId = req.user._id;
  const user = await User.findById(loggedInUserId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const society = await Society.findOne({ society_code: user.society_code });

  if (!society.admin_ids.includes(user._id.toString())) {
    throw new ApiError("User is not authorized to raise announcement", 403);
  }

  const year = new Date().getFullYear();

  const newPlan = new Plan({
    year,
    society_code: user.society_code,
    created_by: user._id,
    goals,
  });

  const savedPlan = await newPlan.save();

  res.status(201).json(new ApiResponse({ plan: savedPlan, }, "Annual Plan created successfully"));
});

export default createAnnualPlan;