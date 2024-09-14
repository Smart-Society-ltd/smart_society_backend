import { Request, Response } from "express";
import Folder from "../../Models/DocumentModel/folder.js";
import User from "../../Models/AuthModels/userModel.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  },
});

const deleteFile = async (req: Request, res: Response) => {
  try {
    const { society_code, folder_name, fileName } = req.body;
    const loggedInUserId = req.user?._id;

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    if(user.society_code != society_code){
        return res.status(404).json({ errorMsg: "User is from another society" });
    }

    if(user.role != 'admin'){
        return res.status(404).json({ errorMsg: "Only Admin can delete the files" });
    }

    const folder = await Folder.findOne({ society_code, folder_name });

    if (!folder) {
      return res.status(404).json({ errorMsg: "Folder not found" });
    }

    const fileIndex = folder.files.findIndex(file => file.fileName === fileName);

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
    res.status(500).json({ errorMsg: "Failed to delete file", error: error.message });
  }
};

export default deleteFile;
