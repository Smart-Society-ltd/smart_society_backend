import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import tempSociety from '../../Models/AuthModels/tempRegistrationModel.js';
import User from '../../Models/AuthModels/userModel.js';

interface RegisterRequestBody {
  name: string;
  mb_no: string;
  email: string;
  password: string;
  society_name: string;
  society_add: string;
  society_city: string;
  society_state: string;
  society_pincode: string;
}

const tempRegisterSociety = async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  try {
    const { name, mb_no, email, password, society_name, society_add, society_city, society_state, society_pincode } = req.body;

    const existingUser1 = await tempSociety.findOne({ email });
    const existingUser2 = await User.findOne({ email });
    
    if (existingUser1 || existingUser2) {
      return res.status(400).json({ msg: "User with this email already exists", status: false });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newRegistration = new tempSociety({
      name,
      mb_no,
      email,
      password: hashedPassword,
      society_name,
      society_add,
      society_city,
      society_state,
      society_pincode,
    });

    await newRegistration.save();

    return res.status(200).json({ msg: "Registration request submitted successfully", status: true, data: newRegistration });

  } catch (error) {
    console.error('Error submitting registration request:', error);
    return res.status(500).json({ msg: "Failed to submit registration request", error: error.message });
  }
};

export default tempRegisterSociety;
