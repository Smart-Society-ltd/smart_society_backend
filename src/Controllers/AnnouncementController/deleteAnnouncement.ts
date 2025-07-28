import { Request, Response } from "express";
import { User } from "../../Schema/AuthModels/userModel.js";
import { Society } from "../../Schema/AuthModels/societyModel.js";
import Announcement from "../../Schema/AnnonucementModel/announcemenetModel.js";
import { s3 } from "../../Config/s3.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ errorMsg: "Announcement ID is required" });
    }

    const { user } = req.validateAdmin;

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