import express from "express";
import uploadPhotos from "../../MiddleWare/s3Middleware.js";
import checkIn from "../../Controllers/VisitorController/checkIn.js"
import { pendingCheckin ,processCheckin } from "../../Controllers/VisitorController/processCheckinReq.js";

const router = express.Router();

router.post('/checkin', uploadPhotos, checkIn);
router.get('/checkin/pending/:flat_no', pendingCheckin);
router.post('/checkin/process', processCheckin);

export default router;