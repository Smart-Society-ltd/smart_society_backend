import { Request, Response } from "express";
import sendOTP from "../../Functions/OTP/sendOtp.js";
import generateOtp from "../../Functions/OTP/generateOtp.js";
import OtpModel from "../../Models/AuthModels/otpModel.js";

interface SendOtpRequestBody {
  mb_no: string;
}

const sendOtp = async (
  req: Request<{}, {}, SendOtpRequestBody>,
  res: Response
) => {
  try {
    const { mb_no } = req.body;

    if (!mb_no) {
      return res
        .status(500)
        .json({ errorMsg: "Mobile no is required to send otp" });
    }
    const otp = 123456;
    const newOtpRegistration = new OtpModel({
      mb_no,
      otp,
    });

    await newOtpRegistration.save();

    return res.status(200).json({ msg: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ errorMsg: "Failed to send OTP", error: error.message });
  }
};

export default sendOtp;
