import { NextFunction, type Request, type Response} from 'express'; 
import { RegisterUserSchema } from '../validator/RegisterUserValidator';
import { UserLoginSchema } from '../validator/UserLoginValidator';
import InvalidDataFormat from '../errors/InvalidDataFormat';
import UserModel from '../repository/UserModel';
import DuplicateRecordError from '../errors/DuplicateRecordError';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';
import * as z from "zod";
import bcrypt from 'bcrypt';
import config from '../config/Config';
import { client } from '../config/redis';
import UserStatusEnum from '../constants/UserStatusEnum';
import jwt from 'jsonwebtoken';
import { UserRefreshTokenModel } from '../repository/UserRefreshTokens';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

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
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await client.set(user.email, otp, {
            EX:180
        });
        console.log(`OTP for ${user.email} is ${otp}`);
        userModelObj.set(user);
        await userModelObj.save();
        (res as any).sendSuccessResponse({id:userModelObj._id},"User registered successfully. OTP sent to email",201);
    }
    catch(error){
        next(error);
    }
}

const verifyEmail = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const userEmail = req.query.email as string;
        const userOtp = req.query.otp as string;
        if(!userEmail || !userOtp){
            throw new InvalidDataFormat("Email and OTP are required");
        }
        let user = await UserModel.findOne({email:userEmail});
        if(!user){
            throw new ResourceNotFoundError("User not found");
        }
        const storedOtp = await client.get(userEmail);
        if(!storedOtp){
            throw new ResourceNotFoundError("OTP expired. Please request a new one");
        }
        if(storedOtp !== userOtp){
            throw new InvalidDataFormat("Invalid OTP");
        }
        await client.del(userEmail);
        user.status = UserStatusEnum.APPROVED;
        await user.save();
        (res as any).sendSuccessResponse({email:userEmail},"Email verified successfully",200);
    }catch(error){
        next(error);
    }
}

const resendOtp = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const userEmail = req.query.email as string;
        if(!userEmail){
            throw new InvalidDataFormat("Email is required");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await client.set(userEmail, otp, {
            EX:180
        });
        console.log(`OTP for ${userEmail} is ${otp}`);
        (res as any).sendSuccessResponse({email:userEmail},"OTP resent successfully",200);
    }catch(error){
        next(error);
    }
}

const login = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const parsed = UserLoginSchema.safeParse(req.body);
        if(!parsed.success){
            throw new InvalidDataFormat("Invalid Payload",z.treeifyError(parsed.error));
        }
        let loginPayload = parsed.data;
        console.log("Login Payload: ",loginPayload);
        const user = await UserModel.findOne({email:loginPayload.email});
        
        if(!user){
            throw new ResourceNotFoundError("User not found");
        }else{
            const isPasswordValid = await bcrypt.compare(loginPayload.password, user.password);
            if(!isPasswordValid){
                throw new ResourceNotFoundError("Invalid email or password");
            }
            const jwtPayload ={
                id:user._id,
                email:user.email,
                role:user.role
            }
            const refreshTokenEntity = await UserRefreshTokenModel.findOne({userId:user._id});
            console.log("Refresh Token Entity: ",refreshTokenEntity);
            if(!refreshTokenEntity){
                const refreshToken = new UserRefreshTokenModel({
                    userId: user._id,
                    refreshToken: uuidv4(),
                })
                await refreshToken.save();
                res.cookie('refresh_token', refreshToken.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
            }
            const jwtToken = jwt.sign(jwtPayload, config.jwtSecret, {expiresIn:"1h"});
            res.cookie('jwt_token', jwtToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            (res as any).sendSuccessResponse({id:user._id},"User logged in successfully",200);
        }
    }catch(error){
        next(error);
    }
}

const refreshToken = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const refreshToken = req.cookies.refresh_token;
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new InvalidDataFormat("Invalid id format");
        }
        if(!refreshToken){
            throw new ResourceNotFoundError("Refresh token or userId not found");
        }
        const userRefreshToken = await UserRefreshTokenModel.findOne({userId});
        if(!userRefreshToken){
            throw new ResourceNotFoundError("Refresh token not registerd");
        }
        if(userRefreshToken.refreshToken !== refreshToken){
            throw new ResourceNotFoundError("Invalid refresh token");
        }
        const userData = await UserModel.findOne({_id:userId});
        if(!userData){
            throw new ResourceNotFoundError("User not found");
        }
        const jwtPayload = {
            id:userData._id,
            email:userData.email,
            role:userData.role
        }
        const jwtToken = jwt.sign(jwtPayload, config.jwtSecret, {expiresIn:"1h"});
        res.cookie('jwt_token', jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        (res as any).sendSuccessResponse({id:userData._id},"Token refreshed successfully",200);
    }catch(error){
        next(error);
    }
}

export default{
    registerUser,
    verifyEmail,
    resendOtp,
    login,
    refreshToken
}