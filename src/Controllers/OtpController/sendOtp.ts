import { Request, Response } from 'express';
import sendOTP from '../../Functions/OTP/sendOtp.js';
import generateOtp from '../../Functions/OTP/generateOtp.js';
import { error } from 'console';

interface SendOtpRequestBody {
  mb_no: string;
}

const sendOtp = async (req: Request<{}, {}, SendOtpRequestBody>, res: Response) => {
  try {
    const { mb_no } = req.body;
    
    if(!mb_no){
      return res.status(500).json({ error: "Mobile no is required to send otp"});
    }
    //Temporary
    const msg = 123456;
    return res.status(200).json({ msg: msg });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ msg: "Failed to send OTP", error: error.message });
  }
};

export default sendOtp;