import { Request, Response } from "express";
import User from "../../../Models/AuthModels/userModel.js";
import Society from "../../../Models/AuthModels/societyModel.js";
import ActionPlan from "../../../Models/AnnualActionPlanModel/annualPlanModel.js";
import Project from "../../../Models/AnnualActionPlanModel/plansModel.js";
import { Types } from "mongoose";

interface ProjectRequestBody {
  annual_plan_id: Types.ObjectId;
}

const getProject = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response
) => {
  try {
    const { annual_plan_id } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });
    if (!society) {
      return res.status(404).json({ errorMsg: "Society does not exist" });
    }

    const annualPlan = await ActionPlan.findById(annual_plan_id);
    if (!annualPlan) {
      return res.status(404).json({ errorMsg: "Annual Plan not found" });
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

    return res.status(200).json({
      msg: "Projects fetched successfully",
      data: projects,
      status: true,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      errorMsg: "Failed to fetch projects",
      error: error.message,
    });
  }
};

export default getProject;
