import express from "express";
import LeadController from "../controller/LeadController";

const router = express.Router();

router.post('/create',LeadController.create)
router.get('/:id',LeadController.getById)
router.get('/get-all',LeadController.getAll)
router.get('/get-all-by-status/:status',LeadController.getAllByStatus)
router.post('/update-Status',LeadController.updateStatus)


export default router;