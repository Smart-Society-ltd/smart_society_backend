import { Request, Response } from "express";
import User from "../../Models/AuthModels/userModel.js";
import Society from "../../Models/AuthModels/societyModel.js";

const updateSociety = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id.toString();
    
    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser || loggedInUser.role != 'admin') {
      return res.status(403).json({ errorMsg: "Unauthorized: Only Admin can update Society Details" });
    }

    const society = await Society.findOne({society_code : req.body.society_code});

    if (!society) {
      return res.status(404).json({ errorMsg: "Society not found" });
    }

    Object.assign(society, req.body.updateFields);
    await society.save();

    res.status(200).json({ msg: "Society details updated successfully", data: society });
  } catch (error) {
    console.error("Error updating society:", error);
    res.status(500).json({ errorMsg: "Server error" });
  }
};

export default updateSociety;
