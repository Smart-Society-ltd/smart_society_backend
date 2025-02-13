import { User } from "../../Models/AuthModels/userModel.js";

export const checkUser = async (data: { mb_no?: string; userId?: string }) => {
  const query: any = {};

  if (data.mb_no) {
    query.mb_no = data.mb_no;
  } else if (data.userId) {
    query._id = data.userId;
  }

  return await User.findOne(query);
};
