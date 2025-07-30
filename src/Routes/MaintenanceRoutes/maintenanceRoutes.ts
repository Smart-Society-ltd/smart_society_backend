import express from "express";

import configureSocietyMaintenance from "../../Controllers/MaintenanceController/configureMaintenance.js";
import getUserMaintenanceSummary from "../../Controllers/MaintenanceController/getUserConfig.js";
import getSocietyConfig from "../../Controllers/MaintenanceController/getSocietyConfig.js";
import getAllMaintenance from "../../Controllers/MaintenanceController/getAllMaintenance.js";
import getSingleMaintenance from "../../Controllers/MaintenanceController/getSingleMaintenance.js";
import generateMaintenance from "../../Controllers/MaintenanceController/generateMaintenance.js";
import payMaintenance from "../../Controllers/MaintenanceController/payMaintenance.js";
import getPaymentHistory from "../../Controllers/MaintenanceController/getTransactions.js";

import authenticateToken from "../../MiddleWare/authMiddlewar.js";
import validateUser from "../../MiddleWare/validateUser.js";
import validateAdmin from "../../MiddleWare/validateAdmin.js";

const router = express.Router();

// API 1: Configure Society Maintenance
router.post("/society/configure", authenticateToken, configureSocietyMaintenance);

// API 2: Get User Maintenance Summary
router.get("/user/maintenance-summary", authenticateToken, validateUser, getUserMaintenanceSummary);

// API 3: Get Society Configuration
router.get("/society/config", authenticateToken, getSocietyConfig);

// API 4: Get All Maintenance Records for Admin
router.get("/admin/maintenance", authenticateToken, validateAdmin, getAllMaintenance);

// API 5: Get Single User Maintenance Records
router.get("/admin/maintenance/:user_id", authenticateToken, validateAdmin, getSingleMaintenance);

// API 6: Generate Maintenance Records
router.post("/admin/maintenance/generate", authenticateToken, validateAdmin, generateMaintenance);

// API 7: Pay Maintenance
router.post("/user/maintenance/pay", authenticateToken, validateUser, payMaintenance);

// API 8: Get Payment History
router.get("/user/maintenance/history/:user_id", authenticateToken, validateUser, getPaymentHistory);
export default router;