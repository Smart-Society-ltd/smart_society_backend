import express from "express";

import getSocietyMaintenance from "../../Controllers/MaintenanceController/societyMaintenance.js";
import getUserMaintenance from "../../Controllers/MaintenanceController/userMaintenance.js";
import configureMaintenance from "../../Controllers/MaintenanceController/configureMaintenance.js";
import authenticateToken from "../../MiddleWare/authMiddlewar.js";

const router = express.Router();

//User
router.get("/user/:userId", getUserMaintenance);

// Society
router.get("/society/:society_code", getSocietyMaintenance);
router.post("/society/configure", authenticateToken, configureMaintenance);

export default router;