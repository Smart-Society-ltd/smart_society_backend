import express from "express";

import folderCreation from "../../controller/DocumentController/folderCreation.js";
import uploadDocument from "../../controller/DocumentController/uploadDocument.js";
import getFolders from "../../controller/DocumentController/getFolders.js";
import getDocuments from "../../controller/DocumentController/getDocuments.js";
import deleteFile from "../../controller/DocumentController/deleteFile.js";

import authenticateToken from "../../middleware/authMiddlewar.js";
import { uploadPhotos } from "../../middleware/s3ForDocument.js";

const router = express.Router();

router.post("/folder/create", authenticateToken, folderCreation);
router.post("/file/add", authenticateToken, uploadPhotos, uploadDocument);
router.get("/folder/get/:society_code", authenticateToken, getFolders);
router.post("/file/get", authenticateToken, getDocuments);
router.delete("/file/delete", authenticateToken, deleteFile);

export default router;
