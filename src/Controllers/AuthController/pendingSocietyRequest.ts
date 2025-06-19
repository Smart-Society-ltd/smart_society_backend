import { Request, Response } from "express";
import generateToken from "../../Functions/JWT/generateToken.js";
import TempSociety from "../../Schema/AuthModels/tempRegistrationModel.js";
import {
  Society,
  SocietyInterface,
} from "../../Schema/AuthModels/societyModel.js";
import { User } from "../../Schema/AuthModels/userModel.js";
import { checkTempSociety } from "../../Functions/CheckUserSociety/checkUserSociety.js";
import mongoose from "mongoose";

const listPendingRegistrations = async (req: Request, res: Response) => {
  try {
    const pendingRegistrations = await TempSociety.find().populate("user_id");

    return res.status(200).json({ data: pendingRegistrations });
  } catch (error) {
    console.error("Error listing pending registrations:", error);
    return res.status(500).json({
      errorMsg: "Failed to list pending registrations",
      error: error.message,
    });
  }
};

const processAcceptRegistration = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.body;
    const tempRegistration = await TempSociety.findById(id).populate("user_id");

    if (!tempRegistration) {
      return res
        .status(404)
        .json({ msg: "Registration request not found", status: false });
    }

    console.log("Temp registration", tempRegistration);

    const admin_id = (
      tempRegistration.user_id as unknown as mongoose.Document & {
        _id: mongoose.Types.ObjectId;
      }
    )._id;
    console.log("admin_id", admin_id);
    const user = await User.findById(admin_id);
    console.log("user", user);

    const {
      // name,
      // mb_no,
      // email,
      society_name,
      society_add,
      society_city,
      society_state,
      society_pincode,
    } = tempRegistration;

    const normalizedSocietyName = society_name
      .replace(/\s+/g, "")
      .substring(0, 6)
      .toUpperCase();

    const count = await Society.countDocuments();

    const society_code = `${normalizedSocietyName}${count + 1}`;

    // const newAdmin = new User({
    //   name,
    //   mb_no,
    //   email,
    //   society_code,
    //   isVerified: true,
    //   role: "admin",
    // });

    user.isVerified = true;
    user.role = "admin";
    user.society_code = society_code;

    await user.save();

    const newSociety = new Society({
      society_name,
      society_add,
      society_city,
      society_state,
      society_pincode,
      society_code,
      admin_ids: [admin_id],
    });

    await newSociety.save();
    await TempSociety.findByIdAndDelete(id);

    return res.status(200).json({
      msg: "Society Registered Successfully",
      // status: true,
    });
  } catch (error) {
    console.error("Error processing registration:", error);
    return res.status(500).json({
      errorMsg: "Failed to process registration",
      error: error.message,
    });
  }
};

const processRejectRegistration = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.body;

    const tempRegistration = await TempSociety.findById(id);
    if (!tempRegistration) {
      return res.status(404).json({
        errorMsg: "Registration request not found",
        status: false,
      });
    }
    await TempSociety.findByIdAndDelete(id);
    return res.status(200).json({
      msg: "Registration request rejected successfully",
      status: true,
    }); 
  } catch (error) {
    console.error("Error rejecting registration:", error);
    return res.status(500).json({ 
      errorMsg: "Failed to reject registration",
      status: false,
      error: error.message,
    });
  }
};

export { listPendingRegistrations, processAcceptRegistration, processRejectRegistration };
