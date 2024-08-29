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
      default: Date.now, // This field will store the creation time of the document
      expires: 300, // Document will automatically delete 300 seconds (5 minutes) after creation
    },
  },
  { timestamps: true }
);

// The `expires` option on the `createdAt` field is what sets up the TTL index.

const OtpModel = mongoose.model("Otp", otpSchema);
export default OtpModel;
