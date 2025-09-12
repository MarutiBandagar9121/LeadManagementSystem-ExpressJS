import { Router } from "express";
import UserContrroller from "../controller/UserContrroller";

const router = Router();

router.post("/register", UserContrroller.registerUser);
router.post("/login", UserContrroller.login);

export default router;