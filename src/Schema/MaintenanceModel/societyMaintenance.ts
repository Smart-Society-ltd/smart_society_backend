import mongoose, { Document, Schema } from "mongoose";

export interface Maintenance extends Document {
  society_code: string; 
  maintenance_period: string;
  maintenance_basis: string;
  custom_maintenance_values?: {
    flat_no: string;
    maintenance_amount: number;
  }[];
}

const societyMaintenanceSchema = new Schema<Maintenance>(
  {
    society_code: {
      type: String, 
      required: true,
    },
    maintenance_period: {
      type: String,
      enum: ["monthly", "annually", "quarterly"],
      required: true,
    },
    maintenance_basis: {
      type: String,
      enum: ["flatwise", "bhkwise", "custom"],
      required: true,
    },
    custom_maintenance_values: [
      {
        flat_no: { type: String, required: true },
        maintenance_amount: { type: Number, required: true },
      }
    ],
  },
  { timestamps: true }
);

const societyMaintenance = mongoose.model<Maintenance>(
  "societyMaintenance",
  societyMaintenanceSchema
);

export default societyMaintenance;
