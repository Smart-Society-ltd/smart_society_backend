import express from "express";
import raiseAnnouncement from "../../Controllers/AnnouncementController/raiseAnnouncement.js";
import getAnnouncement from "../../Controllers/AnnouncementController/getAnnonucement.js";
import deleteAnnouncement from "../../Controllers/AnnouncementController/deleteAnnouncement.js";

import uploadAnnouncementPhoto from "../../MiddleWare/s3ForAnnouncement.js";
import authenticateToken from "../../MiddleWare/authMiddlewar.js";

const router = express.Router();

router.post("/raise", authenticateToken, uploadAnnouncementPhoto, raiseAnnouncement);
router.get("/get", authenticateToken, getAnnouncement);
router.delete("/delete", authenticateToken, deleteAnnouncement);

export default router;