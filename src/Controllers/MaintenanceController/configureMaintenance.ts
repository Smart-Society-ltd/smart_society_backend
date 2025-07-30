import { Request, Response } from "express";
import { SocietyConfiguration } from "../../Schema/MaintenanceModel/maintenance.js";

const configureSocietyMaintenance = async (req: Request, res: Response) => {
  try {
    const {
      society_code,
      maintenance_period,
      maintenance_basis,
      per_square_feet_rate,
      flat_type_rates,
      penalty_type,
      per_day_penalty,
      fixed_penalty,
      payment_due_day,
      billing_cycle,
      amenities,
      custom_flat_rates
    } = req.body;

    const userId = req.user?._id;

    // Deactivate previous config
    await SocietyConfiguration.updateMany(
      { society_code, is_active: true },
      { is_active: false }
    );

    const newConfig = new SocietyConfiguration({
      society_code,
      maintenance_period,
      maintenance_basis,
      per_square_feet_rate,
      flat_type_rates,
      penalty_type,
      per_day_penalty,
      fixed_penalty,
      payment_due_day,
      billing_cycle,
      amenities,
      custom_flat_rates,
      configured_by: userId,
      is_active: true
    });

    await newConfig.save();

    return res.status(201).json({
      success: true,
      message: "Society maintenance configured successfully",
      config: newConfig
    });

  } catch (error) {
    console.error("Error in configuring society:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export default configureSocietyMaintenance;