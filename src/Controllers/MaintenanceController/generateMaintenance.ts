import { User } from "../../Schema/AuthModels/userModel.js";
import SocietyConfiguration from "../../Schema/MaintenanceModel/societyMaintenance.js";
import UserMaintenance from "../../Schema/MaintenanceModel/userMaintenanceModel.js";
import moment from "moment";

interface FlatInfo {
  flat_area: number;
  flat_type: string;
  flat_no: string;
}

interface PopulatedUser {
  _id: string;
  flat: FlatInfo;
  amenities?: string[];
  society_code: string;
}

interface MaintenanceConfig {
  maintenance_basis: "per-square-feet" | "flat-type-wise" | "fixed-per-flat";
  per_square_feet_rate?: number;
  flat_type_rates?: Map<string, number>;
  custom_flat_rates?: { flat_no: string; custom_amount: number }[];
  payment_due_day: number;
  amenities?: { name: string; monthly_charge: number }[];
}

const generateMaintenance = async (req, res) => {
  try {
    const { society_code, period } = req.body;

    const config = await SocietyConfiguration.findOne({ society_code });
    if (!config)
      return res.status(404).json({ message: "Society config not found" });

    const typedConfig = config.toObject() as MaintenanceConfig;

    const users = (await User.find({ society_code })
      .populate({ path: "flat", select: "flat_area flat_type flat_no" })
      .lean()) as PopulatedUser[];

    const maintenanceEntries = [];

    for (const user of users) {
      const flat = user.flat;
      if (!flat) continue;

      let maintenance_amount = 0;

      // ----- Basis Handling -----
      if (typedConfig.maintenance_basis === "per-square-feet") {
        maintenance_amount =
          flat.flat_area * (typedConfig.per_square_feet_rate || 0);
      } else if (typedConfig.maintenance_basis === "flat-type-wise") {
        maintenance_amount =
          typedConfig.flat_type_rates?.get(flat.flat_type) || 0;
      } else if (typedConfig.maintenance_basis === "fixed-per-flat") {
        const customRate = typedConfig.custom_flat_rates?.find(
          (f) => f.flat_no === flat.flat_no
        );
        maintenance_amount = customRate ? customRate.custom_amount : 0;
      }

      // ----- Amenities -----
      let amenities_charge = 0;
      if (user.amenities && typedConfig.amenities) {
        for (const amenity of typedConfig.amenities) {
          if (user.amenities.includes(amenity.name)) {
            amenities_charge += amenity.monthly_charge;
          }
        }
      }

      const total_due = maintenance_amount + amenities_charge;
      const due_date = moment().date(typedConfig.payment_due_day).toDate();

      maintenanceEntries.push({
        user_id: user._id,
        society_code,
        period,
        maintenance_amount,
        amenities_charge,
        total_due,
        due_date,
      });
    }

    await UserMaintenance.insertMany(maintenanceEntries);

    res.status(200).json({
      message: "Maintenance generated successfully",
      count: maintenanceEntries.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export default generateMaintenance;