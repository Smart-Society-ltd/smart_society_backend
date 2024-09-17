import { Request, Response } from "express";
import User from "../../Models/AuthModels/userModel.js";
import Society from "../../Models/AuthModels/societyModel.js";
import Complaint from "../../Models/ComplaintModel/complaintModel.js";
import { s3 } from "../../MiddleWare/s3ForDocument.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const deleteComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ errorMsg: "Complaint ID is required" });
    }

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    const complaint = await Complaint.findById(id);

    if (!complaint) {
        return res.status(404).json({ errorMsg: "Complaints not found" });
      }

    if (complaint.raised_by != user.name) {
      return res
        .status(404)
        .json({ errorMsg: "Only person who raised the complaint can delete complaint" });
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
        return res
          .status(500)
          .json({ errorMsg: "Error deleting file from S3" });
      }
    }

    await Complaint.findByIdAndDelete(id);

    res.status(200).json({
      msg: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ errorMsg: "Error deleting complaint" });
  }
};

export default deleteComplaint;
