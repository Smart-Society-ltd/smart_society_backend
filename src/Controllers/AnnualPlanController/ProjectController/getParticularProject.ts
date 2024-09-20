import { Request, Response } from "express";
import User from "../../../Models/AuthModels/userModel.js";
import Society from "../../../Models/AuthModels/societyModel.js";
import Project from "../../../Models/AnnualActionPlanModel/plansModel.js";
import { Types } from "mongoose";

interface ProjectRequestBody {
  project_id: Types.ObjectId;
}

const getParticularProject = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response
) => {
  try {
    const { project_id } = req.params;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });
    if (!society) {
      return res.status(404).json({ errorMsg: "Society does not exist" });
    }

    const project = await Project.findById(project_id);

    if (!project) {
      return res.status(404).json({ errorMsg: "Project not found" });
    }

    // if (!society.admin_ids.includes(user._id.toString()) && !project.team.includes(user._id)) {
    //   return res.status(403).json({ errorMsg: "Access denied to this project" });
    // }

    return res.status(200).json({
      msg: "Project fetched successfully",
      data: project,
      status: true,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      errorMsg: "Failed to fetch project",
      error: error.message,
    });
  }
};

export default getParticularProject;
