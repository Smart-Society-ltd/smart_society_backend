import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAnnualPlan extends Document {
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  responsible_person: Types.ObjectId;
  assigned_members: Types.ObjectId[];
  budget_allocation: number;
  status: "Planned" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  year: string;
  society_code: string;
  created_by: Types.ObjectId;
}

const plansSchema = new Schema<IAnnualPlan>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    responsible_person: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assigned_members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    budget_allocation: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed"],
      default: "Planned",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    year: {
      type: String,
      required: true,
    },
    society_code: {
      type: String,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Plans = mongoose.model<IAnnualPlan>("Plans", plansSchema);

export default Plans;
