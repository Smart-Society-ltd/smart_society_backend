import { Request, Response } from "express";
import Folder from "../../Schema/DocumentModel/folder.js";
import { User } from "../../Schema/AuthModels/userModel.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../Config/s3.js";

const deleteFile = async (req: Request, res: Response) => {
  try {
    const { folder_name, fileName } = req.body;
    const { user } = req.validatedAdmin;

    const society_code = user.society_code;

    const folder = await Folder.findOne({ society_code, folder_name });

    if (!folder) {
      return res.status(404).json({ errorMsg: "Folder not found" });
    }

    const fileIndex = folder.files.findIndex(
      (file) => file.fileName === fileName
    );

    if (fileIndex === -1) {
      return res.status(404).json({ errorMsg: "File not found" });
    }

    const fileToDelete = folder.files[fileIndex];

    folder.files.splice(fileIndex, 1);

    await folder.save();

    const fileKey = `${society_code}/${folder_name}/${fileToDelete.fileName}`;

    const params = {
      Bucket: "ssdocument",
      Key: fileKey,
    };

    const command = new DeleteObjectCommand(params);

    await s3.send(command);

    res.status(200).json({ msg: "File deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ errorMsg: "Failed to delete file", error: error.message });
  }
};

export default deleteFile;
