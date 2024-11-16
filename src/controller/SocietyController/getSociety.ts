import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Society from "../../models/AuthModels/societyModel.js";
import User from '../../models/AuthModels/userModel.js'
import ApiError from './../../utils/api_error.js';
import asyncHandler from './../../utils/asynchandler.js';
import ApiResponse from './../../utils/api_success.js';

interface getSocietyRequestBody {
  userId: string;
}

const getSociety = asyncHandler(
  async (
    req: Request<{}, {}, getSocietyRequestBody>,
    res: Response
  ) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError("Unauthorized user", 401);
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society) {
      throw new ApiError("Society not found", 404);
    }

    res.json(new ApiResponse({ society }, "Society found"));
  }
);

export default getSociety;
