import { Request, Response } from "express";
import User from "../../../Models/AuthModels/userModel.js";
import Society from "../../../Models/AuthModels/societyModel.js";
import ActionPlan from "../../../Models/AnnualActionPlanModel/annualPlanModel.js";

const getAnnualPlan = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society) {
      return res.status(404).json({ errorMsg: "Society does not exist" });
    }

    const plans = await ActionPlan.find({ society_code: user.society_code });

    return res.status(200).json({
      msg: "Annual Plan fetched successfully",
      data: plans,
      status: true,
    });
  } catch (error) {
    console.error("Error fetching annual plan:", error);
    return res.status(500).json({
      errorMsg: "Failed to fetch annual plan",
      error: error.message,
    });
  }
};

export default getAnnualPlan;
