import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Society from "../../Models/AuthModels/societyModel.js";
import User from '../../Models/AuthModels/userModel.js'

interface getSocietyRequestBody {
  userId: string;
}
                                 
const getSociety = async (
  req: Request<{}, {}, getSocietyRequestBody>,
  res: Response
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ errorMsg: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ errorMsg: "User not found" });
    }

    const society = await Society.findOne({society_code : user.society_code});

    if (!user) {
        return res.status(404).json({ errorMsg: "Society not found" });
      }

      res.json(society);
  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(500).json({ errorMsg: "Server error" });
  }
};

export default getSociety;
