import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/AuthModels/userModel.js";
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

interface getUserRequestBody {
  userId: string;
}

const getUser = async (
  req: Request<{}, {}, getUserRequestBody>,
  res: Response
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError("Token Missing", 401);
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  res.json(new ApiResponse({ user }, "User Data fetched"));
};

export default getUser;
