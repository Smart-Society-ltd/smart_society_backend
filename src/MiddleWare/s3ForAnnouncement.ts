import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "./s3ForDocument.js";

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "announcementphoto",
    acl: "private",
    metadata: (req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: any, file: any, cb: any) => {
      const societyCode = req.user.society_code;

      const fileKey = `${societyCode}/${file.originalname}`;
      cb(null, fileKey);
    },
  }),
});

const uploadPhotos = upload.single("file");

export default uploadPhotos;
