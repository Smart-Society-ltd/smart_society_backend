import { Request, Response } from "express";
import Plan from "../../../models/AnnualActionPlanModel/annualPlanModel.js";
import Project from "../../../models/AnnualActionPlanModel/plansModel.js";
import { Types } from "mongoose";
import asyncHandler from './../../../utils/asynchandler.js';
import ApiError from './../../../utils/api_error.js';
import ApiResponse from './../../../utils/api_success.js';
import authorizeUser from './../../../utils/authorize_user.js';

interface ProjectRequestBody {
  annual_plan_id: Types.ObjectId;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  budget_allocation: number;
  // status: "Planned" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
}

const createProject = asyncHandler(async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response
) => {

  await authorizeUser(req);


  const {
    annual_plan_id,
    name,
    description,
    start_date,
    end_date,
    budget_allocation,
    priority,
  } = req.body;


  const annualPlan = await Plan.findById(annual_plan_id);
  if (!annualPlan) {
    throw new ApiError("Annual Plan not found", 404);
  }

  const newProject = new Project({
    annual_plan_id,
    name,
    description,
    start_date,
    end_date,
    budget_allocation,
    status: "Planned",
    priority,
  });

  const savedProject = await newProject.save();

  res.status(201).json(new ApiResponse({ project: savedProject }, "Project created successfully"));
});

export default createProject;