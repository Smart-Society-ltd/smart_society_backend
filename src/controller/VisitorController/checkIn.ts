import { Request, Response } from "express";
import Visitor from "../../models/VisitorManagement/tempVisitorModel.js";
import ApiResponse from './../../utils/api_success.js';

interface CheckinRequestBody {
  society_code: string;
  visitor_name: string;
  visitor_contact_no: string;
  visiting_to: string;
  visit_purpose: string;
  visitor_add: string;
  visitor_address: string;
  flat_no: string;
  no_of_people: string;
}

const checkIn = async (
  req: Request<{}, {}, CheckinRequestBody>,
  res: Response
) => {
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
    throw new Error("Please upload an image");
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
    image_url: (file as any).location,
    image_key: (file as any).key,
  });

  const tempCheckInData = await tempCheckIn.save();
  res.status(200).json(new ApiResponse({ checkIn: tempCheckInData }, "Visitor checked in successfully"));
};

export default checkIn;
