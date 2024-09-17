import { Request, Response } from "express";
import User from "../../Models/AuthModels/userModel.js";
import Society from "../../Models/AuthModels/societyModel.js";
import Announcement from "../../Models/AnnonucementModel/announcemenetModel.js";

const getAnnouncement = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    const announcements = await Announcement.find({
      society_code: user.society_code,
    }).sort({ createdAt: -1 });

    if (announcements.length === 0) {
      return res.status(200).json({
        msg: "No announcements found",
        announcements: [],
      });
    }

    res.status(200).json({
      msg: "Announcements fetched successfully",
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ errorMsg: "Error fetching announcements" });
  }
};

export default getAnnouncement;
