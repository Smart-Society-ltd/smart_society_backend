import express from "express";

import getNeighbour from "../../Controllers/NeighbourController/getNeighbour.js";
import authenticateToken from "../../MiddleWare/authMiddlewar.js";
import validateUser from "../../MiddleWare/validateUser.js";

const router = express.Router();

router.get("/getneighbours", authenticateToken, validateUser, getNeighbour);

export default router;
