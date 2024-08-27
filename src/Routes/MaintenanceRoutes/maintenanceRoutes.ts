import express from "express";

import getSocietyMaintenance from "../../Controllers/MaintenanceController/societyMaintenance.js";
import getUserMaintenance from "../../Controllers/MaintenanceController/userMaintenance.js";

const router = express.Router();

router.get("/society/:society_code", getSocietyMaintenance);
router.get("/user/:userId", getUserMaintenance);

export default router;