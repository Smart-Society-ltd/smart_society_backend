import { Request, Response } from 'express';
import User from '../../Models/AuthModels/userModel.js';

interface UserLoginRequestBody {
  mb_no: string;
}

const userLogin = async (req: Request<{}, {}, UserLoginRequestBody>, res: Response) => {
  try {
    const { mb_no } = req.body;

    const user = await User.findOne({ mb_no });

    if (!user) {
      return res.status(400).json({ msg: "User with this number does not exist", status: false });
    }

    return res.status(200).json({
      msg: "Login successful",
      status: true,
      user
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ msg: "Failed to login user", error: error.message });
  }
};

export default userLogin;
