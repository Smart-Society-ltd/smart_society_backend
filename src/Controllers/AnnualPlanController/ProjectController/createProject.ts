import { Request, Response } from "express";
import User from "../../../Models/AuthModels/userModel.js";
import Society from "../../../Models/AuthModels/societyModel.js";
import Plan from "../../../Models/AnnualActionPlanModel/annualPlanModel.js";
import Project from "../../../Models/AnnualActionPlanModel/plansModel.js";
import { Types } from "mongoose";

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

const createProject = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response
) => {
  try {
    const {
      annual_plan_id,
      name,
      description,
      start_date,
      end_date,
      budget_allocation,
      priority,
    } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society || !society.admin_ids.includes(user._id.toString())) {
      return res
        .status(403)
        .json({
          errorMsg: "Only an admin is allowed to create a project",
        });
    }

    const annualPlan = await Plan.findById(annual_plan_id);
    if (!annualPlan) {
      return res.status(404).json({ errorMsg: "Annual Plan not found" });
    }

    const newProject = new Project({
      annual_plan_id,
      name,
      description,
      start_date,
      end_date,   
      budget_allocation,
      status : "Planned",
      priority,
    });

    const savedProject = await newProject.save();

    return res.status(201).json({
      msg: "Project created successfully",
      data: savedProject,
      status: true,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      errorMsg: "Failed to create project",
      error: error.message,
    });
  }
};

export default createProject;