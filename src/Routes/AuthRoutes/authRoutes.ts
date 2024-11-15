import express from "express";
import sendOtp from "../../controller/OtpController/sendOtp.js";
import verifyOtp from "../../controller/OtpController/verifyOtp.js";
import tempRegisterSociety from "../../controller/AuthController/tempRegisterSociety.js";
import { listPendingRegistrations, processRegistration } from "../../controller/AuthController/pendingSocietyRequest.js";
import userLogin from "../../controller/AuthController/userLogin.js";
import userRegister from "../../controller/AuthController/userRegister.js";
import { pendingUsers, processUsers } from "../../controller/AuthController/pendingUserRequest.js";
import assignSociety from "../../controller/AuthController/societyAssign.js";

import authMiddleware from '../../middleware/authMiddlewar.js';

const router = express.Router();

router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/registerSociety/tempRegisterSociety", tempRegisterSociety);
router.get("/registerSociety/pending", listPendingRegistrations);
router.post("/registerSociety/process", processRegistration);
router.post("/login", userLogin);
router.post("/userRegister", userRegister);
router.post("/assignSociety", assignSociety);
router.get("/userRegister/pending/:society_code", authMiddleware, pendingUsers);
router.post("/userRegister/process", authMiddleware, processUsers);

export default router;