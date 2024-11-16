import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/AuthModels/userModel.js';
import asyncHandler from './../utils/asynchandler.js';
import ApiError from './../utils/api_error.js';

const authenticateToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      throw new ApiError('Auth Token Missing', 401);
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }
    req.user = user;

    next();
  }
);

export default authenticateToken;