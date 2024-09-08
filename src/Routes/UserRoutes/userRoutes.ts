import express from "express";
import getUser from "../../Controllers/UserController/getUser.js";
import updateUser from "../../Controllers/UserController/updateUser.js";

import authMiddleware from "../../MiddleWare/authMiddlewar.js";

const router = express.Router();
 
router.get("/me", authMiddleware, getUser);
router.put("/update", authMiddleware, updateUser);

export default router;
