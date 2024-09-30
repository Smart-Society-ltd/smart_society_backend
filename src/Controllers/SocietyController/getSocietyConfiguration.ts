import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Society from "../../Models/AuthModels/societyModel.js";
import User from '../../Models/AuthModels/userModel.js'
import Maintenance from "../../Models/MaintenanceModel/societyMaintenance.js";

interface getSocietyRequestBody {
  userId: string;
}

const getSocietyConfiguration = async (
  req: Request<{}, {}, getSocietyRequestBody>,
  res: Response
) => {
  try {
    const loggedInUserId = req.user?._id;

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(401).json({ errorMsg: "Unauthorized user" });
    }

    // if(user.role != 'admin'){
    //     return res.status(404).json({ errorMsg: "Only Admin can delete the files" });
    // }

     const society = await Society.findOne({society_code : user.society_code});

     const societyMaintenance = await Maintenance.findOne({society_code : user.society_code});

     const societyData = {
        total_flats : society.total_flats,
        remaining_flats : society.remaining_flats,
        maintenance_period : societyMaintenance.maintenance_period,
        maintenance_basis : societyMaintenance.maintenance_basis,
        custom_maintenance_values : societyMaintenance.custom_maintenance_values,
     }

     res.status(200).json({ msg: "Data fetched successfully" , data : societyData});

  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(500).json({ errorMsg: "Server error" });
  }
};

export default getSocietyConfiguration;
