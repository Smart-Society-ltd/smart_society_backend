import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = (bucketName, getKey) => {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketName,
      acl: "private",
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const fileKey = getKey(req, file);
        cb(null, fileKey);
      },
    }),
  });
};

export {uploadToS3, s3};
