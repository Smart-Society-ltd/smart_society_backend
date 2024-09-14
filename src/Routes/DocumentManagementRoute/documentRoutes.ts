import express from "express";

import folderCreation from "../../Controllers/DocumentController/folderCreation.js";
import uploadDocument from "../../Controllers/DocumentController/uploadDocument.js";
import getFolders from "../../Controllers/DocumentController/getFolders.js";
import getDocuments from "../../Controllers/DocumentController/getDocuments.js";
import deleteFile from "../../Controllers/DocumentController/deleteFile.js";

import authenticateToken from "../../MiddleWare/authMiddlewar.js";
import s3ForDocuments from "../../MiddleWare/s3ForDocument.js";

const router = express.Router();

router.post("/folder/create", authenticateToken, folderCreation);
router.post("/file/add", s3ForDocuments, uploadDocument);
router.get("/folder/get/:society_code", authenticateToken, getFolders);
router.post("/file/get", authenticateToken, getDocuments);
router.delete("/file/delete", authenticateToken, deleteFile);

export default router;
