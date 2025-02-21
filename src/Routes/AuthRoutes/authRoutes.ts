import express from "express";
import sendOtp from "../../Controllers/OtpController/sendOtp.js";
import verifyOtp from "../../Controllers/OtpController/verifyOtp.js";
import tempRegisterSociety from "../../Controllers/AuthController/tempRegisterSociety.js";
import { listPendingRegistrations, processRegistration } from "../../Controllers/AuthController/pendingSocietyRequest.js";
import userLogin from "../../Controllers/AuthController/userLogin.js";
import userRegister from "../../Controllers/AuthController/userRegister.js";
import { pendingUsers, processUsers } from "../../Controllers/AuthController/pendingUserRequest.js";
import assignSociety from "../../Controllers/AuthController/societyAssign.js";

import authMiddleware from '../../MiddleWare/authMiddlewar.js';
import validateAdmin from "../../MiddleWare/validateAdmin.js";
import validateUserAndSociety from "../../MiddleWare/validateUserSociety.js";

const router = express.Router();

router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/registerSociety/tempRegisterSociety", tempRegisterSociety);
router.get("/registerSociety/pending", listPendingRegistrations);
router.post("/registerSociety/process", processRegistration);
router.post("/login", userLogin);
router.post("/userRegister", userRegister);
router.post("/assignSociety", validateUserAndSociety, assignSociety);
router.get("/userRegister/pending/:society_code", authMiddleware, validateAdmin, pendingUsers);
router.post("/userRegister/process", authMiddleware, validateAdmin, processUsers);

export default router;