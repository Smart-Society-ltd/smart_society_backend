import { Request, Response } from "express";
import Folder from "../../Models/DocumentModel/folder.js"; 

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
      society_code,
      folder_name
    } = req.body;

    if (!file) {
      return res.status(404).json({ errorMsg: "No file uploaded" });
    }

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