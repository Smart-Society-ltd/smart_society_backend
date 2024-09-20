import { Request, Response } from "express";
import User from "../../../Models/AuthModels/userModel.js";
import Society from "../../../Models/AuthModels/societyModel.js";
import Project from "../../../Models/AnnualActionPlanModel/plansModel.js";
import { Types } from "mongoose";

interface ProjectRequestBody {
  project_id: Types.ObjectId;
  status: "Planned" | "In Progress" | "Completed";
}

const changeStatus = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response
) => {
  try {
    const { project_id, status } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });
    if (!society || !society.admin_ids.includes(user._id.toString())) {
      return res.status(403).json({
        errorMsg: "Only an admin is allowed to change project status",
      });
    }

    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ errorMsg: "Project not found" });
    }

    project.status = status;
    await project.save();

    return res.status(200).json({
      msg: "Project status updated successfully",
      data: project,
      status: true,
    });
  } catch (error) {
    console.error("Error updating project status:", error);
    return res.status(500).json({
      errorMsg: "Failed to update project status",
      error: error.message,
    });
  }
};

export default changeStatus;
