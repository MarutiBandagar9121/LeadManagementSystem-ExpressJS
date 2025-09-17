import { Router } from "express";
import UserController from "../controller/UserController";

const router = Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.login);
router.post("/verify-email", UserController.verifyEmail);
router.post("/resend-otp",UserController.resendOtp);
router.post("/refresh-token/:userId",UserController.refreshToken);


export default router;