import { Request, Response } from "express";
import User from "../../../Models/AuthModels/userModel.js";
import Society from "../../../Models/AuthModels/societyModel.js";
import Project from "../../../Models/AnnualActionPlanModel/plansModel.js";
import { Types } from "mongoose";

interface WorkDistributionRequestBody {
  project_id: Types.ObjectId;
  responsible_person: Types.ObjectId;
  work_distribution: Types.ObjectId[];
}

const distributeWork = async (
  req: Request<{}, {}, WorkDistributionRequestBody>,
  res: Response
) => {
  try {
    const { project_id, responsible_person, work_distribution } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });
    if (!society || !society.admin_ids.includes(user._id.toString())) {
      return res.status(403).json({
        errorMsg: "Only an admin is allowed to distribute work",
      });
    }

    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ errorMsg: "Project not found" });
    }

    if (project.work_distribution.length != 0) {
      return res
        .status(404)
        .json({
          errorMsg:
            "Work distribution for this project has already been completed.",
        });
    }

    project.responsible_person = responsible_person;
    project.work_distribution = work_distribution;

    await project.save();

    return res.status(200).json({
      msg: "Work distributed successfully",
      data: project,
      status: true,
    });
  } catch (error) {
    console.error("Error distributing work:", error);
    return res.status(500).json({
      errorMsg: "Failed to distribute work",
      error: error.message,
    });
  }
};

export default distributeWork;
