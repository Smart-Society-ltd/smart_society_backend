import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import TempUser from '../../Models/AuthModels/tempUserModel.js';
import User from '../../Models/AuthModels/userModel.js';
import Society from '../../Models/AuthModels/societyModel.js';
import { error } from 'console';

interface UserRegisterRequestBody {
  username: string;
  name: string;    
  mb_no: string;    
  email: string;    
  password: string;    
  society_code: string;    
  flat_no: string;
  flat_type: string;
  floor_no: string;
  family_members_count: string;
}

const userRegister = async (req: Request<{}, {}, UserRegisterRequestBody>, res: Response) => {
  try {
    const { name, mb_no, email, password, society_code, flat_no } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already registered", status: false });
    }

    const society = await Society.findOne({ society_code });

    if (!society) {
      return res.status(404).json({ error: "Invalid Society Code" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new TempUser({
      name,
      mb_no,
      email,
      password: hashedPassword,
      society_code,
      role: "user",
      flat_no,
    });

    await newUser.save();

    return res.status(200).json({ msg: "Request sent to admin successfully", status: true });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ msg: "Failed to register user", error: error.message });
  }
};

export default userRegister;