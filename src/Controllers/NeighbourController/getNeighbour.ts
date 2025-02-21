import { Request, Response } from "express";
import { User } from "../../Models/AuthModels/userModel.js";
import Flat from "../../Models/AuthModels/flatsModel.js";

const getNeighbour = async (req: Request, res: Response) => {
  try {
    const { user } = req.validatedUser;

    const neighbours = await User.find({
      society_code: user.society_code,
    }).populate("flat");

    res.json(neighbours);
  } catch (error) {
    console.error("Error fetching neighbours:", error);
    res.status(500).json({ errorMsg: "Error fetching neighbours" });
  }
};

export default getNeighbour;
