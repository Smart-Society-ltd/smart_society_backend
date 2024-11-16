import { Request, Response } from "express";
import User from "../../models/AuthModels/userModel.js";
import Society from "../../models/AuthModels/societyModel.js";
import Complaint from "../../models/ComplaintModel/complaintModel.js";
import { s3 } from "../../middleware/s3ForDocument.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

const deleteComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!id) {
      throw new ApiError("Complaint ID is required", 401);
    }

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const society = await Society.findOne({ society_code: user.society_code });

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      throw new ApiError("Complaint not found", 404);
    }

    if (complaint.raised_by != user.name) {
      throw new ApiError("Only person who raised the complaint can delete complaint", 403);
    }

    if (complaint.photo) {
      const photoUrl = complaint.photo;
      const photoKey = photoUrl.split("/").slice(-2).join("/");

      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: "complaintphoto",
            Key: photoKey,
          })
        );
      } catch (err) {
        console.error("Error deleting file from S3:", err);
        throw new ApiError("Error deleting file from S3", 500);
      }
    }

    await Complaint.findByIdAndDelete(id);

    res.status(200).json(new ApiResponse({}, "Complaint deleted successfully"));
  }
);

export default deleteComplaint;
