import express from "express";
import raiseComplaint from "../../Controllers/ComplaintController/raiseComplaint.js";
import getUnresolvedComplaints from "../../Controllers/ComplaintController/getUnresolveComplaints.js";
import resolveComplaint from "../../Controllers/ComplaintController/resolveComplaint.js";
import getResolvedComplaints from "../../Controllers/ComplaintController/getResolveComplaints.js";
import deleteComplaint from "../../Controllers/ComplaintController/deleteComplaint.js";

import validateUser from "../../MiddleWare/validateUser.js";
import uploadComplaintPhoto from "../../MiddleWare/s3ForComplaints.js";
import authenticateToken from "../../MiddleWare/authMiddlewar.js";

const router = express.Router();

router.post("/raise", authenticateToken, validateUser, uploadComplaintPhoto, raiseComplaint);
router.get("/getunresolve", authenticateToken, validateUser, getUnresolvedComplaints);
router.get("/getresolve", authenticateToken, validateUser, getResolvedComplaints);
router.post("/resolve", authenticateToken, validateUser, resolveComplaint);
router.delete("/delete", authenticateToken, validateUser, deleteComplaint);

export default router;