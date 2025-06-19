import { Society } from "../../Schema/AuthModels/societyModel.js";
import { User } from "../../Schema/AuthModels/userModel.js";
import TempSociety from "../../Schema/AuthModels/tempRegistrationModel.js";
import { Types } from "mongoose";

export const checkUser = async (data: {
  mb_no?: string;
  _id?: string | Types.ObjectId;
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
