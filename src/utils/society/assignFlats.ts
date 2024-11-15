import mongoose from "mongoose";
import Society from "../../models/AuthModels/societyModel.js";
import Flat from "../../models/AuthModels/flatsModel.js";
import TempUser from "../../models/AuthModels/tempUserModel.js";

const assignFlat = async (user: any) => {
  try {
    const society = await Society.findOne({ society_code: user.society_code });
    const tempUser = await TempUser.findOne({ user_id: user._id });

    if (!society) {
      throw new Error("Society not found");
    }

    if (society.remaining_flats <= 0) {
      throw new Error("No remaining flats available");
    }

    const existingFlat = await Flat.findOne({
      society_code: user.society_code,
      flat_no: user.flat_no,
    });

    if (existingFlat) {
      throw new Error("Flat already assigned");
    }

    const newFlat = new Flat({
      flat_no: user.flat_no,
      society_code: user.society_code,
      flat_type: tempUser.flat_type,
      floor_no: tempUser.floor_no,
      residents: [user.name],
    });

    society.remaining_flats -= 1;
    await society.save();

    const flat = await newFlat.save();

    user.flat = flat._id;

    await user.save();

    return true;
  } catch (error) {
    console.error("Error assigning flat:");
    throw new Error(error.message);
  }
};

export default assignFlat;
