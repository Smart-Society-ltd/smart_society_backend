import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Maintenance from '../../models/MaintenanceModel/userMaintenanceModel.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';
import asyncHandler from './../../utils/asynchandler.js';

const getUserMaintenance = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      throw new ApiError('User ID is required', 400);
    }

    const maintenance = await Maintenance.findOne({ user_id: userId });

    if (!maintenance) {
      throw new ApiError('Maintenance data not found', 404);
    }

    res.status(200).json(new ApiResponse({ maintenance }, 'Maintenance data fetched successfully'));
  }
);

export default getUserMaintenance;
