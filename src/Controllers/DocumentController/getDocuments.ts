import { Request, Response } from "express";
import Folder from "../../Models/DocumentModel/folder.js";
import User from "../../Models/AuthModels/userModel.js";

const getDocuments = async (req: Request, res: Response) => {
  try {
    const { society_code, folder_name } = req.body;

    // Assuming req.user is populated with user info after authentication
    const loggedInUserId = req.user?._id;
    
    if (!loggedInUserId) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    // Fetch the folder with society_code and folder_name
    const documents = await Folder.findOne({ society_code, folder_name });

    // Check if documents exist
    if (!documents) {
      return res.status(404).json({ errorMsg: "Folder does not exist" });
    }

    // Send response with documents
    res.status(200).json({ msg: "Documents fetched successfully", documents });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ errorMsg: "Error fetching documents" });
  }
};

export default getDocuments;
