import mongoose, { Schema } from "mongoose";

const UserMaintenanceSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  society_code: { type: String, required: true },
  period: { type: String, required: true }, // e.g. "2024-08" or "Q2-2024"
  maintenance_amount: { type: Number, required: true },
  amenities_charge: { type: Number, default: 0 },
  penalty_amount: { type: Number, default: 0 },
  total_due: { type: Number, required: true },
  is_paid: { type: Boolean, default: false },
  due_date: { type: Date, required: true },
  paid_at: { type: Date },
  payment_reference: { type: String }
}, { timestamps: true });

const UserMaintenance = mongoose.model('UserMaintenance', UserMaintenanceSchema);
export default UserMaintenance;
