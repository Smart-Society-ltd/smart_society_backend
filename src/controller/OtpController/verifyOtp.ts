import { Request, Response } from "express";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

interface VerifyOtpRequestBody {
  otp: string;
  mb_no: string;
}

const verifyOtp = asyncHandler(
  async (
    req: Request<{}, {}, VerifyOtpRequestBody>,
    res: Response
  ) => {
    const { mb_no, otp } = req.body;
    // const generatedOtp = await generateOtp(otp);

    if (otp != '123456') {
      throw new ApiError("Invalid OTP", 400);
    }

    res
      .status(200)
      .json(new ApiResponse({
        verified: true,
      },
        "OTP verified successfully"
      ));
  }
);

export default verifyOtp;
