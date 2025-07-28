import { Request, Response } from "express";
import Complaint from "../../Schema/ComplaintModel/complaintModel.js";

const getResolvedComplaints = async (req: Request, res: Response) => {
  try {
    const { user } = req.validateUser;

    const complaints = await Complaint.find({
      society_code: user.society_code,
      isResolved: true,
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

export default getResolvedComplaints;
