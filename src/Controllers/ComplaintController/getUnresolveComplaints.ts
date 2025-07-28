import { Request, Response } from "express";
import { Society } from "../../Schema/AuthModels/societyModel.js";
import Complaint from "../../Schema/ComplaintModel/complaintModel.js";

const getUnresolvedComplaints = async (req: Request, res: Response) => {
  try {
    const {user} = req.validateUser;

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
