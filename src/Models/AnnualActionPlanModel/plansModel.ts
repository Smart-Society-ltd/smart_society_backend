import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAnnualPlan extends Document {
  annual_plan_id: Types.ObjectId;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  responsible_person: Types.ObjectId;
  work_distribution: Types.ObjectId[];
  budget_allocation: number;
  status: "Planned" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
}

const plansSchema = new Schema<IAnnualPlan>(
  {
    annual_plan_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
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
      // required: true,
    },
    work_distribution: [
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
  },
  { timestamps: true }
);

const Plans = mongoose.model<IAnnualPlan>("Plans", plansSchema);

export default Plans;
