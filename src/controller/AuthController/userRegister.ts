import { Request, Response } from 'express';
import User from '../../models/AuthModels/userModel.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';
import asyncHandler from './../../utils/asynchandler.js';

interface UserRegisterRequestBody {
  name: string;
  mb_no: string;
  email: string;
}

const userRegister = asyncHandler(
  async (req: Request<{}, {}, UserRegisterRequestBody>, res: Response) => {
    const { name, mb_no, email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError("User already exists", 409);
    }

    const newUser = new User({
      name,
      mb_no,
      email,
    });

    await newUser.save();

    res.status(200).json(new ApiResponse({ user: newUser }, 'User registered successfully'));
  }
)

export default userRegister;