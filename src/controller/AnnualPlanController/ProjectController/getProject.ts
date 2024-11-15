import { Request, Response } from "express";
import User from "../../../models/AuthModels/userModel.js";
import Society from "../../../models/AuthModels/societyModel.js";
import ActionPlan from "../../../models/AnnualActionPlanModel/annualPlanModel.js";
import Project from "../../../models/AnnualActionPlanModel/plansModel.js";
import { Types } from "mongoose";
import asyncHandler from './../../../utils/asynchandler.js';
import ApiError from './../../../utils/api_error.js';
import ApiResponse from './../../../utils/api_success.js';

interface ProjectRequestBody {
  annual_plan_id: Types.ObjectId;
}

const getProject = asyncHandler(async (req: Request<{}, {}, ProjectRequestBody>, res: Response) => {
  const { annual_plan_id } = req.body;

  const loggedInUserId = req.user._id;
  const user = await User.findById(loggedInUserId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const society = await Society.findOne({ society_code: user.society_code });
  if (!society) {
    throw new ApiError("Society not found", 404);
  }

  const annualPlan = await ActionPlan.findById(annual_plan_id);
  if (!annualPlan) {
    throw new ApiError("Annual Plan not found", 404);
  }

  const projects = await Project.find({ annual_plan_id: annualPlan._id });

  const statusOrder = ["In Progress", "Planned", "Completed"];
  const priorityOrder = ["High", "Medium", "Low"];

  projects.sort((a, b) => {
    const statusDiff =
      statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    if (statusDiff !== 0) return statusDiff;
    return (
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
    );
  });

  res.status(200).json(new ApiResponse({ projects }, "Projects fetched successfully"));
})

export default getProject;
