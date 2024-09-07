import { Request, Response } from "express";
import pricing from "../../JSONFiles/societyPricing.js";

const societyPricing = async (req: Request, res: Response) => {
  try {
    res.json(pricing);
  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(500).json({ errorMsg: "Server error" });
  }
};

export default societyPricing;
