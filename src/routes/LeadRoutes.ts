import express from "express";
import LeadController from "../controller/LeadController";
import { JwtMiddleware } from "../middleware/JwtMiddleware";

const router = express.Router();

router.post('/create',JwtMiddleware,LeadController.create)
router.get('/get-all',JwtMiddleware,LeadController.getAll)
router.get('/get-all-by-status/:status',JwtMiddleware,LeadController.getAllByStatus)
router.post('/update-Status',JwtMiddleware,LeadController.updateStatus)
router.get('/:id',JwtMiddleware,LeadController.getById)


export default router;