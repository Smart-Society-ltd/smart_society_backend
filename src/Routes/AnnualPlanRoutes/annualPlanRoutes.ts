import express from "express";
import createAnnualPlan from "../../controller/AnnualPlanController/AnnualActionPlan/createAnnualPlan.js";
import createProject from "../../controller/AnnualPlanController/ProjectController/createProject.js";
import getAnnualPlan from "../../controller/AnnualPlanController/AnnualActionPlan/getActionPlans.js";
import getProject from "../../controller/AnnualPlanController/ProjectController/getProject.js";
import distributeWork from "../../controller/AnnualPlanController/ProjectController/workDistribution.js";
import getParticularProject from "../../controller/AnnualPlanController/ProjectController/getParticularProject.js";
import changeStatus from "../../controller/AnnualPlanController/ProjectController/changeStatus.js";

import authenticateToken from "../../middleware/authMiddlewar.js";

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