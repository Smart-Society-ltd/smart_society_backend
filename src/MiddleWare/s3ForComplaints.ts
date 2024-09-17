import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "./s3ForDocument.js";

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "complaintphoto",
    acl: "private",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const societyCode = req.user.society_code;

      const fileKey = `${societyCode}/${file.originalname}`;
      cb(null, fileKey);
    },
  }),
});

const uploadPhotos = upload.single("file");

export default uploadPhotos;