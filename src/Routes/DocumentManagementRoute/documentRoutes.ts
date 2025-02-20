import express from "express";

import folderCreation from "../../Controllers/DocumentController/folderCreation.js";
import uploadDocument from "../../Controllers/DocumentController/uploadDocument.js";
import getFolders from "../../Controllers/DocumentController/getFolders.js";
import getDocuments from "../../Controllers/DocumentController/getDocuments.js";
import deleteFile from "../../Controllers/DocumentController/deleteFile.js";

import authenticateToken from "../../MiddleWare/authMiddlewar.js";
import uploadSSDocument from "../../MiddleWare/s3ForDocument.js"
import validateUser from "../../MiddleWare/validateUser.js";
import validateAdmin from "../../MiddleWare/validateAdmin.js";

const router = express.Router();

router.post("/folder/create", authenticateToken, validateAdmin, folderCreation);
router.post("/file/add", authenticateToken, validateAdmin, uploadSSDocument, uploadDocument);
router.get("/folder/get/:society_code", authenticateToken, validateUser, getFolders);
router.post("/file/get", authenticateToken, validateUser, getDocuments);
router.delete("/file/delete", authenticateToken, validateAdmin, deleteFile);

export default router;
