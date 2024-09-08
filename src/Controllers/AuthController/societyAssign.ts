import { Request, Response } from 'express';
import TempUser from '../../Models/AuthModels/tempUserModel.js';
import User from '../../Models/AuthModels/userModel.js';
import Society from '../../Models/AuthModels/societyModel.js';

interface SocietyAssignRequestBody {
  userId: string;    
  society_code: string;    
  flat_no: string;
}

const assignSociety = async (req: Request<{}, {}, SocietyAssignRequestBody>, res: Response) => {
  try {
    const { id, society_code, flat_no } = req.body;

    const user = await TempUser.findOne({_id : id});

    if (!user) {
      return res.status(404).json({ errorMsg: "User does not exist", status: false });
    }

    const society = await Society.findOne({ society_code });

    if (!society) {
      return res.status(404).json({ errorMsg: "Invalid Society Code" });
    }

    const admin_id = society.admin_ids[0];
    const admin = await User.findOne({_id : admin_id});

    user.society_code = society_code;
    user.flat_no = flat_no;
    await user.save();

    return res.status(200).json({ msg: "Request sent to admin successfully", data : {
      admin_name: admin.name,
      admin_mb_no : admin.mb_no,
      society_name : society.society_name,
    }, status: true });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ errorMsg: "Failed to register user", error: error.message });
  }
};

export default assignSociety;