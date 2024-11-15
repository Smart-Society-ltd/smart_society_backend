import express from "express";

import getNeighbour from "../../controller/NeighbourController/getNeighbour.js";
import authenticateToken from "../../middleware/authMiddlewar.js";

const router = express.Router();

router.get("/getneighbours", authenticateToken, getNeighbour);

export default router;