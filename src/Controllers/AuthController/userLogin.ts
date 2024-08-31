import { Request, Response } from 'express';
import User from '../../Models/AuthModels/userModel.js';
import generateToken from '../../Functions/JWT/generateToken.js';
import OtpModel from '../../Models/AuthModels/otpModel.js';

interface UserLoginRequestBody {
  mb_no: string;
  otp: string;
}

const userLogin = async (req: Request<{}, {}, UserLoginRequestBody>, res: Response) => {
  try {
    const { mb_no, otp } = req.body;

    const user = await User.findOne({ mb_no });

    if (!user) {
      return res.status(404).json({ msg: "User with this number does not exist", status: false });
    }

    const otpEntry = await OtpModel.findOne({ mb_no });

    if (!otpEntry) {
      return res.status(400).json({ errorMsg: "OTP is Invalid", status: false });
    }

    if (otpEntry.otp !== otp) {
      return res.status(400).json({ errorMsg: "Invalid OTP", status: false });
    }

    const token = generateToken(user);

    await OtpModel.deleteOne({ mb_no });

    return res.status(200).json({
      msg: "Login successful",
      status: true,
      user,
      token
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ errorMsg: "Failed to login user", error: error.message });
  }
};

export default userLogin;
