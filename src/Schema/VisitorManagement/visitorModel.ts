import { time } from "console";
import mongoose, { Schema, Document } from "mongoose";

interface Visitor extends Document {
  society_code: string;
  visitor_name: string;
  visitor_contact_no: string;
  visiting_to: string;
  visit_purpose: string;
  visitor_address: string;
  flat_no: string;
  no_of_people: string;
  checkin_date: Date;
  image_url?: string;
  image_key?: string;
}

const VisitorSchema: Schema = new Schema(
  {
    society_code: {
      type: String,
      required: true,
    },
    visitor_name: {
      type: String,
      required: true,
    },
    visitor_contact_no: {
      type: String,
      required: true,
    },
    visiting_to: {
      type: String,
      required: true,
    },
    visit_purpose: {
      type: String,
      required: true,
    },
    flat_no: {
      type: String,
      required: true,
    },
    no_of_people: {
      type: String,
      required: true,
    },
    visitor_address: {
      type: String,
      required: true,
    },
    checkin_date: {
      type: Date,
      default: Date.now,
    },
    image_url: {
      type: String,
      required: false,
    },
    image_key: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Visitor>("Visitor", VisitorSchema);
