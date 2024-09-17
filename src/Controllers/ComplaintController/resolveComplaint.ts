import { Request, Response } from "express";
import User from "../../Models/AuthModels/userModel.js";
import Society from "../../Models/AuthModels/societyModel.js";
import Complaint from "../../Models/ComplaintModel/complaintModel.js";

const resolveComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society) {
      return res.status(404).json({ errorMsg: "Society not found" });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ errorMsg: "Complaint not found" });
    }

    if (complaint.raised_by != user.name) {
      return res
        .status(404)
        .json({
          errorMsg: "Only person who raised the complaint can resolve complaint",
        });
    }

    complaint.isResolved = true;
    complaint.save();

    res.status(200).json({
      msg: "Complaint resolved successfully",
    });
  } catch (error) {
    console.error("Error resolving complaint:", error);
    res.status(500).json({ errorMsg: "Error resolving complaint" });
  }
};

export default resolveComplaint;
