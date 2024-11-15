import express from "express";
import raiseComplaint from "../../controller/ComplaintController/raiseComplaint.js";
import getUnresolvedComplaints from "../../controller/ComplaintController/getUnresolveComplaints.js";
import resolveComplaint from "../../controller/ComplaintController/resolveComplaint.js";
import getResolvedComplaints from "../../controller/ComplaintController/getResolveComplaints.js";
import deleteComplaint from "../../controller/ComplaintController/deleteComplaint.js";

import s3ForComplaint from "../../middleware/s3ForComplaints.js";
import authenticateToken from "../../middleware/authMiddlewar.js";

const router = express.Router();

router.post("/raise", authenticateToken, s3ForComplaint, raiseComplaint);
router.get("/getunresolve", authenticateToken, getUnresolvedComplaints);
router.get("/getresolve", authenticateToken, getResolvedComplaints);
router.post("/resolve", authenticateToken, resolveComplaint);
router.delete("/delete", authenticateToken, deleteComplaint);

export default router;