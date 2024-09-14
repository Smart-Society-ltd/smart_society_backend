import express from "express";

import folderCreation from "../../Controllers/DocumentController/folderCreation.js";
import uploadDocument from "../../Controllers/DocumentController/uploadDocument.js";

import authenticateToken from "../../MiddleWare/authMiddlewar.js";
import s3ForDocuments from '../../MiddleWare/s3ForDocument.js'

const router = express.Router();

router.post("/folder/create", authenticateToken, folderCreation);
router.post("/file/add", s3ForDocuments, uploadDocument);

export default router;
