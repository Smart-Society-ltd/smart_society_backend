import mongoose from "mongoose";

const AmenitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  monthly_charge: { type: Number, required: true },
  is_optional: { type: Boolean, default: false }
});

const CustomRateSchema = new mongoose.Schema({
  flat_no: { type: String, required: true },
  custom_amount: { type: Number, required: true },
  reason: { type: String }
});

const SocietyConfigurationSchema = new mongoose.Schema({
  society_code: { type: String, required: true },
  maintenance_period: { type: String, enum: ["monthly", "quarterly"], required: true },
  maintenance_basis: { type: String, enum: ["per-square-feet", "flat-type-wise", "fixed-per-flat"], required: true },

  // For per-square-feet
  per_square_feet_rate: { type: Number },

  // For flat-type-wise
  flat_type_rates: {
    type: Map,
    of: Number // example: { "1BHK": 800, "2BHK": 1000 }
  },

  // Penalty config
  penalty_type: { type: String, enum: ["per-day", "fixed"], default: "per-day" },
  per_day_penalty: { type: Number },
  fixed_penalty: { type: Number },

  payment_due_day: { type: Number }, // e.g., pay by 5th of month
  billing_cycle: { type: String, enum: ["monthly", "quarterly"], default: "monthly" },

  amenities: [AmenitySchema],
  custom_flat_rates: [CustomRateSchema],

  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  configured_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export const SocietyConfiguration = mongoose.model("SocietyConfiguration", SocietyConfigurationSchema);
