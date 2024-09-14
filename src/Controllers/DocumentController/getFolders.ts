import { Request, Response } from "express";
import Folder from "../../Models/DocumentModel/folder.js";
import User from "../../Models/AuthModels/userModel.js";

const getFolders = async (req: Request, res: Response) => {
  try {
    const { society_code } = req.params;

    const loggedInUserId = req.user?._id;
    
    if (!loggedInUserId) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const folders = await Folder.find({ society_code }).select("folder_name");

    if (folders.length === 0) {
      return res.status(200).json({ msg: "No folders available" });
    }

    res.status(200).json({ msg: "Folders fetched successfully", folders });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ errorMsg: "Error fetching folders" });
  }
};

export default getFolders;
