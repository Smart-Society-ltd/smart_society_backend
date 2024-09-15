import Society from "../../Models/AuthModels/societyModel.js";
import Flat from "../../Models/AuthModels/flatsModel.js";

const assignFlat = async (user: any, flat_type: string, floor_no: string) => {
  try {
    const society = await Society.findOne({ society_code: user.society_code });

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
      flat_type: flat_type,
      floor_no: floor_no,
      residents: [user.name],
    });
    
    society.remaining_flats -= 1;
    await society.save();

    await newFlat.save();

    return newFlat._id;
  } catch (error) {
    console.error("Error assigning flat:");
    throw new Error(error.message);
  }
};

export default assignFlat;
