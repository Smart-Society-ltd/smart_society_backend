import { Request, Response } from "express";
import mongoose from "mongoose";
import generateToken from "../../Functions/JWT/generateToken.js";
import { User } from "../../Schema/AuthModels/userModel.js";
import TempUser from "../../Schema/AuthModels/tempUserModel.js";
import { Society } from "../../Schema/AuthModels/societyModel.js";
import assignFlat from "../../Functions/Society/assignFlats.js";
import {
  checkSociety,
  checkUser,
} from "../../Functions/CheckUserSociety/checkUserSociety.js";

const pendingUsers = async (req: Request, res: Response) => {
  try {
    const { society_code } = req?.params;

    const pendingUsers = await TempUser.find({
      society_code,
    });

    if (pendingUsers.length === 0) {
      return res
        .status(200)
        .json({ msg: "No pending users found for the given society code." });
    }
    return res.status(200).json({ data: pendingUsers });
  } catch (error) {
    console.error("Error listing pending registrations:", error);
    return res.status(500).json({
      errorMsg: "Failed to list pending registrations",
      error: error?.message,
    });
  }
};

const processUsers = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.body;
    const tempUser = await TempUser.findOne({ user_id: id });
    const user = await checkUser({ _id: id });

    if (!tempUser || !user) {
      return res.status(404).json({
        errorMsg: "Registration request not found",
        status: false,
      });
    }

    await assignFlat(user, tempUser);

    user.isVerified = true;
    user.role = "user";

    const savedUser = await user.save();
    const token = generateToken(user);

    await TempUser.findOneAndDelete({ user_id: id });

    return res.status(200).json({
      msg: "User registered successfully",
      newUser: savedUser,
      status: true,
      token,
    });
  } catch (error) {
    console.error("Error processing registration:", error);
    return res.status(500).json({
      errorMsg: "Failed to process registration",
      error: error.message,
    });
  }
};

export { pendingUsers, processUsers };
