import { Request, Response } from "express";
import Folder from "../../Schema/DocumentModel/folder.js";
import { User } from "../../Schema/AuthModels/userModel.js";

const getFolders = async (req: Request, res: Response) => {
  try {
    const { user } = req.validatedUser;

    const society_code = user.society_code;

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
