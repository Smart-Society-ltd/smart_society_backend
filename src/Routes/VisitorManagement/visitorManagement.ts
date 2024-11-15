import express from "express";
import uploadPhotos from "../../middleware/s3Middleware.js";
import checkIn from "../../controller/VisitorController/checkIn.js"
import { pendingCheckin, processCheckin } from "../../controller/VisitorController/processCheckinReq.js";
import authenticateToken from "../../middleware/authMiddlewar.js";

const router = express.Router();

router.post('/checkin', uploadPhotos, checkIn);
router.get('/checkin/pending/:flat_no', authenticateToken, pendingCheckin);
router.post('/checkin/process', authenticateToken, processCheckin);

export default router;