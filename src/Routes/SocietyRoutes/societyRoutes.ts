import express from "express";
import societyPricing from "../../controller/SocietyController/societyPricing.js";
import getSociety from "../../controller/SocietyController/getSociety.js";
import updateSociety from "../../controller/SocietyController/updateSociety.js";
import getSocietyConfiguration from "../../controller/SocietyController/getSocietyConfiguration.js";

import authMiddleware from '../../middleware/authMiddlewar.js'

const router = express.Router();

router.get("/getsociety", authMiddleware, getSociety);
router.get("/pricing", societyPricing);
router.put("/update", authMiddleware, updateSociety);
router.get("/getconfiguration", authMiddleware, getSocietyConfiguration);

export default router;