import { Request, Response } from "express";
import Folder from "../../Models/DocumentModel/folder.js";
import { User } from "../../Models/AuthModels/userModel.js";

const getDocuments = async (req: Request, res: Response) => {
  try {
    const { folder_name } = req.body;
    const { user } = req.validatedUser;

    const society_code = user.society_code;
    const documents = await Folder.findOne({ society_code, folder_name });

    if (!documents) {
      return res.status(404).json({ errorMsg: "Folder does not exist" });
    }

    res.status(200).json({ msg: "Documents fetched successfully", documents });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ errorMsg: "Error fetching documents" });
  }
};

export default getDocuments;
