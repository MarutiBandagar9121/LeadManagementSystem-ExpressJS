import ErrorCodesEnum from "../constants/ErrorCodesEnum";
class UnauthorizedRequest extends Error{
    public code = ErrorCodesEnum.UNAUTHORIZED_REQUEST;
    public statusCode = 401;
    public details:any="";

    constructor(message: string = 'Unauthorized request',details?:any) {
        super(message);
        this.name = ErrorCodesEnum.UNAUTHORIZED_REQUEST;
        this.details = details;
    }
}
export default UnauthorizedRequest;