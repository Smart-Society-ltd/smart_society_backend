import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../Models/AuthModels/userModel.js";

interface getUserRequestBody {
  userId: string;
}

const getUser = async (
  req: Request<{}, {}, getUserRequestBody>,
  res: Response
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(500).json({ errorMsg: "Server error" });
  }
};

export default getUser;
