import express from "express";

import getNeighbour from "../../Controllers/NeighbourController/getNeighbour.js";
import authenticateToken from "../../MiddleWare/authMiddlewar.js";

const router = express.Router();

router.get("/getneighbours", authenticateToken, getNeighbour);

export default router;