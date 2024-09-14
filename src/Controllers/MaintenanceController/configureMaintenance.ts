import { Request, Response } from "express";
import societyMaintenance from "../../Models/MaintenanceModel/societyMaintenance.js";
import Society from "../../Models/AuthModels/societyModel.js";
import User from "../../Models/AuthModels/userModel.js";

const configureMaintenance = async (req: Request, res: Response) => {
  try {
    const { society_code, maintenance_period, maintenance_basis, custom_maintenance_values } = req.body;

    const societyCheck = await Society.findOne({ society_code });
    if (!societyCheck) {
      return res.status(404).json({ errorMsg: "Invalid Society Code" });
    }

    const loggedInUserId = req.user?._id;
    
    if (!loggedInUserId) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(404).json({ errorMsg: "User not found" });
    }

    if(!societyCheck.admin_ids.includes(user._id.toString())){
      return res.status(404).json({ errorMsg: "Only admin is allow to configure the society" });
    }

    if(societyCheck.society_code != user.society_code){
      return res.status(404).json({ errorMsg: "User is from another society" });
    }

    if (!["monthly", "annually", "quarterly"].includes(maintenance_period)) {
      return res.status(404).json({ errorMsg: "Invalid maintenance period" });
    }

    if (!["flatwise", "bhkwise", "custom"].includes(maintenance_basis)) {
      return res.status(404).json({ errorMsg: "Invalid maintenance collection type" });
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
    return res.status(200).json({
      msg: "Society Maintenance configured successfully",
      data: newConfiguration,
    });
  } catch (error) {
    console.error("Error configuring maintenance record:", error);
    return res.status(500).json({ errorMsg: "Server error" });
  }
};

export default configureMaintenance;
