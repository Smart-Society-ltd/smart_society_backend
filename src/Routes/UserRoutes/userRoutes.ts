import express from "express";
import getUser from "../../controller/UserController/getUser.js";
import updateUser from "../../controller/UserController/updateUser.js";

import authMiddleware from "../../middleware/authMiddlewar.js";

const router = express.Router();

router.get("/me", authMiddleware, getUser);
router.put("/update", authMiddleware, updateUser);

export default router;
