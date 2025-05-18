import { Request, Response } from "express";
import { User } from "../../Schema/AuthModels/userModel.js";
import tempSociety from "../../Schema/AuthModels/tempRegistrationModel.js";
import { checkUser } from "../../Functions/CheckUserSociety/checkUserSociety.js";
import generateToken from "../../Functions/JWT/generateToken.js";

// Combined interface for society registration
interface RegisterSocietyRequestBody {
  // User registration fields
  name: string;
  mb_no: string;
  email: string;

  // Society-specific fields
  isSocietyAdded: boolean;
  society_name?: string;
  society_add?: string;
  society_city?: string;
  society_state?: string;
  society_pincode?: string;
}

const registerSociety = async (
  req: Request<{}, {}, RegisterSocietyRequestBody>,
  res: Response
) => {
  try {
    const {
      name,
      mb_no,
      email,
      society_name,
      society_add,
      society_city,
      society_state,
      society_pincode,
    } = req.body;

    // Check required fields
    if (!name || !mb_no || !email) {
      return res.status(400).json({
        errorMsg: "Name, mobile number, and email are required",
        status: false,
      });
    }

    // Check society fields if provided
    if (
      society_name ||
      society_add ||
      society_city ||
      society_state ||
      society_pincode
    ) {
      if (
        !society_name ||
        !society_add ||
        !society_city ||
        !society_state ||
        !society_pincode
      ) {
        return res.status(400).json({
          errorMsg:
            "All society details (name, address, city, state, pincode) are required",
          status: false,
        });
      }
    }

    // First check if user already exists with this mobile number
    let user = await checkUser({ mb_no });

    // Create or update user
    if (!user) {
      // Check if user exists with this email
      const emailUser = await checkUser({ email });

      if (emailUser) {
        return res.status(409).json({
          errorMsg: "User with this email already registered",
          status: false,
        });
      }

      // Create a new user
      const newUser = new User({
        name,
        mb_no,
        email,
        isSocietyAdded: true,
      });

      user = await newUser.save();
      // isNewUser = true;
    }
    // else if (user.email !== email) {
    //   // If user exists with this mobile but email doesn't match
    //   return res.status(409).json({
    //     errorMsg: "Mobile number already registered with a different email",
    //     status: false,
    //   });
    // }
    else {
      // Update existing user if needed
      if (user.name !== name) {
        user.name = name;
        await user.save();
      }
      if (user.email !== email) {
        user.email = email;
        await user.save();
      }
    }

    // Generate token for authentication
    const token = generateToken(user);

    // If society details are provided, create society registration
    if (
      society_name &&
      society_add &&
      society_city &&
      society_state &&
      society_pincode
    ) {
      // Create temporary society registration
      const newTempRegistration = new tempSociety({
        user_id: user._id,
        society_name,
        society_add,
        society_city,
        society_state,
        society_pincode,
      });

      const savedRegistration = await newTempRegistration.save();

      const userSection = {
        name: user.name,
        email: user.email,
        mb_no: user.mb_no,
        isSocietyAdded: true,
      };

      const societySection = {
        society_name: savedRegistration.society_name,
        society_add: savedRegistration.society_add,
        society_city: savedRegistration.society_city,
        society_state: savedRegistration.society_state,
        society_pincode: savedRegistration.society_pincode,
      };

      return res.status(200).json({
        msg: "Society registration request submitted successfully",
        status: true,
        data: {
          user: userSection,
          society: societySection,
        },
        token,
      });
    } else {
      // If no society details, just return the user info with token
      return res.status(200).json({
        msg: "Society registered successfully",
        status: true,
        user,
        token,
      });
    }
  } catch (error) {
    console.error("Error processing registration:", error);
    return res.status(500).json({
      errorMsg: "Failed to process registration",
      error: error.message,
    });
  }
};

export default registerSociety;