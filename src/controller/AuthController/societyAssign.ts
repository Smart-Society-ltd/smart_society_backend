import { Request, Response } from "express";
import TempUser from "../../models/AuthModels/tempUserModel.js";
import User from "../../models/AuthModels/userModel.js";
import Society from "../../models/AuthModels/societyModel.js";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

interface SocietyAssignRequestBody {
  userId: string;
  society_code: string;
  flat_no: string;
  floor_no: string;
  flat_type: string;
  id: string;
}

const assignSociety = asyncHandler(
  async (
    req: Request<{}, {}, SocietyAssignRequestBody>,
    res: Response
  ) => {
    const { id, society_code, flat_no, floor_no, flat_type } = req.body;

    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const society = await Society.findOne({ society_code });

    if (!society) {
      throw new ApiError("Invalid Society code ", 404);
    }

    const admin_id = society.admin_ids[0];
    const admin = await User.findOne({ _id: admin_id });

    user.society_code = society_code;
    user.flat_no = flat_no;

    const newTempUser = new TempUser({
      user_id: id,
      flat_type,
      floor_no,
    });

    await newTempUser.save();

    user.tempUserId = newTempUser._id;

    await user.save();

    res.status(200).json(new ApiResponse({
      admin_name: admin.name,
      admin_mb_no: admin.mb_no,
      society_name: society.society_name,
    }, "User assigned to society"));
  });

export default assignSociety;
