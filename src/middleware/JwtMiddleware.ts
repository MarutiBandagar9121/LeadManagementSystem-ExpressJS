import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/Config";
import UnauthorizedRequest from "../errors/UnothorizedRequest";


export const JwtMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.cookies.jwt_token;
        // console.log("JWt Token from cookies in JwtMiddleware: ", token);
        if (!token) {
            throw new UnauthorizedRequest();
        }
        
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, config.jwtSecret, (err:any, decoded:any) => {
                if (err) {
                    reject(new UnauthorizedRequest());
                } else {
                    resolve(decoded);
                }
            });
        });
        // console.log("Decoded JWT: ", decoded);
        (req as any).user = decoded;
        next();
    } catch (error) {
        next(error);
    }
}