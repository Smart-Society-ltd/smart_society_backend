import mongoose from "mongoose";
import { Society } from "../../Models/AuthModels/societyModel.js";
import Flat from "../../Models/AuthModels/flatsModel.js";
import TempUser from "../../Models/AuthModels/tempUserModel.js";

const assignFlat = async (user, tempUser) => {
  try {
    const society = await Society.findOne({ society_code: tempUser.society_code });

    console.log("user", user);
    console.log("society", society);
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
      flat_no: tempUser.flat_no,
      society_code: tempUser.society_code,
      flat_type : tempUser.flat_type,
      floor_no : tempUser.floor_no,
      residents: [user.name],
    });

    const savedFlat = await newFlat.save();

    // Update society remaining flats
    society.remaining_flats -= 1;
    await society.save();

    // Assign flat reference to user
    user.society_code = society.society_code;
    user.flat = savedFlat;

    await user.save();

    return true;
  } catch (error) {
    console.error("Error assigning flat:");
    throw new Error(error.message);
  }
};

export default assignFlat;
