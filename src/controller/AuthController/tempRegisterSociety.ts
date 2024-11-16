import { Request, Response } from "express";
// import bcryptjs from "bcryptjs";
import tempSociety from "../../models/AuthModels/tempRegistrationModel.js";
import User from "../../models/AuthModels/userModel.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

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

const tempRegisterSociety = asyncHandler(
  async (
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response
  ) => {
    const {
      name,
      mb_no,
      email,
      society_name,
      society_add,
      society_city,
      society_state,
      society_pincode,
    } = req.body;

    const existingUser1 = await tempSociety.findOne({ email });
    const existingUser2 = await User.findOne({ email });

    if (existingUser1 || existingUser2) {
      throw new ApiError("User already exists", 400);
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

    res.status(200).json(new ApiResponse({
      user: userSection,
      society: societySection,
    },
      "Registration request sent successfully",
    ));
  }
);

export default tempRegisterSociety;
