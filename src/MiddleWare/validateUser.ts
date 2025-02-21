import { Request, Response, NextFunction } from "express";
import { checkUser } from "../Functions/CheckUserSociety/checkUserSociety.js";

const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const user = await checkUser({ _id: loggedInUserId });

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    req.validatedUser = { user };
    next();
  } catch (error) {
    res.status(500).json({ errorMsg: "Internal Server Error", status: false });
  }
};

export default validateUser;
