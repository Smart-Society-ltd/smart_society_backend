import {Society} from "../../Schema/AuthModels/societyModel.js";
import { Request, Response } from "express";

const getAllSocieties = async (req: Request, res: Response) => {
  try {
    const societies = await Society.find();
    res.status(200).json({ msg: "Societies fetched successfully", societies });
  } catch (error) {
    console.error("Error fetching societies:", error);
    res.status(500).json({ errorMsg: "Error fetching societies" });
  }
};

export default getAllSocieties;
