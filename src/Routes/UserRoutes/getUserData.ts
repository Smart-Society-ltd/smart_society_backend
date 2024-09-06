import express from "express";
import getUser from "../../Controllers/UserController/getUser.js";
import authMiddleware from '../../MiddleWare/authMiddlewar.js'

const router = express.Router();

router.get('/me',authMiddleware, getUser);

export default router;