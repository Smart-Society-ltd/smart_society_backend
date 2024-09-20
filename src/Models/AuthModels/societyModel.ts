import mongoose, { Document } from "mongoose";

interface SocietyInterface extends Document {
  society_name: string;
  society_add: string;
  society_city: string;
  society_state: string;
  society_pincode: string;
  society_code: string;
  admin_ids: string[];
  total_flats: number;
  remaining_flats: number;
}

const societySchema = new mongoose.Schema(
  {
    society_name: {
      type: String,
      required: true,
    },
    society_add: {
      type: String,
      required: true,
    },
    society_city: {
      type: String,
      required: true,
    },
    society_state: {
      type: String,
      required: true,
    },
    society_pincode: {
      type: String,
      required: true,
    },
    society_code: {
      type: String,
      required: true,
      unique: true,
    },
    admin_ids: {
      type: [String],
      required: true,
    },
    total_flats: {
      type: Number,
      required: true,
      default: 10,
    },
    remaining_flats: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  { timestamps: true }
);

const Society = mongoose.model<SocietyInterface>("Society", societySchema);
export default Society;
