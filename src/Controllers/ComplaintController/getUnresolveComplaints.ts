import { Request, Response } from "express";
import User from "../../Models/AuthModels/userModel.js";
import Society from "../../Models/AuthModels/societyModel.js";
import Complaint from "../../Models/ComplaintModel/complaintModel.js";

const getUnresolvedComplaints = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    const complaints = await Complaint.find({
      society_code: user.society_code,
      isResolved: false,
    }).sort({ createdAt: -1 });

    if (complaints.length === 0) {
      return res.status(200).json({
        msg: "No complaints found",
        complaints: [],
      });
    }

    res.status(200).json({
      msg: "Complaints fetched successfully",
      complaints,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ errorMsg: "Error fetching complaints" });
  }
};

export default getUnresolvedComplaints;
