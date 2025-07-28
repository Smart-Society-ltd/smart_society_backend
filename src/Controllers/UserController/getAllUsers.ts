import {User} from "../../Schema/AuthModels/userModel.js";
import { Request, Response } from "express";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ errorMsg: "No users found in this society" });
    }

    res.status(200).json({ msg: "Users fetched successfully", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ errorMsg: "Error fetching users" });
  }
};

export default getAllUsers;