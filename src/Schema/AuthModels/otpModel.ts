import mongoose, { Document } from "mongoose";

interface OtpInterface extends Document {
  mb_no: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new mongoose.Schema(
  {
    mb_no: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, 
      expires: 300,
    },
  },
  { timestamps: true }
);

const OtpModel = mongoose.model<OtpInterface>("Otp", otpSchema);
export default OtpModel;
