import express from "express";
import createAnnualPlan from "../../Controllers/AnnualPlanController/AnnualActionPlan/createAnnualPlan.js";
import createProject from "../../Controllers/AnnualPlanController/ProjectController/createProject.js";
import getAnnualPlan from "../../Controllers/AnnualPlanController/AnnualActionPlan/getActionPlans.js";
import getProject from "../../Controllers/AnnualPlanController/ProjectController/getProject.js";
import distributeWork from "../../Controllers/AnnualPlanController/ProjectController/workDistribution.js";
import getParticularProject from "../../Controllers/AnnualPlanController/ProjectController/getParticularProject.js";
import changeStatus from "../../Controllers/AnnualPlanController/ProjectController/changeStatus.js";

import authenticateToken from "../../MiddleWare/authMiddlewar.js";

const router = express.Router();

//Annual Action Plans Routes
router.post("/plan/create", authenticateToken, createAnnualPlan);
router.get("/plan/get", authenticateToken, getAnnualPlan);

//Projects Routes
router.post("/project/create", authenticateToken, createProject);
router.post("/project/get", authenticateToken, getProject);
router.post("/project/distributework", authenticateToken, distributeWork);
router.get("/project/getsingle/:project_id", authenticateToken, getParticularProject);
router.post("/project/changestatus", authenticateToken, changeStatus);

export default router;