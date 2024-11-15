import { Request, Response } from "express";
import User from "../../../models/AuthModels/userModel.js";
import Society from "../../../models/AuthModels/societyModel.js";
import Project from "../../../models/AnnualActionPlanModel/plansModel.js";
import { Types } from "mongoose";
import asyncHandler from './../../../utils/asynchandler.js';
import ApiError from './../../../utils/api_error.js';
import ApiResponse from './../../../utils/api_success.js';

interface ProjectRequestBody {
  project_id: Types.ObjectId;
  status: "Planned" | "In Progress" | "Completed";
}

const changeStatus = asyncHandler(async (req: Request, res: Response) => {
  const { project_id, status } = req.body;

  const loggedInUserId = req.user._id;
  const user = await User.findById(loggedInUserId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const society = await Society.findOne({ society_code: user.society_code });

  if (!society.admin_ids.includes(user._id.toString())) {
    throw new ApiError("User is not authorized to raise announcement", 403);
  }

  const project = await Project.findById(project_id);
  if (!project) {
    throw new ApiError("Project not found", 404);
  }

  project.status = status;
  await project.save();

  res.status(200).json(new ApiResponse({ project }, "Project status updated successfully"));
});

export default changeStatus;
