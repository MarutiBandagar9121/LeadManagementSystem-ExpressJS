import { Router } from "express";
import UserContrroller from "../controller/UserContrroller";

const router = Router();

router.post("/register", UserContrroller.registerUser);

export default router;