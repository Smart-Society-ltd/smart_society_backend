import { Types } from "mongoose";
import { Request, Response } from "express";
import User from "../../../models/AuthModels/userModel.js";
import Society from "../../../models/AuthModels/societyModel.js";
import Project from "../../../models/AnnualActionPlanModel/plansModel.js";
import ApiError from './../../../utils/api_error.js';
import asyncHandler from './../../../utils/asynchandler.js';
import ApiResponse from './../../../utils/api_success.js';

interface ProjectRequestBody {
  project_id: Types.ObjectId;
}

const getParticularProject = asyncHandler(
  async (req: Request<{}, {}, ProjectRequestBody>, res: Response) => {
    const { project_id } = req.params as { project_id: string };

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const society = await Society.findOne({ society_code: user.society_code });
    if (!society) {
      throw new ApiError("Society not found", 404);
    }

    const project = await Project.findById(project_id);

    if (!project) {
      throw new ApiError("Project not found", 404);
    }

    // if (!society.admin_ids.includes(user._id.toString()) && !project.team.includes(user._id)) {
    //   return res.status(403).json({ errorMsg: "Access denied to this project" });
    // }

    res.status(200).json(new ApiResponse({ project }, "Project fetched successfully"));
  })

export default getParticularProject;
