import { NextFunction, type Request, type Response} from 'express'; 
import { RegisterUserSchema } from '../validator/RegisterUserValidator';
import InvalidDataFormat from '../errors/InvalidDataFormat';
import UserModel from '../repository/UserModel';
import DuplicateRecordError from '../errors/DuplicateRecordError';
import * as z from "zod";
import bcrypt from 'bcrypt';
import config from '../config/Config';
import { UserLoginSchema } from '../validator/UserLoginValidator';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';

const registerUser = async (req:Request,res:Response, next:NextFunction)=>{
    try{
        const parsed = RegisterUserSchema.safeParse(req.body);
        if(!parsed.success){
            throw new InvalidDataFormat("Invalid Payload",z.treeifyError(parsed.error));
        }
        let user = parsed.data;
        const existingUser = await UserModel.findOne({email:user.email});
        if(existingUser){
            throw new DuplicateRecordError("User already exists");
        }
        let userModelObj = new UserModel();
        const saltRounds = config.bcryptSaltRounds;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        userModelObj.set(user);
        await userModelObj.save();
        (res as any).sendSuccessResponse({id:userModelObj._id},"User registered successfully",201);
    }
    catch(error){
        next(error);
    }
}

const login = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const parsed = UserLoginSchema.safeParse(req.body);
        if(!parsed.success){
            throw new ResourceNotFoundError("Invalid Payload",z.treeifyError(parsed.error));
        }
        let loginPayload = parsed.data;
        const user = await UserModel.findOne({email:loginPayload.email});
        if(!user){
            throw new ResourceNotFoundError("Invalid email or password");
        }else{
            const isPasswordValid = await bcrypt.compare(loginPayload.password, user.password);
            if(!isPasswordValid){
                throw new ResourceNotFoundError("Invalid email or password");
            }
            (res as any).sendSuccessResponse({id:user._id},"User logged in successfully",200);
        }
    }catch(error){
        next(error);
    }
}

export default{
    registerUser,
    login
}