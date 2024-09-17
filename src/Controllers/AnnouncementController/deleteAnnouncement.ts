import { Request, Response } from "express";
import User from "../../Models/AuthModels/userModel.js";
import Society from "../../Models/AuthModels/societyModel.js";
import Announcement from "../../Models/AnnonucementModel/announcemenetModel.js";
import { s3 } from "../../MiddleWare/s3ForDocument.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ errorMsg: "Announcement ID is required" });
    }

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society || !society.admin_ids.includes(user._id.toString())) {
      return res
        .status(403)
        .json({ errorMsg: "Only admin is allowed to delete announcement" });
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ errorMsg: "Announcement not found" });
    }

    if (announcement.photo) {
      // Extract the key from the photo URL
      const photoUrl = announcement.photo;
      const photoKey = photoUrl.split("/").slice(-2).join("/");

      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: "announcementphoto",
            Key: photoKey,
          })
        );
        console.log(`Successfully deleted ${photoKey} from S3.`);
      } catch (err) {
        console.error("Error deleting file from S3:", err);
        return res
          .status(500)
          .json({ errorMsg: "Error deleting file from S3" });
      }
    }

    await Announcement.findByIdAndDelete(id);

    res.status(200).json({
      msg: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ errorMsg: "Error deleting announcement" });
  }
};

export default deleteAnnouncement;
