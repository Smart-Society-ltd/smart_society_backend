import { Request, Response } from "express";
// import bcryptjs from "bcryptjs";
import tempSociety from "../../Models/AuthModels/tempRegistrationModel.js";
import User from "../../Models/AuthModels/userModel.js";

interface RegisterRequestBody {
  name: string;
  mb_no: string;
  email: string;
  society_name: string;
  society_add: string;
  society_city: string;
  society_state: string;
  society_pincode: string;
}

const tempRegisterSociety = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
) => {
  try {
    const {
      name,
      mb_no,
      email,
      // password,
      society_name,
      society_add,
      society_city,
      society_state,
      society_pincode,
    } = req.body;

    const existingUser1 = await tempSociety.findOne({ email });
    const existingUser2 = await User.findOne({ email });

    if (existingUser1 || existingUser2) {
      return res
        .status(404)
        .json({ msg: "User with this email already exists", status: false });
    }

    const newTempRegistration = new tempSociety({
      name,
      mb_no,
      email,
      // password: hashedPassword,
      society_name,
      society_add,
      society_city,
      society_state,
      society_pincode,
    });

    const savedRegistration = await newTempRegistration.save();

    const userSection = {
      name: savedRegistration.name,
      email: savedRegistration.email,
      mb_no: savedRegistration.mb_no,
    };

    const societySection = {
      society_name: savedRegistration.society_name,
      society_add: savedRegistration.society_add,
      society_city: savedRegistration.society_city,
      society_state: savedRegistration.society_state,
      society_pincode: savedRegistration.society_pincode,
    };

    return res.status(200).json({
      msg: "Registration request submitted successfully",
      status: true,
      data: {
        user: userSection,
        society: societySection,
      },
    });
  } catch (error) {
    console.error("Error submitting registration request:", error);
    return res.status(500).json({
      msg: "Failed to submit registration request",
      error: error.message,
    });
  }
};

export default tempRegisterSociety;
