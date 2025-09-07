import express from "express";
import TestController from "../controller/TestController";
const router = express.Router();

router.get('/hello',TestController.hello);

export default router;