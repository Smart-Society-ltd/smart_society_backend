import { Request, Response } from "express";
import sendOTP from "../../utils/otp/sendOtp.js";
import generateOtp from "../../utils/otp/generateOtp.js";
import OtpModel from "../../models/AuthModels/otpModel.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

interface SendOtpRequestBody {
  mb_no: string;
}

const sendOtp = asyncHandler(
  async (
    req: Request<{}, {}, SendOtpRequestBody>,
    res: Response
  ) => {
    const { mb_no } = req.body;

    if (!mb_no) {
      throw new ApiError("Mobile number is required", 400);
    }

    const otp = 123456;
    const newOtpRegistration = new OtpModel({
      mb_no,
      otp,
    });

    await newOtpRegistration.save();

    res.status(200).json(new ApiResponse({ otp }, "OTP sent successfully"));
  }
);

export default sendOtp;
