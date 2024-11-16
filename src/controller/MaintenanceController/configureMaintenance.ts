import { Request, Response } from "express";
import societyMaintenance from "../../models/MaintenanceModel/societyMaintenance.js";
import Society from "../../models/AuthModels/societyModel.js";
import User from "../../models/AuthModels/userModel.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';

const configureMaintenance = asyncHandler(
  async (req: Request, res: Response) => {
    const { society_code, maintenance_period, maintenance_basis, custom_maintenance_values } = req.body;

    const societyCheck = await Society.findOne({ society_code });
    if (!societyCheck) {
      throw new ApiError("Society not found", 404);
    }

    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      res.status(404).json({ errorMsg: "User not found" });
    }

    if (!societyCheck.admin_ids.includes(user._id.toString())) {
      res.status(404).json({ errorMsg: "Only admin is allow to configure the society" });
    }

    if (societyCheck.society_code != user.society_code) {
      res.status(404).json({ errorMsg: "User is from another society" });
    }

    if (!["monthly", "annually", "quarterly"].includes(maintenance_period)) {
      res.status(404).json({ errorMsg: "Invalid maintenance period" });
    }

    if (!["flatwise", "bhkwise", "custom"].includes(maintenance_basis)) {
      res.status(404).json({ errorMsg: "Invalid maintenance collection type" });
    }

    let newConfiguration;
    if (maintenance_basis === "custom" && custom_maintenance_values) {
      newConfiguration = new societyMaintenance({
        society_code,
        maintenance_period,
        maintenance_basis,
        custom_maintenance_values,
      });
    } else {
      newConfiguration = new societyMaintenance({
        society_code,
        maintenance_period,
        maintenance_basis,
      });
    }

    await newConfiguration.save();
    res.status(200).json({
      msg: "Society Maintenance configured successfully",
      data: newConfiguration,
    });
  }
);

export default configureMaintenance;
