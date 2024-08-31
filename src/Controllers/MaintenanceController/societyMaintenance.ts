import { Request, Response } from "express";
import Maintenance from "../../Models/MaintenanceModel/userMaintenanceModel.js";
import Society from "../../Models/AuthModels/societyModel.js";

interface SocietyMaintenanceRequestParams {
  society_id: string;
}

const getSocietyMaintenance = async (
  req: Request<SocietyMaintenanceRequestParams>,
  res: Response
) => {
  try {   
    const { society_code } = req.params;

    const checkSocietyCode = await Society.findOne({ society_code: society_code });
     if (!checkSocietyCode) {
      return res.status(400).json({
        msg: "Invalid Society Id",
        status: false,
      });
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

    return res.status(200).json({
      msg: "Maintenance data fetched successfully",
      status: true,
      result,
    });
  } catch (error) {
    console.error("Error while fetching maintenance data:", error);
    return res
      .status(500)
      .json({ msg: "Failed to fetch maintenance data", error: error.message });
  }
};

export default getSocietyMaintenance;
