import { Request, Response } from "express";
import UserMaintenance from "../../Schema/MaintenanceModel/userMaintenanceModel.js";

const getAllMaintenance = async (req: Request, res: Response) => {
  try {
    const { user } = req.validatedAdmin;
    const { period } = req.query;

    const query: { [key: string]: any } = { society_code : user.society_code };
    if (period) query.period = period;

    const allMaintenances = await UserMaintenance.find(query)
      .populate("user_id", "name flat_no unit_type");

    const summary = {
      total_users: allMaintenances.length,
      total_maintenance_amount: 0,
      total_penalty: 0,
      total_amenities_charge: 0,
      total_due: 0,
      total_paid: 0,
      total_unpaid: 0,
    };

    const data = allMaintenances.map(entry => {
      // Calculate totals
      summary.total_maintenance_amount += entry.maintenance_amount;
      summary.total_penalty += entry.penalty_amount;
      summary.total_amenities_charge += entry.amenities_charge;
      summary.total_due += entry.total_due;
      if (entry.is_paid) {
        summary.total_paid += entry.total_due;
      } else {
        summary.total_unpaid += entry.total_due;
      }

      return {
        user: entry.user_id,
        period: entry.period,
        maintenance_amount: entry.maintenance_amount,
        penalty_amount: entry.penalty_amount,
        amenities_charge: entry.amenities_charge,
        total_due: entry.total_due,
        is_paid: entry.is_paid,
        paid_at: entry.paid_at,
        payment_reference: entry.payment_reference,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Admin maintenance summary fetched successfully",
      summary,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance summary",
      error: error.message,
    });
  }
};

export default getAllMaintenance;