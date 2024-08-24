import mongoose, { Document, Schema } from "mongoose";
import User from "../AuthModels/userModel.js";
import Society from "../AuthModels/societyModel.js";

interface Transaction {
  amount: number;
  date: Date;
  description?: string;
  status: Boolean;
}

export interface Maintenance extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  society_code: mongoose.Schema.Types.ObjectId;
  total_maintenance: number;
  paid_amount: number;
  remaining_amount: number;
  penalty: number;
  due_amount: number;
  event_charges: number;
  transactions: Transaction[];
}

const transactionSchema = new Schema<Transaction>(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const maintenanceSchema = new Schema<Maintenance>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    society_code: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    total_maintenance: {
      type: Number,
      required: true,
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
    due_amount: {
      type: Number,
      default: function () {
        return this.total_maintenance - this.paid_amount;
      },
    },
    penalty: {
      type: Number,
      default: 0,
    },
    event_charges: {
      type: Number,
      default: 0,
    },
    remaining_amount: {
      type: Number,
      default: function () {
        return this.due_amount + this.penalty + this.event_charges;
      },
    },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

const Maintenance = mongoose.model<Maintenance>(
  "Maintenance",
  maintenanceSchema
);

export default Maintenance;
