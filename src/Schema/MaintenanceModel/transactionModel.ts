import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  maintenance_id: { type: Schema.Types.ObjectId, ref: 'UserMaintenance' },
  period: { type: String, required: true }, // e.g., "2024-08"
  amount: { type: Number, required: true },
  payment_breakdown: {
    maintenance: { type: Number, default: 0 },
    penalty: { type: Number, default: 0 },
    due: { type: Number, default: 0 },
    amenities: { type: Number, default: 0 },
  },
  payment_reference: { type: String },
  payment_mode: { type: String, default: "Online" },
  paid_at: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Transaction", TransactionSchema);
