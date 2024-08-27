import { Request, Response } from "express";
// import verifyOTP from '../../Functions/OTP/verifyOtp.js';
import generateOtp from "../../Functions/OTP/generateOtp.js";

interface VerifyOtpRequestBody {
  otp: string;
}

const verifyOtp = async (
  req: Request<{}, {}, VerifyOtpRequestBody>,
  res: Response
) => {
  try {
    const { mb_no, otp } = req.body;
    // const generatedOtp = await generateOtp(otp);

    if (otp != 123456) {
      return res.status(500).json({ msg: "Otp is Invalid", status: false });
    }

    return res
      .status(200)
      .json({ msg: "Otp verified Successfully", status: true });
  } catch {}
};

export default verifyOtp;
