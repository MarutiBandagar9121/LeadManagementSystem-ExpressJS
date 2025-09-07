import { type Request, type Response} from 'express';  
import LeadModel from '../models/LeadModel';
import {createLeadSchema} from '../validator/CreateLeadValidator';
import {UpdateLeadSchema} from '../validator/UpdateLeadValidator';
import * as z from "zod";
import LeadStatusEnum from '../constants/LeadStatusEnum';
import mongoose from 'mongoose';
import InvalidIdError from '../errors/InvalidIdError';

const create = async(req:Request,res:Response) =>{

  console.log("lead/create request recived: ",req.body);

  const parsed = createLeadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const { email, phone } = parsed.data;

  const existingLead = await LeadModel.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingLead) {
    res.status(409).json({error:"Lead already exists"});
    return;
  }

  let leadModelObj = new LeadModel();
  let lead = parsed.data;
  leadModelObj.set(lead);
  leadModelObj.leadAssignedTo = "Temp User";
  leadModelObj = await LeadModel.create(leadModelObj);
  res.status(201).json({id:leadModelObj._id});
}

const getById = async(req:Request,res:Response) =>{
  console.log("lead/get-by-id request recived: ",req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new InvalidIdError();
    return res.status(400).json({ message: "Invalid ID format" });
  }
  const lead = await LeadModel.findById(req.params.id);
  if(!lead){
    res.status(404).json({error:"Lead not found"});
    return;
  }
  res.status(200).json(lead);
  return;
}

const updateStatus = async(req:Request,res:Response) =>{
  console.log("lead/update-status request recived: ",req.body);

  const parsed = UpdateLeadSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten() });
    return;
  }

  let updateLeadStatusReq = parsed.data;
  let lead = await LeadModel.findById(updateLeadStatusReq.id);
  if(!lead){
    res.status(404).json({error:"Lead not found"});
    return;
  }
  if(lead.leadStatus == updateLeadStatusReq.status){
    res.status(400).json({error:"Lead status is already "+updateLeadStatusReq.status});
    return;
  }
  lead.leadStatus = updateLeadStatusReq.status;
  lead = await LeadModel.findByIdAndUpdate(updateLeadStatusReq.id,lead,{new:true});
  if(lead){
    res.status(200).json({id:lead._id,message:"Lead status updated successfully",status:lead.leadStatus});
  } 
  else{
    res.status(500).json({error:"Failed to update lead status"});
  }
}

const getAll = async(req:Request,res:Response) =>{
  console.log("lead/get-all request recived: ",req.body);

  const allLeads = await LeadModel.find();
  if(!allLeads){
    res.status(404).json({error:"No leads found"});
    return;
  }
  res.status(200).json(allLeads);
}

const getAllByStatus = async(req:Request,res:Response) =>{
  console.log("lead/get-all request recived: ",req.body);
  try{
    const status = z.enum(Object.values(LeadStatusEnum) as [string, ...string[]]).parse(req.params.status);
    const allLeads = await LeadModel.find({leadStatus:status});
    if(!allLeads){
      res.status(404).json({error:"No leads found"});
      return;
    }
    res.status(200).json(allLeads);
    return;
  }
  catch(error){
    if(error instanceof z.ZodError){
      res.status(400).json({error:"Invalid status"});
      return;
    }
    res.status(500).json({error:"Internal server error"})
    return;
  }
}
export default {
  create,
  updateStatus,
  getAll,
  getAllByStatus,
  getById
}