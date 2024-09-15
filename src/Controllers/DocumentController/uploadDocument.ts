import { Request, Response } from "express";
import Folder from "../../Models/DocumentModel/folder.js"; 
import User from '../../Models/AuthModels/userModel.js';
import Society from '../../Models/AuthModels/societyModel.js';

interface DocumentRequestBody {
  society_code: string;
  folder_name: string;
}

const uploadDocument = async (
  req: Request<{}, {}, DocumentRequestBody>,
  res: Response
) => {
  try {
    const file = req.file;

    const {
      folder_name
    } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society.admin_ids.includes(user._id.toString())) {
      return res
        .status(404)
        .json({ errorMsg: "Only admin is allow to upload file" });
    }

    if (!file) {
      return res.status(404).json({ errorMsg: "No file uploaded" });
    }

    const society_code = user.society_code;

    const folder = await Folder.findOne({ 
      society_code, 
      folder_name 
    });

    if (!folder) {
      return res.status(404).json({ errorMsg: "Folder not found" });
    }

    folder.files.push({
      fileName: file.originalname,
      filePath: file.location,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadDate: new Date(),
    });

    await folder.save();

    res.status(200).json({ msg: "File uploaded successfully", data: folder });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      errorMsg: "Failed to upload file",
      error: error.message,
    });
  }
};

export default uploadDocument;