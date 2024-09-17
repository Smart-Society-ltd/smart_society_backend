import { Request, Response } from "express";
import User from "../../Models/AuthModels/userModel.js";
import Society from '../../Models/AuthModels/societyModel.js';
import Complaint from "../../Models/ComplaintModel/complaintModel.js";

const raiseComplaint = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if(!society){
        return res.status(404).json({ errorMsg: "Society not found" });
    }

    let photoUrl = null;
    if (req.file) {
      const fileKey = req.file.key;
      const bucketName = req.file.bucket;
      
      photoUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
    }

    const newComplaint = new Complaint({
      title,
      content,
      raised_by : user.name,
      society_code: user.society_code,
      photo: photoUrl,
    });

    await newComplaint.save();

    res.status(201).json({
      msg: "Complaint raised successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error("Error raising complaint:", error);
    res.status(500).json({ errorMsg: "Error raising complaint" });
  }
};

export default raiseComplaint;
