import {uploadToS3} from "../Config/s3.js";

const uploadSSDocument = uploadToS3("ssdocument", (req, file) => {
  const societyCode = req.body.society_code || "default";
  const folder = req.body.folder_name || "general";
  return `${societyCode}/${folder}/${file.originalname}`;
});

export default uploadSSDocument.single("file");
