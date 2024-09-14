import { Request, Response } from "express";
import Visitor from "../../Models/VisitorManagement/tempVisitorModel.js";

interface CheckinRequestBody {
  society_code: string;
  visitor_name: string;
  visitor_contact_no: string;
  visiting_to: string;
  visit_purpose: string;
  visitor_add: string;
  flat_no: string;
  no_of_people: string;
}

const checkIn = async (
  req: Request<{}, {}, CheckinRequestBody>,
  res: Response
) => {
  try {
    const file = req.file;

    const {
      society_code,
      visitor_name,
      visitor_contact_no,
      visiting_to,
      visit_purpose,
      visitor_address,
      flat_no,
      no_of_people,
    } = req.body;

    if (!file) {
      return res.status(404).json({ errorMsg: "No file uploaded" });
    }

    const tempCheckIn = new Visitor({
      society_code,
      visit_purpose,
      visiting_to,
      visitor_name,
      flat_no,
      no_of_people,
      visitor_address,
      visitor_contact_no,
      checkin_date: Date.now(),
      image_url: file.location,
      image_key: file.key,
    });

    const tempCheckInData = await tempCheckIn.save();

    res.status(200).json({ msg: "Check-in successful", data: tempCheckInData });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      errorMsg: "Failed to complete check-in",
      error: error.message,
    });
  }
};

export default checkIn;
