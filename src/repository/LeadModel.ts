import mongoose from "mongoose";
import LeadStatusEnum from "../constants/LeadStatusEnum";


const leadSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    message:{type:String,},
    source:{type:String},
    organizationName:{type:String,},
    leadStatus:{type:String,enum:LeadStatusEnum,default:LeadStatusEnum.NEW},
    leadAssignedTo:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
});

export default mongoose.model("LeadModel",leadSchema);