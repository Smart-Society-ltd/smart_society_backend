import { Request, Response } from "express";
import User from "../../models/AuthModels/userModel.js";
import tempVisitor from "../../models/VisitorManagement/tempVisitorModel.js";
import Visitor from "../../models/VisitorManagement/visitorModel.js";

const pendingCheckin = async (req: Request, res: Response) => {
  try {
    const { flat_no } = req.params;
    const pendingCheckin = await tempVisitor
      .find({ flat_no })
      .sort({ createdAt: -1 });

    if (pendingCheckin.length === 0) {
      res.status(200).json({ msg: "No pending checkin request" });
    }

    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      res.status(404).json({ errorMsg: "User not found" });
    }

    if (user.flat_no != flat_no) {
      res.status(404).json({ errorMsg: "User belongs to another flat" });
    }

    res.status(200).json({ data: pendingCheckin });
  } catch (error) {
    console.error("Error listing pending checkin request:", error);
    res.status(500).json({
      errorMsg: "Failed to list checkin request",
      error: error.message,
    });
  }
};

const processCheckin: (req: Request<{ id: string }>, res: Response) => Promise<void> = async (req, res) => {
  try {
    const { id } = req.body;
    const checkinRequest = await tempVisitor.findOne({ _id: id });
    if (!checkinRequest) {
      res
        .status(404)
        .json({ errorMsg: "Checkin request not found", status: false });
    }

    const {
      society_code,
      visitor_name,
      visitor_contact_no,
      visiting_to,
      visit_purpose,
      flat_no,
      no_of_people,
      visitor_address,
      checkin_date,
      image_url,
      image_key,
    } = checkinRequest;

    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      res.status(404).json({ errorMsg: "User not found" });
    }

    const newCheckin = new Visitor({
      society_code,
      visitor_name,
      visitor_contact_no,
      visiting_to,
      visit_purpose,
      flat_no,
      no_of_people,
      visitor_address,
      checkin_date,
      image_url,
      image_key,
    });

    await newCheckin.save();

    await tempVisitor.findByIdAndDelete(id);

    res.status(200).json({
      msg: "Checkin request accepted successfully",
      newCheckin,
      status: true,
    });
  } catch (error) {
    console.error("Error processing checkin request:", error);
    res.status(500).json({
      errorMsg: "Failed to process checkin request",
      error: error.message,
    });
  }
};

export { pendingCheckin, processCheckin };
