import {uploadToS3} from "../Config/s3.js";

const uploadComplaintPhoto = uploadToS3("complaintphoto", (req, file) => {
  const societyCode = req.user.society_code;
  return `${societyCode}/${file.originalname}`;
});

export default uploadComplaintPhoto.single("file");
