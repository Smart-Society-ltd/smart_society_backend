import { Request, Response, NextFunction } from "express";
import { checkUser, checkSociety } from "../Functions/CheckUserSociety/checkUserSociety.js"

const validateUserAndSociety = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, society_code } = req.body;

    const user = await checkUser({ _id: id });
    if (!user) {
      return res.status(404).json({ errorMsg: "User does not exist", status: false });
    }

    const society = await checkSociety({ society_code });
    if (!society) {
      return res.status(404).json({ errorMsg: "Invalid Society Code", status: false });
    }

    req.validatedData = { user, society };
    next();
  } catch (error) {
    res.status(500).json({ errorMsg: "Internal Server Error", status: false });
  }
};

export default validateUserAndSociety;
