import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
import User from "../../Models/AuthModels/userModel.js";

interface updateUserRequestBody {
  name: string;
  mb_no: string;
  email: string;
  flat_no: string;
  flat_type: string;
  floor_no: string;
  family_members_count: string;
}

const updateUser = async (
  req: Request<{}, {}, updateUserRequestBody>,
  res: Response
) => {
  try {
    const loggedInUserId = req.user._id.toString();

    if (loggedInUserId !== req.body.userId) {
      return res
        .status(403)
        .json({ errorMsg: "Unauthorized: Cannot update another user's data" });
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(404).json({ errorMsg: "User not found" });
    }

    Object.assign(user, req.body.updateFields);
    await user.save();

    res.status(200).json({ msg: "User updated successfully", data: user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ errorMsg: "Server error" });
  }
};

export default updateUser;
