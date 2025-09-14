import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/Config";
import UnauthorizedRequest from "../errors/UnothorizedRequest";


export const JwtMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw new UnauthorizedRequest();
    }
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            throw new UnauthorizedRequest();
        }
        next();
    });
}