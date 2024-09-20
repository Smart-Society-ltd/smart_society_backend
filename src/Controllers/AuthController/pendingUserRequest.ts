import { Request, Response } from "express";
import mongoose from "mongoose";
import generateToken from "../../Functions/JWT/generateToken.js";
import User from "../../Models/AuthModels/userModel.js";
import TempUser from "../../Models/AuthModels/tempUserModel.js";
import Society from "../../Models/AuthModels/societyModel.js";
import assignFlat from "../../Functions/Society/assignFlats.js";

const pendingUsers = async (req: Request, res: Response) => {
  try {
    const { society_code } = req.params;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user || society_code != user.society_code) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const pendingUsers = await User.find({ society_code, isVerified: false })
      .populate('tempUserId', 'flat_type floor_no');

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
      error: error.message,
    });
  }
};

const processUsers = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.body;
    const tempUser = await TempUser.findOne({ user_id: id });
    const user = await User.findOne({ _id: id });

    if (!tempUser || !user) {
      return res.status(404).json({
        errorMsg: "Registration request not found",
        status: false,
      });
    }

    const loggedInUserId = req.user._id;
    const loggedInuser = await User.findById(loggedInUserId);
    const society = await Society.findOne({ society_code: loggedInuser.society_code });

    if (!society) {
      return res.status(404).json({ errorMsg: "Society not found" });
    }

    user.isVerified = true;

    await assignFlat(user);

    const savedUser = await user.save();
    const token = generateToken(user);

    await TempUser.findOneAndDelete({ user_id: id });

    return res.status(200).json({
      msg: "User registered successfully",
      newUser: savedUser,
      status1: true,
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