import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/AuthModels/userModel.js";

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
      res.status(401).json({ errorMsg: "Authentication token missing" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ errorMsg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(500).json({ errorMsg: "Server error" });
  }
};

export default getUser;
