import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "./s3ForDocument.js";

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "visitorphoto",
    acl: "private",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: any, file, cb) => {
      const societyCode = req.body.society_code || "default";

      const date = new Date().toISOString().split("T")[0];

      const fileKey = `${societyCode}/${date}/${file.originalname}`;
      cb(null, fileKey);
    },
  }),
});

const uploadPhotos = upload.single("file");

export default uploadPhotos;
