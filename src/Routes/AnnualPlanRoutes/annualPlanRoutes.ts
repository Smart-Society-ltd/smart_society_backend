import express from "express";
import createProject from "../../Controllers/AnnualPlanController/createProject.js";
import getProject from "../../Controllers/AnnualPlanController/getProject.js";
import distributeWork from "../../Controllers/AnnualPlanController/workDistribution.js";
import getParticularProject from "../../Controllers/AnnualPlanController/getParticularProject.js";
import changeStatus from "../../Controllers/AnnualPlanController/changeStatus.js";

import authenticateToken from "../../MiddleWare/authMiddlewar.js";
import validateAdmin from "../../MiddleWare/validateAdmin.js";
import validateUser from "../../MiddleWare/validateUser.js";

const router = express.Router();

router.post("/create", authenticateToken, validateAdmin, createProject);
router.get("/get", authenticateToken, validateUser, getProject);
router.post("/distributework", authenticateToken, validateAdmin, distributeWork);
router.get("/getsingle/:project_id", authenticateToken, validateUser, getParticularProject);
router.post("/changestatus", authenticateToken, validateUser, changeStatus);

export default router;