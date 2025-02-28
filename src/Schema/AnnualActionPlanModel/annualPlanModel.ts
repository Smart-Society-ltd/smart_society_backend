import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAnnualPlan extends Document {
  year: number;
  society_code: string;
  created_by: Types.ObjectId;
  goals: string;
  projects: Types.ObjectId[];
}

const AnnualplansSchema = new Schema<IAnnualPlan>(
  {
    year: {
      type: Number,
      required: true,
    },
    society_code: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goals: {
      type: String,
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true }
);

const AnnualPlans = mongoose.model<IAnnualPlan>("AnnualPlans", AnnualplansSchema);

export default AnnualPlans;
