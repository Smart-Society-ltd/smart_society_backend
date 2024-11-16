import { Request, Response } from "express";
import pricing from "../../data/societyPricing.js";
import ApiResponse from './../../utils/api_success.js';
import asyncHandler from './../../utils/asynchandler.js';

const societyPricing = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json(new ApiResponse({ pricing }, "Society pricing found"));
  }
);

export default societyPricing;
