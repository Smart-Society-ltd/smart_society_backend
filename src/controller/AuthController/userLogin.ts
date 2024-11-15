import { Request, Response } from 'express';
import User from '../../models/AuthModels/userModel.js';
import generateToken from '../../utils/jwt/generateToken.js';
import OtpModel from '../../models/AuthModels/otpModel.js';

interface UserLoginRequestBody {
  mb_no: string;
  otp: string;
}

const userLogin = async (req: Request<{}, {}, UserLoginRequestBody>, res: Response) => {
  try {
    const { mb_no, otp } = req.body;

    const user = await User.findOne({ mb_no });

    if (!user) {
      res.status(404).json({ errorMsg: "User with this number does not exist", status: false });
    }

    const otpEntry = await OtpModel.findOne({ mb_no });

    if (!otpEntry) {
      res.status(400).json({ errorMsg: "OTP is Invalid", status: false });
    }

    if (otpEntry.otp !== otp) {
      res.status(400).json({ errorMsg: "Invalid OTP", status: false });
    }

    const token = generateToken(user);

    await OtpModel.deleteOne({ mb_no });

    res.status(200).json({
      msg: "Login successful",
      status: true,
      user,
      token
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ errorMsg: "Failed to login user", error: error.message });
  }
};

export default userLogin;
