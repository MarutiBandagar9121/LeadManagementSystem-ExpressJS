import mongoose from "mongoose";
import UserTypeEnum from "../constants/UserTypeEnum";
import UserStatusEnum from "../constants/UserStatusEnum";

const userSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:UserTypeEnum,default:UserTypeEnum.READ_ONLY_USER},
    status:{type:String,enum:UserStatusEnum,default:UserStatusEnum.IN_REVIEW},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
})

export default mongoose.model("User", userSchema);