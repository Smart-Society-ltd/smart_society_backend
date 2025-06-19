import { Request, Response } from "express";
import generateToken from "../../Functions/JWT/generateToken.js";
import TempUser from "../../Schema/AuthModels/tempUserModel.js";
import assignFlat from "../../Functions/Society/assignFlats.js";
import { checkUser } from "../../Functions/CheckUserSociety/checkUserSociety.js";
import mongoose from "mongoose";

const pendingUsers = async (req: Request, res: Response) => {
  try {
    const { society_code } = req?.params;

    const searchQuery = (req.query.search as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const searchFilter: any = {
      society_code,
    };

    if (searchQuery) {
      searchFilter["name"] = { $regex: searchQuery, $options: "i" };
    }

    const totalCount = await TempUser.countDocuments(searchFilter);

    if (totalCount === 0) {
      return res.status(200).json({
        msg: "No pending users found for the given society code.",
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0,
        },
      });
    }

    const pendingUsers = await TempUser.find(searchFilter)
      .populate("user_id", "name email mb_no") // only select needed fields
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      data: pendingUsers,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error listing pending registrations:", error);
    return res.status(500).json({
      errorMsg: "Failed to list pending registrations",
      error: error?.message,
    });
  }
};

const processAcceptUsers = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.body;

    const objectId = new mongoose.Types.ObjectId(id);

    // ✅ Find TempUser by its _id
    const tempUser = await TempUser.findById(objectId);
    if (!tempUser) {
      return res.status(404).json({
        errorMsg: "Registration request not found",
        status: false,
      });
    }

    // ✅ Get the user linked to this TempUser
    const user = await checkUser({ _id: tempUser.user_id });
    if (!user) {
      return res.status(404).json({
        errorMsg: "Associated user not found",
        status: false,
      });
    }

    await assignFlat(user, tempUser);

    user.isVerified = true;
    user.role = "user";

    const savedUser = await user.save();
    const token = generateToken(user);

    // ✅ Delete temp user after approval
    await TempUser.findByIdAndDelete(objectId);

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

const processRejectUsers = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.body;

    const objectId = new mongoose.Types.ObjectId(id);

    const tempUser = await TempUser.findById(objectId);
    if (!tempUser) {
      return res.status(404).json({
        errorMsg: "Registration request not found",
        status: false,
      });
    }

    await TempUser.findByIdAndDelete(objectId);

    return res.status(200).json({
      msg: "Registration request rejected successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error processing registration rejection:", error);
    return res.status(500).json({
      errorMsg: "Failed to process registration rejection",
      error: error.message,
    });
  }
};


export { pendingUsers, processAcceptUsers, processRejectUsers };
