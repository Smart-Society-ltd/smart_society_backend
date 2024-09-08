import { Request, Response } from "express";
import generateToken from "../../Functions/JWT/generateToken.js";
import tempSociety from "../../Models/AuthModels/tempRegistrationModel.js";
import Society from "../../Models/AuthModels/societyModel.js";
import User from "../../Models/AuthModels/userModel.js";

interface TempRegistration {
  id: string;
  name: string;
  mb_no: string;
  email: string;
  // password: string;
  society_name: string;
  society_add: string;
  society_city: string;
  society_state: string;
  society_pincode: string;
}

interface User {
  // username: string;
  id: string;
  name: string;
  mb_no: string;
  email: string;
  // password: string;
  society_code: string;
  role: string;
}

interface Society {
  id: string;
  society_name: string;
  society_add: string;
  society_city: string;
  society_state: string;
  society_pincode: string;
  society_code: string;
  admin_id: string;
}

const listPendingRegistrations = async (req: Request, res: Response) => {
  try {
    const pendingRegistrations = await tempSociety.find();

    return res.status(200).json({ data: pendingRegistrations });
  } catch (error) {
    console.error("Error listing pending registrations:", error);
    return res.status(500).json({
      errorMsg: "Failed to list pending registrations",
      error: error.message,
    });
  }
};

const processRegistration = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.body;
    const tempRegistration = await tempSociety.findOne({ _id: id });
    if (!tempRegistration) {
      return res
        .status(404)
        .json({ msg: "Registration request not found", status: false });
    }

    const {
      name,
      mb_no,
      email,
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

    const newAdmin = new User({
      // username: `user_${Math.random().toString(36).substr(2, 8)}`,
      name,
      mb_no,
      email,
      society_code,
      isVerified: true,
      role: "admin",
    });

    const savedAdmin = await newAdmin.save();
    const admin_id = savedAdmin._id;

    const newSociety = new Society({
      society_name,
      society_add,
      society_city,
      society_state,
      society_pincode,
      society_code,
      admin_ids: admin_id,
    });

    const savedSociety = await newSociety.save();
    await tempSociety.findByIdAndDelete(id);

    return res.status(200).json({
      msg: "Society Registered Successfully",
      status: true,
      Admin: savedAdmin,
      Society: savedSociety,
    });
  } catch (error) {
    console.error("Error processing registration:", error);
    return res.status(500).json({
      errorMsg: "Failed to process registration",
      error: error.message,
    });
  }
};

export { listPendingRegistrations, processRegistration };
