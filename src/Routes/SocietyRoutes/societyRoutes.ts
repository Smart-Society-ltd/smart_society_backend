import express from "express";
import societyPricing from "../../Controllers/SocietyController/societyPricing.js";
import getSociety from "../../Controllers/SocietyController/getSociety.js";
import updateSociety from "../../Controllers/SocietyController/updateSociety.js";

import authMiddleware from '../../MiddleWare/authMiddlewar.js'

const router = express.Router();

router.get("/getsociety", authMiddleware, getSociety);
router.get("/pricing", societyPricing);
router.put("/update", authMiddleware, updateSociety);

export default router;
 