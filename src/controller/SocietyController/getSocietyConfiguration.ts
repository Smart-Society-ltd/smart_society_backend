import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Society from "../../models/AuthModels/societyModel.js";
import User from '../../models/AuthModels/userModel.js'
import Maintenance from "../../models/MaintenanceModel/societyMaintenance.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

interface getSocietyRequestBody {
  userId: string;
}

const getSocietyConfiguration = asyncHandler(
  async (
    req: Request<{}, {}, getSocietyRequestBody>,
    res: Response
  ) => {
    const loggedInUserId = req.user?._id;

    const user = await User.findById(loggedInUserId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const society = await Society.findOne({ society_code: user.society_code });

    const societyMaintenance = await Maintenance.findOne({ society_code: user.society_code });

    const societyData = {
      total_flats: society.total_flats,
      remaining_flats: society.remaining_flats,
      maintenance_period: societyMaintenance.maintenance_period,
      maintenance_basis: societyMaintenance.maintenance_basis,
      custom_maintenance_values: societyMaintenance.custom_maintenance_values,
    }

    res.status(200).json(new ApiResponse({ societyData }, "Society configuration found"));
  }
);

export default getSocietyConfiguration;
