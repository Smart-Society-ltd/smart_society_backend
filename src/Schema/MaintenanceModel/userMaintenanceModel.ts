import mongoose, { Schema } from "mongoose";

const UserMaintenanceSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  society_code: { type: String, required: true },
  period: { type: String, required: true }, // e.g. "2024-08"
  
  maintenance_amount: { type: Number, required: true },
  amenities_charge: { type: Number, default: 0 },
  penalty_amount: { type: Number, default: 0 },

  // New fields for partial payment tracking
  maintenance_paid: { type: Boolean, default: false },
  penalty_paid: { type: Boolean, default: false },
  amenities_paid: { type: Boolean, default: false },

  total_due: { type: Number, required: true },

  is_paid: { type: Boolean, default: false }, // true if everything paid
  due_date: { type: Date, required: true },
  paid_at: { type: Date },

  // For tracking payment references
  payment_reference: { type: String }, // Optional combined
  maintenance_payment_ref: { type: String },
  penalty_payment_ref: { type: String },
  amenities_payment_ref: { type: String }
  
}, { timestamps: true });

const UserMaintenance = mongoose.model('UserMaintenance', UserMaintenanceSchema);
export default UserMaintenance;
