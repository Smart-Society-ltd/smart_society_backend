import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "ssdocument",
    acl: "private",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: any, file, cb) => {

      const societyCode = (req.body as any).society_code || 'default';

      const folder = (req.body as any).folder_name;

      const fileKey = `${societyCode}/${folder}/${file.originalname
        }`;
      cb(null, fileKey);
    },
  }),
});

const uploadPhotos = upload.single("file");

export { uploadPhotos, s3 };
