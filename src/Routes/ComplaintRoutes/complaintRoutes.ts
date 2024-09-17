import express from "express";
import raiseComplaint from "../../Controllers/ComplaintController/raiseComplaint.js";
import getUnresolvedComplaints from "../../Controllers/ComplaintController/getUnresolveComplaints.js";
import resolveComplaint from "../../Controllers/ComplaintController/resolveComplaint.js";
import getResolvedComplaints from "../../Controllers/ComplaintController/getResolveComplaints.js";
import deleteComplaint from "../../Controllers/ComplaintController/deleteComplaint.js";

import s3ForComplaint from "../../MiddleWare/s3ForComplaints.js";
import authenticateToken from "../../MiddleWare/authMiddlewar.js";

const router = express.Router();

router.post("/raise", authenticateToken, s3ForComplaint, raiseComplaint);
router.get("/getunresolve", authenticateToken, getUnresolvedComplaints);
router.get("/getresolve", authenticateToken, getResolvedComplaints);
router.post("/resolve", authenticateToken, resolveComplaint);
router.delete("/delete", authenticateToken, deleteComplaint);

export default router;