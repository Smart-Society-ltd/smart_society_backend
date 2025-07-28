import express from "express";
import getUser from "../../Controllers/UserController/getUser.js";
import updateUser from "../../Controllers/UserController/updateUser.js";
import getAllUsers from "../../Controllers/UserController/getAllUsers.js";

import authMiddleware from "../../MiddleWare/authMiddlewar.js";

const router = express.Router();
 
router.get("/me", authMiddleware, getUser);
router.put("/update", authMiddleware, updateUser);
router.get("/all", getAllUsers);

export default router;
