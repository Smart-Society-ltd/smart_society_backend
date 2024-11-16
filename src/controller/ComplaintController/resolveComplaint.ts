import { Request, Response } from "express";
import User from "../../models/AuthModels/userModel.js";
import Society from "../../models/AuthModels/societyModel.js";
import Complaint from "../../models/ComplaintModel/complaintModel.js";
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

const resolveComplaint = async (req: Request, res: Response) => {
  const { id } = req.body;

  const loggedInUserId = req.user._id;
  const user = await User.findById(loggedInUserId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const society = await Society.findOne({ society_code: user.society_code });

  if (!society) {
    throw new ApiError("Invalid Society code ", 404);
  }

  const complaint = await Complaint.findById(id);

  if (!complaint) {
    throw new ApiError("Complaint not found", 404);
  }

  if (complaint.raised_by != user.name) {
    throw new ApiError("You are not authorized to resolve this complaint", 401);
  }

  complaint.isResolved = true;
  complaint.save();

  res.status(200).json(new ApiResponse({}, "Complaint resolved successfully"));
};

export default resolveComplaint;
