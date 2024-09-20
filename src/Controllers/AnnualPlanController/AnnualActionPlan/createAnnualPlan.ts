import { Request, Response } from "express";
import User from '../../../Models/AuthModels/userModel.js';
import Society from "../../../Models/AuthModels/societyModel.js";
import Plan from '../../../Models/AnnualActionPlanModel/annualPlanModel.js'

interface AnnualPlanRequestBody {
  goals: string;
}

const createAnnualPlan = async (
  req: Request<{}, {}, AnnualPlanRequestBody>,
  res: Response
) => {
  try {
    const { goals } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society.admin_ids.includes(user._id.toString())) {
      return res
        .status(403)
        .json({ errorMsg: "Only admin is allowed to create Annual Action Plan" });
    }

    const year = new Date().getFullYear();

    const newPlan = new Plan({
      year ,
      society_code : user.society_code,
      created_by : user._id,
      goals,
    });

    const savedPlan = await newPlan.save();

    return res.status(201).json({
      msg: "Annual Plan created successfully",
      data: savedPlan,
      status: true,
    });
  } catch (error) {
    console.error("Error creating annual plan:", error);
    return res.status(500).json({
      errorMsg: "Failed to create annual plan",
      error: error.message,
    });
  }
};

export default createAnnualPlan;