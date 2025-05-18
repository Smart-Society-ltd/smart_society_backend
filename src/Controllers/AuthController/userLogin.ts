import { Request, Response } from "express";
import { User } from "../../Schema/AuthModels/userModel.js";
import generateToken from "../../Functions/JWT/generateToken.js";
import OtpModel from "../../Schema/AuthModels/otpModel.js";
import { checkUser } from "../../Functions/CheckUserSociety/checkUserSociety.js";

interface VerifyOtpRequestBody {
  mb_no: string;
  otp: string;
  source: "login" | "userRegister" | "societyRegister";
}

const verifyOtp = async (
  req: Request<{}, {}, VerifyOtpRequestBody>,
  res: Response
) => {
  try {
    const { mb_no, otp, source } = req.body;

    if (!mb_no || !otp) {
      return res.status(400).json({
        errorMsg: "Mobile number and OTP are required",
        status: false
      });
    }

    // Verify the OTP first
    const otpEntry = await OtpModel.findOne({ mb_no });

    if (!otpEntry) {
      return res
        .status(400)
        .json({ errorMsg: "OTP not found or expired", status: false });
    }

    if (otpEntry.otp !== otp) {
      return res.status(400).json({ errorMsg: "Invalid OTP", status: false });
    }

    // Delete the OTP entry after successful verification
    await OtpModel.deleteOne({ mb_no });

    // Always check if user exists with this mobile number
    const existingUser = await checkUser({ mb_no });

    // Different handling based on source
    if (source === "login") {
      if (!existingUser) {
        return res.status(404).json({
          errorMsg: "User with this number does not exist",
          status: false,
        });
      }

      const token = generateToken(existingUser);

      return res.status(200).json({
        msg: "Login successful",
        status: true,
        user: existingUser,
        token,
      });
    } else {
      // For register flows, return verification success and user info if exists
      return res.status(200).json({
        msg: "OTP verified successfully",
        status: true,
        mb_no,
        user: existingUser || null
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ errorMsg: "Failed to verify OTP", error: error.message });
  }
};

export default verifyOtp;