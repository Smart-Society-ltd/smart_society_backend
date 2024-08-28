import { Request, Response } from 'express';
import generateToken from '../../Functions/JWT/generateToken.js';
import User from '../../Models/AuthModels/userModel.js'; 
import TempUser from '../../Models/AuthModels/tempUserModel.js';

const pendingUsers = async (req: Request, res: Response) => {
  try {
    const {society_code} = req.params;
    const pendingUsers = await TempUser.find({society_code});

    if(pendingUsers.length === 0){
      return res.status(200).json({ msg: "No pending users found for the given society code." });
    }
    return res.status(200).json({ data: pendingUsers });
  } catch (error) {
    console.error('Error listing pending registrations:', error);
    return res.status(500).json({ msg: "Failed to list pending registrations", error: error.message });
  }
};

const processUsers = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.body;
    const tempUsers = await TempUser.findOne({ _id: id });
    if (!tempUsers) {
      return res.status(409).json({ msg: "Registration request not found", status: false });
    }

    const {name, mb_no, email, society_code, flat_no} = tempUsers;

    const newUser = new User({
      username: `user_${Math.random().toString(36).substr(2, 8)}`,
      name,
      mb_no,
      email,
      society_code,
      role: "user",
      isVerified: true,
      flat_no,
    });

    const savedUser = await newUser.save();
    const token = generateToken(newUser);

    await TempUser.findByIdAndDelete(id);

    return res.status(200).json({ msg: "User registered successfully", newUser: savedUser, status1: true, token });

  } catch (error) {
    console.error('Error processing registration:', error);
    return res.status(500).json({ msg: "Failed to process registration", error: error.message });
  }
};

export {pendingUsers, processUsers};