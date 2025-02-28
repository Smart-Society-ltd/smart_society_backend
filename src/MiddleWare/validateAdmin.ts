import { checkUser } from "../Functions/CheckUserSociety/checkUserSociety.js";
import { User } from "../Schema/AuthModels/userModel.js";
import { Request, Response, NextFunction } from "express";

const validateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUserId = req.user._id;
    if (!loggedInUserId) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const user = await checkUser({ _id: loggedInUserId });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ errorMsg: "Access denied: Admins only" });
    }

    req.validatedAdmin = { user };
    next();
  } catch (error) {
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
};

export default validateAdmin;
