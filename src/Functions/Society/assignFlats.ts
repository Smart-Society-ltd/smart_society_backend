import Society from "../../Models/AuthModels/societyModel.js";
import Flat from "../../Models/AuthModels/flats.js";

const assignFlat = async (user: any) => {
  try {
    const society = await Society.findOne({ society_code: user.society_code });

    if (!society) {
      throw new Error("Society not found");
    }

    if (society.remaining_flats <= 0) {
      throw new Error("No remaining flats available");
    }

    society.remaining_flats -= 1;
    await society.save();

    const newFlat = new Flat({
      flat_no: user.flat_no,
      society_code: user.society_code,
      owner_name: user.name,
    });

    await newFlat.save();

    console.log(`Flat ${user.flat_no} assigned to ${user.name} successfully`);
    return true;
  } catch (error) {
    console.error("Error assigning flat:", error.message);
    throw new Error("Failed to assign flat");
  }
};

export default assignFlat;
