import { Request, Response } from "express";
// import bcryptjs from "bcryptjs";
import tempSociety from "../../Schema/AuthModels/tempRegistrationModel.js";
import { User } from "../../Schema/AuthModels/userModel.js";
import { checkUser } from "../../Functions/CheckUserSociety/checkUserSociety.js";
import mongoose from "mongoose";

type RegisterRequestBody = {
  id: string;
  society_name: string;
  society_add: string;
  society_city: string;
  society_state: string;
  society_pincode: string;
};

const tempRegisterSociety = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
) => {
  try {
    const {
      id,
      society_name,
      society_add,
      society_city,
      society_state,
      society_pincode,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(409)
        .json({ msg: "User does not exist", status: false });
    }

    const newTempRegistration = new tempSociety({
      user_id: new mongoose.Types.ObjectId(id),
      society_name,
      society_add,
      society_city,
      society_state,
      society_pincode,
    });

    const savedRegistration = await newTempRegistration.save();

    const userSection = {
      name: user?.name,
      email: user?.email,
      mb_no: user?.mb_no,
    };

    const societySection = {
      society_name: savedRegistration?.society_name,
      society_add: savedRegistration?.society_add,
      society_city: savedRegistration?.society_city,
      society_state: savedRegistration?.society_state,
      society_pincode: savedRegistration?.society_pincode,
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
      errorMsg: "Failed to submit registration request",
      error: error.message,
    });
  }
};

export default tempRegisterSociety;
