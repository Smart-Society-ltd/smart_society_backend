import { Request, Response } from "express";
import User from "../../Models/AuthModels/userModel.js";
import Society from '../../Models/AuthModels/societyModel.js';
import Announcement from "../../Models/AnnonucementModel/announcemenetModel.js";

const raiseAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society.admin_ids.includes(user._id.toString())) {
      return res
        .status(403)
        .json({ errorMsg: "Only admin is allowed to raise announcement" });
    }

    let photoUrl = null;
    if (req.file) {
      const fileKey = req.file.key;
      const bucketName = req.file.bucket;
      
      photoUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
    }

    const newAnnouncement = new Announcement({
      title,
      content,
      raised_by : user.name,
      society_code: user.society_code,
      photo: photoUrl,
    });

    await newAnnouncement.save();

    res.status(201).json({
      msg: "Announcement raised successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error("Error raising announcement:", error);
    res.status(500).json({ errorMsg: "Error raising announcement" });
  }
};

export default raiseAnnouncement;
