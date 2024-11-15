import express from "express";
import raiseAnnouncement from "../../controller/AnnouncementController/raiseAnnouncement.js";
import getAnnouncement from "../../controller/AnnouncementController/getAnnonucement.js";
import deleteAnnouncement from "../../controller/AnnouncementController/deleteAnnouncement.js";

import s3ForAnnouncement from "../../middleware/s3ForAnnouncement.js";
import authenticateToken from "../../middleware/authMiddlewar.js";

const router = express.Router();

router.post("/raise", authenticateToken, s3ForAnnouncement, raiseAnnouncement);
router.get("/get", authenticateToken, getAnnouncement);
router.delete("/delete", authenticateToken, deleteAnnouncement);

export default router;