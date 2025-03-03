import { Request, Response } from "express";
import Project from "../../Schema/AnnualActionPlanModel/plansModel.js";
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
    const { user } = req.validatedUser;

    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ errorMsg: "Project not found" });
    }
    
    if (!user._id.equals(project.responsible_person) && user.role !== "admin") {
      return res.status(403).json({ errorMsg: "Only the responsible person or an admin can change the status." });
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
