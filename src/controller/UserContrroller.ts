import { NextFunction, type Request, type Response} from 'express'; 

const registerUser = (req:Request,res:Response, next:NextFunction)=>{
    res.send("User registered")
}

export default{
    registerUser
}