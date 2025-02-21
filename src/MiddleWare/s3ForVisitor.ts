import { uploadToS3 } from "../Config/s3.js";

const uploadVisitorPhoto = uploadToS3("visitorphoto", (req, file) => {
  const societyCode = req.body.society_code || "default";
  const date = new Date().toISOString().split("T")[0];
  return `${societyCode}/${date}/${file.originalname}`;
});

export default uploadVisitorPhoto.single("file");
