import express from "express";

import getSocietyMaintenance from "../../controller/MaintenanceController/societyMaintenance.js";
import getUserMaintenance from "../../controller/MaintenanceController/userMaintenance.js";
import configureMaintenance from "../../controller/MaintenanceController/configureMaintenance.js";
import authenticateToken from "../../middleware/authMiddlewar.js";

const router = express.Router();

//User
router.get("/user/:userId", getUserMaintenance);

// Society
router.get("/society/:society_code", getSocietyMaintenance);
router.post("/society/configure", authenticateToken, configureMaintenance);

export default router;