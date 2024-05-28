import express from 'express';
import { isAuthenticated } from "../middlewares/jwt.js"
import { signup, login, logout, verify } from "../controllers/auth.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/verify", isAuthenticated, verify);

export default router;