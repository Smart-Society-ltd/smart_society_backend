import { Request, Response } from "express";
import Project from "../../Schema/AnnualActionPlanModel/plansModel.js";

const getProject = async (req: Request, res: Response) => {
  try {
    const { user } = req.validatedUser;

    const projects = await Project.find({ society_code: user.society_code });

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
