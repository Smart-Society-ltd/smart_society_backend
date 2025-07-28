import { Request, Response } from "express";
import UserMaintenance from "../../Schema/MaintenanceModel/userMaintenanceModel.js";

const getSingleMaintenance = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    // const requester_id = req.user._id;
    // const isAdmin = req.user.role === 'admin';

    // // Only admin or the user themself can access this
    // if (!isAdmin && requester_id !== user_id) {
    //   return res.status(403).json({ message: "Unauthorized access" });
    // }

    const maintenanceRecords = await UserMaintenance.find({ user_id })
      .sort({ period: -1 }) // Latest first
      .select("-__v -createdAt -updatedAt");

    if (!maintenanceRecords.length) {
      return res.status(404).json({ message: "No maintenance records found" });
    }

    return res.status(200).json({
      success: true,
      message: "Maintenance records fetched successfully",
      data: maintenanceRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching maintenance records",
      error: error.message,
    });
  }
};

export default getSingleMaintenance;