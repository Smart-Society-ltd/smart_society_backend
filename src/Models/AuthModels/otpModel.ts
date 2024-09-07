import mongoose from "mongoose";

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

const OtpModel = mongoose.model("Otp", otpSchema);
export default OtpModel;
