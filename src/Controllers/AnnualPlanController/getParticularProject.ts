import { Request, Response } from "express";
import Project from "../../Schema/AnnualActionPlanModel/plansModel.js";
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

    const project = await Project.findById(project_id);

    if (!project) {
      return res.status(404).json({ errorMsg: "Project not found" });
    }

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
