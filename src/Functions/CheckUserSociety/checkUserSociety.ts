import { Society } from "../../Models/AuthModels/societyModel.js";
import { User } from "../../Models/AuthModels/userModel.js";
import TempSociety from "../../Models/AuthModels/tempRegistrationModel.js"

export const checkUser = async (data: {
  mb_no?: string;
  _id?: string;
  email?: string;
}) => {
  const query: any = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v)
  );

  return await User.findOne(query);
};

export const checkSociety = async (data: {
  society_code?: string;
  _id?: string;
}) => {
  const query = Object.fromEntries(Object.entries(data).filter(([_, v]) => v));

  return await Society.findOne(query);
};


export const checkTempSociety = async (data: {
  society_code?: string;
  _id?: string;
}) => {
  const query = Object.fromEntries(Object.entries(data).filter(([_, v]) => v));

  return await TempSociety.findOne(query);
};
