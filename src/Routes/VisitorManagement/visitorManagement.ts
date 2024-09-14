import express from "express";
import uploadPhotos from "../../MiddleWare/s3Middleware.js";
import checkIn from "../../Controllers/VisitorController/checkIn.js"
import { pendingCheckin ,processCheckin } from "../../Controllers/VisitorController/processCheckinReq.js";
import authenticateToken from "../../MiddleWare/authMiddlewar.js";

const router = express.Router();

router.post('/checkin', uploadPhotos, checkIn);
router.get('/checkin/pending/:flat_no',authenticateToken, pendingCheckin);
router.post('/checkin/process',authenticateToken, processCheckin);

export default router;