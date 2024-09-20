import { Request, Response } from 'express';
import User from '../../Models/AuthModels/userModel.js';

interface UserRegisterRequestBody {
  name: string;    
  mb_no: string;    
  email: string;
}

const userRegister = async (req: Request<{}, {}, UserRegisterRequestBody>, res: Response) => {
  try {
    const { name, mb_no, email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ errorMsg: "User with this email already registered", status: false });
    }

    const newUser = new User({
      name,
      mb_no,
      email,
    });

    await newUser.save();

    return res.status(200).json({ User : newUser, status: true });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ errorMsg: "Failed to register user", error: error.message });
  }
};

export default userRegister;