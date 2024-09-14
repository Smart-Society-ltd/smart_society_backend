import { Request, Response } from "express";
import Folder from "../../Models/DocumentModel/folder.js";
import Society from "../../Models/AuthModels/societyModel.js";
import User from "../../Models/AuthModels/userModel.js";

const FolderCreation = async (req: Request, res: Response) => {
  try {
    const { folder_name } = req.body;

    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const society = await Society.findOne({ society_code: user.society_code });

    if (!society.admin_ids.includes(user._id.toString())) {
      return res
        .status(404)
        .json({ errorMsg: "Only admin is allow to create folder" });
    }

    const folderNameCheck = await Folder.findOne({
      society_code: user.society_code,
      folder_name,
    });

    if (!user) {
      return res.status(404).json({ errorMsg: "User not found" });
    }

    if (folderNameCheck)
      res
        .status(404)
        .json({ errorMsg: "Folder with this name aldready exist" });

    const newFolder = new Folder({
      folder_name,
      society_code: user.society_code,
      created_by: user._id,
    });

    await newFolder.save();

    res
      .status(200)
      .json({ msg: "Folder created successfully", folder: newFolder });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ errorMsg: "Error creating folder" });
  }
};

export default FolderCreation;
