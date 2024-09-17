import mongoose from "mongoose";

export interface IAnnouncement {
  title: string;
  content: string;
  raised_by: string;
  society_code: string;
  photo?: string;
}

const announcementSchema = new mongoose.Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    raised_by: {
      type: String,
      required: true,
    },
    society_code: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);
const Announcement = mongoose.model<IAnnouncement>(
  "Announcement",
  announcementSchema
);
export default Announcement;
