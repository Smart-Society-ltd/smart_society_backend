import { Request, Response } from "express";
import { User } from "../../Schema/AuthModels/userModel.js";
import TempUser from "../../Schema/AuthModels/tempUserModel.js";
import { checkUser, checkSociety } from "../../Functions/CheckUserSociety/checkUserSociety.js";

interface UserRegisterRequestBody {
  name: string;
  mb_no: string;
  email: string;
  society_code?: string;
  flat_no?: string;
  floor_no?: string; 
  flat_type?: string;
}

const userRegister = async (
  req: Request<{}, {}, UserRegisterRequestBody>,
  res: Response
) => {
  try {
    const { name, mb_no, email, society_code, flat_no, floor_no, flat_type } = req.body;

    // Check required fields
    if (!name || !mb_no || !email) {
      return res.status(400).json({
        errorMsg: "Name, mobile number, and email are required",
        status: false,
      });
    }

    // First check if user already exists with this mobile number
    let user = await checkUser({ mb_no });
    let isNewUser = false;

    if (!user) {
      // Check if user exists with this email
      user = await checkUser({ email });
      
      if (user) {
        return res.status(409).json({
          errorMsg: "User with this email already registered",
          status: false,
        });
      }

      // Create new user if doesn't exist
      const newUser = new User({
        name,
        mb_no,
        email,
      });

      user = await newUser.save();
      isNewUser = true;
    } else if (user.email !== email) {
      // If user exists with this mobile but email doesn't match
      return res.status(409).json({
        errorMsg: "Mobile number already registered with a different email",
        status: false,
      });
    }

    // If society details are provided, process society assignment
    if (society_code) {
      // Check if all society-related fields are provided
      if (!flat_no || !floor_no || !flat_type) {
        return res.status(400).json({
          errorMsg: "All society details (society_code, flat_no, floor_no, flat_type) are required",
          status: false,
        });
      }

      // Check if society exists
      const society = await checkSociety({ society_code });
      
      if (!society) {
        return res.status(404).json({
          errorMsg: "Society not found with this code",
          status: false,
        });
      }

      // Get admin info
      const admin_id = society.admin_ids[0];
      const admin = await User.findOne({ _id: admin_id });

      if (!admin) {
        return res.status(404).json({
          errorMsg: "Society admin not found",
          status: false,
        });
      }

      // Create temp user entry for admin approval
      const newTempUser = new TempUser({
        user_id: user._id,
        user_name: user.name,
        society_code,
        flat_no,
        flat_type,
        floor_no,
      });

      await newTempUser.save();

      return res.status(200).json({
        msg: "User registered and society request sent to admin successfully",
        user,
        tempUserRequest: newTempUser,
        admin: {
          admin_name: admin.name,
          admin_mb_no: admin.mb_no,
          society_name: society.society_name,
        },
        status: true,
      });
    }

    // If no society details provided, just return the user registration info
    return res.status(200).json({
      msg: isNewUser ? "User registered successfully" : "User already exists",
      user,
      status: true,
    });
  } catch (error) {
    console.error("Error processing user registration:", error);
    return res
      .status(500)
      .json({ errorMsg: "Failed to process registration", error: error.message });
  }
};

export default userRegister;