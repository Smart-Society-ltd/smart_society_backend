import { Request, Response } from "express";
import Maintenance from "../../models/MaintenanceModel/userMaintenanceModel.js";
import Society from "../../models/AuthModels/societyModel.js";
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';
import asyncHandler from './../../utils/asynchandler.js';

interface SocietyMaintenanceRequestParams {
  society_id: string;
}

const getSocietyMaintenance = asyncHandler(
  async (
    req: Request<{}, {}, SocietyMaintenanceRequestParams>,
    res: Response
  ) => {
    const { society_code } = req.params as { readonly society_code: string };

    const checkSocietyCode = await Society.findOne({ society_code: society_code });
    if (!checkSocietyCode) {
      throw new ApiError("Invalid society code", 404);
    }

    const result = await Maintenance.aggregate([
      { $match: { society_code: society_code } },
      {
        $group: {
          _id: "$society_id",
          total_maintenance: { $sum: "$total_maintenance" },
          total_paid: { $sum: "$paid_amount" },
          total_penalty: { $sum: "$penalty" },
          total_due: { $sum: "$due_amount" },
          total_event_charges: { $sum: "$event_charges" },
        },
      },
    ]);

    res.status(200).json(new ApiResponse({ maintainance: result }, "Maintenance data fetched successfully"));
  }
);

export default getSocietyMaintenance;
