import { Request, Response } from "express";
import Project from "../../Schema/AnnualActionPlanModel/plansModel.js";
import { Types } from "mongoose";

interface WorkDistributionRequestBody {
  project_id: Types.ObjectId;
  responsible_person: Types.ObjectId;
  assigned_members: Types.ObjectId[];
}

const distributeWork = async (
  req: Request<{}, {}, WorkDistributionRequestBody>,
  res: Response
) => {
  try {
    const { project_id, responsible_person, assigned_members } = req.body;

    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ errorMsg: "Project not found" });
    }

    project.responsible_person = responsible_person;
    project.assigned_members = assigned_members;

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
