import { Request, Response } from "express";
import OtpModel from "../../Schema/AuthModels/otpModel.js";
import { checkUser } from "../../Functions/CheckUserSociety/checkUserSociety.js";

type SendOtpRequestBody = {
  mb_no: string;
  source: "login" | "userRegister" | "societyRegister";
};

const sendOtp = async (
  req: Request<{}, {}, SendOtpRequestBody>,
  res: Response
) => {
  try {
    const { mb_no, source } = req.body;

    if (!mb_no) {
      return res
        .status(400)
        .json({ errorMsg: "Mobile number is required to send OTP" });
    }

    // Check if user exists only when the request is from login page
    if (source === "login") {
      const userExists = await checkUser({ mb_no });
      
      if (!userExists) {
        return res.status(404).json({
          errorMsg: "User with this number does not exist. Please register first.",
          status: false
        });
      }
    }

    // Generate OTP (in production, you should use a secure random OTP generator)
    const otp = "123456"; // For development purposes only
    
    // Save OTP to database
    const existingOtp = await OtpModel.findOne({ mb_no });
    
    if (existingOtp) {
      // Update existing OTP
      existingOtp.otp = otp;
      await existingOtp.save();
    } else {
      // Create new OTP entry
      const newOtpRegistration = new OtpModel({
        mb_no,
        otp,
      });
      await newOtpRegistration.save();
    }

    // In production, send SMS with OTP instead of returning it in response
    // sendSmsWithOtp(mb_no, otp);

    return res.status(200).json({ 
      msg: "OTP sent successfully", 
      status: true,
      otp // For development only, remove in production
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ errorMsg: "Failed to send OTP", error: error.message });
  }
};

export default sendOtp;