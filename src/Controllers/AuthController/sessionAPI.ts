import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, UserInterface } from "../../Schema/AuthModels/userModel.js";
import {
  Society,
  SocietyInterface,
} from "../../Schema/AuthModels/societyModel.js";
import Flat from "../../Schema/AuthModels/flatsModel.js";

interface JwtPayload {
  userId: string;
}

const getUserSession = async (req: Request, res: Response) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        errorMsg: "Authentication token is required",
        status: false,
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    let decodedToken: JwtPayload;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
      console.log("Decoded token:", decodedToken); // Debug log
    } catch (error) {
      return res.status(401).json({
        errorMsg: "Invalid or expired token",
        status: false,
      });
    }

    // Find user by ID from token
    const user = await User.findById(decodedToken.userId).select(
      "-verifyToken -verifyTokenExpiry -forgetPasswordToken -forgetPasswordTokenExpiry"
    );

    if (!user) {
      return res.status(404).json({
        errorMsg: "User not found",
        status: false,
      });
    }

    // Initialize response data
    const responseData: {
      user: UserInterface;
      society?: SocietyInterface;
      flat?: any;
    } = {
      user,
    };

    // If user has society_code, get society details
    if (user.society_code) {
      const society = await Society.findOne({
        society_code: user.society_code,
      });

      if (society) {
        responseData.society = society;
      }
    }

    // If user has flat reference, get flat details
    if (user.flat) {
      const flat = await Flat.findById(user.flat);

      if (flat) {
        responseData.flat = flat;
      }
    }
    // If no direct flat reference but has society_code and flat_no, try to find flat
    else if (user.society_code && user.flat_no) {
      const flat = await Flat.findOne({
        society_code: user.society_code,
        flat_no: user.flat_no,
      });

      if (flat) {
        responseData.flat = flat;
      }
    }

    return res.status(200).json({
      msg: "Session data retrieved successfully",
      status: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error getting user session data:", error);
    return res.status(500).json({
      errorMsg: "Failed to retrieve session data",
      error: error.message,
      status: false,
    });
  }
};

export default getUserSession;
