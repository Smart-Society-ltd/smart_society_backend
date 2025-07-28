
// import { Schema, model } from 'mongoose';

// // Society Configuration Schema
// const SocietyConfigurationSchema = new Schema({
//   society_code: { type: String, required: true, index: true },
//   maintenance_period: { type: String, enum: ["monthly", "quarterly", "semi-annually", "annually"], required: true },
//   maintenance_basis: { type: String, enum: ["fixed", "per-occupant", "per-square-feet", "unit-type"], required: true },
  
//   // Rate configurations
//   fixed_maintenance_amount: { type: Number },
//   per_occupant_rate: { type: Number },
//   per_square_feet_rate: { type: Number },
//   unit_type_rates: [{
//     unit_type: { type: String, required: true },
//     rate: { type: Number, required: true }
//   }],
  
//   // Amenities
//   amenities: [{
//     name: { type: String, required: true },
//     monthly_charge: { type: Number, required: true },
//     is_optional: { type: Boolean, default: false }
//   }],
  
//   // Payment configuration
//   payment_due_day: { type: Number, required: true, min: 1, max: 31 },
//   billing_cycle: { type: String, enum: ["monthly", "quarterly", "semi-annually", "annually"], required: true },
  
//   // Penalty configuration
//   penalty_type: { type: String, enum: ["fixed", "percentage", "per-day", "tiered"], required: true },
//   fixed_penalty_amount: { type: Number },
//   penalty_percentage: { type: Number },
//   per_day_penalty: { type: Number },
//   tiered_penalty: [{
//     days_from_due: { type: Number, required: true },
//     penalty_amount: { type: Number, required: true },
//     is_percentage: { type: Boolean, default: false }
//   }],
  
//   // Custom rates
//   custom_flat_rates: [{
//     flat_no: { type: String, required: true },
//     custom_amount: { type: Number, required: true },
//     reason: { type: String }
//   }],
  
//   // Status
//   is_active: { type: Boolean, default: true },
//   configured_by: { type: String, required: true }, // Admin user ID
  
//   // Timestamps
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now }
// });

// // Maintenance Record Schema
// const MaintenanceSchema = new Schema({
//   user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   flat_id: { type: Schema.Types.ObjectId, ref: 'Flat', required: true },
//   society_code: { type: String, required: true, index: true },
//   year: { type: Number, required: true },
//   month: { type: Number, required: true, min: 1, max: 12 },
//   period: { type: String, required: true },
  
//   // Maintenance breakdown
//   base_maintenance: { type: Number, required: true, default: 0 },
//   amenities_charges: [{
//     amenity_name: { type: String, required: true },
//     amount: { type: Number, required: true }
//   }],
//   total_amenities: { type: Number, default: 0 },
//   custom_adjustments: { type: Number, default: 0 },
//   total_maintenance: { type: Number, required: true },
  
//   // Payment tracking
//   paid_amount: { type: Number, default: 0 },
//   remaining_amount: { type: Number, required: true },
//   penalty: { type: Number, default: 0 },
//   total_due: { type: Number, required: true },
  
//   // Important dates
//   generated_date: { type: Date, default: Date.now },
//   due_date: { type: Date, required: true },
//   payment_date: { type: Date },
  
//   // Status tracking
//   is_paid: { type: Boolean, default: false },
//   payment_status: { 
//     type: String, 
//     enum: ["unpaid", "partial", "paid", "overdue", "penalty_applied"], 
//     default: "unpaid" 
//   },
//   days_overdue: { type: Number, default: 0 },
  
//   // Transaction history
//   transactions: [{
//     transaction_id: { type: String, required: true },
//     amount: { type: Number, required: true },
//     payment_method: { type: String, required: true },
//     transaction_date: { type: Date, required: true },
//     status: { type: String, enum: ["success", "failed", "pending"], required: true }
//   }],
  
//   // Metadata
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now }
// });

// // Compound indexes for better performance
// MaintenanceSchema.index({ society_code: 1, year: 1, month: 1 });
// MaintenanceSchema.index({ user_id: 1, year: 1, month: 1 });
// MaintenanceSchema.index({ payment_status: 1, due_date: 1 });

// const SocietyConfiguration = model('SocietyConfiguration', SocietyConfigurationSchema);
// const Maintenance = model('Maintenance', MaintenanceSchema);

// export { SocietyConfiguration, Maintenance };

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
