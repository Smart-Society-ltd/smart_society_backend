import { Request, Response } from "express";
import TempUser from "../../Schema/AuthModels/tempUserModel.js";
import { User } from "../../Schema/AuthModels/userModel.js";

interface SocietyAssignRequestBody {
  userId: string;
  society_code: string;
  flat_no: string;
  floor_no: string;
  flat_type: string;
}

const assignSociety = async (
  req: Request<{}, {}, SocietyAssignRequestBody>,
  res: Response
) => {
  try {
    const { id, society_code, flat_no, floor_no, flat_type } = req.body;
    const { user, society } = req.validatedData;

    const admin_id = society?.admin_ids[0];
    const admin = await User.findOne({ _id: admin_id });

    const newTempUser = new TempUser({
      user_id: id,
      user_name: user?.name,
      society_code,
      flat_no,
      flat_type,
      floor_no,
    });

    await newTempUser.save();

    return res.status(200).json({
      msg: "Request sent to admin successfully",
      data: {
        admin_name: admin?.name,
        admin_mb_no: admin?.mb_no,
        society_name: society?.society_name,
      },
      status: true,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ errorMsg: "Failed to register user", error: error?.message });
  }
};

export default assignSociety;
