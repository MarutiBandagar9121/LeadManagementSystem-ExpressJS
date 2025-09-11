import { NextFunction, type Request, type Response} from 'express';  
import LeadModel from '../repository/LeadModel';
import {createLeadSchema} from '../validator/CreateLeadValidator';
import {UpdateLeadSchema} from '../validator/UpdateLeadValidator';
import * as z from "zod";
import LeadStatusEnum from '../constants/LeadStatusEnum';
import mongoose from 'mongoose';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';
import InvalidDataFormat from '../errors/InvalidDataFormat';
import DuplicateRecordError from '../errors/DuplicateRecordError';

const create = async(req:Request,res:Response,next:NextFunction) =>{
  try{
    const parsed = createLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InvalidDataFormat("Invalid Payload",parsed.error.flatten());
    }
    const { email, phone } = parsed.data;
    const existingLead = await LeadModel.findOne({
      $or: [{ email }, { phone }]
    });
    if (existingLead) {
      throw new DuplicateRecordError("Lead already exists");
    }
    let leadModelObj = new LeadModel();
    let lead = parsed.data;
    leadModelObj.set(lead);
    leadModelObj.leadAssignedTo = "Temp User";
    leadModelObj = await LeadModel.create(leadModelObj);
    (res as any).sendSuccessResponse({id:leadModelObj._id},"Lead created successfully",201)
  }catch(error){
    next(error)
  }
}

const getById = async(req:Request,res:Response,next:NextFunction) =>{
  try{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new InvalidDataFormat("Invalid id format");
    }
    const lead = await LeadModel.findById(req.params.id);
    if(!lead){
      throw new ResourceNotFoundError("Lead not found");
    }
    (res as any).sendSuccessResponse(lead,"Lead fetched successfully",200);
    next();
    return;
  }
  catch(error){
    next(error)
  }
}

const updateStatus = async(req:Request,res:Response,next:NextFunction) =>{
  try{
    const parsed = UpdateLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InvalidDataFormat("Invalid Payload",parsed.error.flatten());
    }
    let updateLeadStatusReq = parsed.data;
    let lead = await LeadModel.findById(updateLeadStatusReq.id);
    if(!lead){
      throw new ResourceNotFoundError("Lead not found");
    }
    if(lead.leadStatus == updateLeadStatusReq.status){
      throw new ResourceNotFoundError("Lead status is already: "+updateLeadStatusReq.status);
    }
    lead.leadStatus = updateLeadStatusReq.status as LeadStatusEnum;
    lead = await LeadModel.findByIdAndUpdate(updateLeadStatusReq.id,lead,{new:true});
    if(lead){
      (res as any).sendSuccessResponse({id:lead._id,message:"Lead status updated successfully",status:lead.leadStatus},"Lead status updated successfully",200);
    }
  }catch(error){
    next(error);
  }
}

const getAll = async(req:Request,res:Response,next:NextFunction) =>{
  console.log("Getting all leads");
  try{
    const allLeads = await LeadModel.find();
    if(!allLeads){
      throw new ResourceNotFoundError("No leads found");
    }
    (res as any).sendSuccessResponse(allLeads,"Leads fetched successfully",200);
  }catch(error){
    next(error);
  }
}

const getAllByStatus = async(req:Request,res:Response,next:NextFunction) =>{
  try{
    const status = z.enum(Object.values(LeadStatusEnum) as [string, ...string[]]).parse(req.params.status);
    const allLeads = await LeadModel.find({leadStatus:status});
    if(!allLeads){
      res.status(404).json({error:"No leads found"});
      return;
    }
    (res as any).sendSuccessResponse(allLeads,"Leads fetched successfully",200);
  }
  catch(error){
    if(error instanceof z.ZodError){
      throw new InvalidDataFormat("Invalid Payload",error.flatten());
    }
    next(error);
  }
}

export default {
  create,
  updateStatus,
  getAll,
  getAllByStatus,
  getById
}