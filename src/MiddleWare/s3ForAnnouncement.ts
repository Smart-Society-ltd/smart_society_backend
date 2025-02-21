import {uploadToS3} from "../Config/s3.js";

const uploadAnnouncementPhoto = uploadToS3("announcementphoto", (req, file) => {
  const societyCode = req.user.society_code;
  return `${societyCode}/${file.originalname}`;
});

export default uploadAnnouncementPhoto.single("file");
