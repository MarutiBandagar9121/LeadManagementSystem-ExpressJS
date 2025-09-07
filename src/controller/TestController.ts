import { type Request, type Response} from 'express';  

const hello = (req:Request,res:Response) =>{
    res.send("Hello, from test controller");
}

export default {
  hello,
};