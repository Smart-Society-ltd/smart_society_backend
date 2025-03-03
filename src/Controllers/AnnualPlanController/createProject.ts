import { Request, Response } from "express";
import Project from "../../Schema/AnnualActionPlanModel/plansModel.js";
import mongoose from "mongoose";

interface ProjectRequestBody {
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  budget_allocation: number;
  status: "Planned" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  year: string;
}

const createProject = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response
) => {
  try {
    const {
      name,
      description,
      start_date,
      end_date,
      budget_allocation,
      priority,
      status,
      year,
    } = req.body;

    const { user } = req.validatedAdmin;

    const existingProject = await Project.findOne({
      name,
      society_code: user?.society_code,
    });

    if (existingProject) {
      return res.status(400).json({
        errorMsg: "A project with the same name already exists.",
        status: false,
      });
    }

    const newProject = new Project({
      name,
      description,
      start_date,
      end_date,
      budget_allocation,
      status,
      priority,
      year,
      createdBy: new mongoose.Types.ObjectId(user._id),
      society_code: user?.society_code,
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
