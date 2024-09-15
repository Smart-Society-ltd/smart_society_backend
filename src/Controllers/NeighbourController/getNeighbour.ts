import { Request, Response } from "express";
import User from "../../Models/AuthModels/userModel.js";
import Flat from "../../Models/AuthModels/flatsModel.js"

const getNeighbour = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const neighbours = await User.find({ society_code: user.society_code })
      .populate('flat');

    res.json(neighbours);
  } catch (error) {
    console.error("Error fetching neighbours:", error);
    res.status(500).json({ errorMsg: "Error fetching neighbours" });
  }
};

export default getNeighbour;
