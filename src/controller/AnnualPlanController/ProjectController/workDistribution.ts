import { Request, Response } from "express";
import Project from "../../../models/AnnualActionPlanModel/plansModel.js";
import { Types } from "mongoose";
import asyncHandler from './../../../utils/asynchandler.js';
import ApiError from './../../../utils/api_error.js';
import authorizeUser from './../../../utils/authorize_user.js';
import ApiResponse from './../../../utils/api_success.js';

interface WorkDistributionRequestBody {
  project_id: Types.ObjectId;
  responsible_person: Types.ObjectId;
  work_distribution: Types.ObjectId[];
}

const distributeWork = asyncHandler(
  async (req: Request<{}, {}, WorkDistributionRequestBody>, res: Response) => {
    const { project_id, responsible_person, work_distribution } = req.body;
    await authorizeUser(req);

    const project = await Project.findById(project_id);
    if (!project) {
      throw new ApiError("Project not found", 404);
    }

    if (project.work_distribution.length != 0) {
      throw new ApiError("Work already distributed", 400);
    }

    project.responsible_person = responsible_person;
    project.work_distribution = work_distribution;

    await project.save();

    res.status(200).json(new ApiResponse({ project }, "Work distributed successfully"));
  }
)

export default distributeWork;
