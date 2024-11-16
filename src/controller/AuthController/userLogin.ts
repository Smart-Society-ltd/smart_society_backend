import { Request, Response } from 'express';
import User from '../../models/AuthModels/userModel.js';
import generateToken from '../../utils/jwt/generateToken.js';
import OtpModel from '../../models/AuthModels/otpModel.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';
import asyncHandler from './../../utils/asynchandler.js';

interface UserLoginRequestBody {
  mb_no: string;
  otp: string;
}

const userLogin = asyncHandler(
  async (req: Request<{}, {}, UserLoginRequestBody>, res: Response) => {
    const { mb_no, otp } = req.body;

    const user = await User.findOne({ mb_no });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const otpEntry = await OtpModel.findOne({ mb_no });

    if (!otpEntry || otpEntry.otp !== otp) {
      throw new ApiError("Invalid OTP", 404);
    }

    const token = generateToken(user);

    await OtpModel.deleteOne({ mb_no });

    res.status(200).json(new ApiResponse({
      user,
      token
    }, 'User logged in successfully',
    ));
  })

export default userLogin;
