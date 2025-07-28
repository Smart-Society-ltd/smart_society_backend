import express from "express";
import raiseAnnouncement from "../../Controllers/AnnouncementController/raiseAnnouncement.js";
import getAnnouncement from "../../Controllers/AnnouncementController/getAnnonucement.js";
import deleteAnnouncement from "../../Controllers/AnnouncementController/deleteAnnouncement.js";

import uploadAnnouncementPhoto from "../../MiddleWare/s3ForAnnouncement.js";
import authenticateToken from "../../MiddleWare/authMiddlewar.js";
import validateAdmin from "../../MiddleWare/validateAdmin.js";
import validateUser from "../../MiddleWare/validateUser.js";

const router = express.Router();

router.post("/raise", authenticateToken, validateAdmin, uploadAnnouncementPhoto, raiseAnnouncement);
router.get("/get", authenticateToken, validateUser, getAnnouncement);
router.delete("/delete", authenticateToken, validateAdmin, deleteAnnouncement);

export default router;