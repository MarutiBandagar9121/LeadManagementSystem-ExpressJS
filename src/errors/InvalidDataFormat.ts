import ErrorCodesEnum from "../constants/ErrorCodesEnum";
class InvalidDataFormat extends Error{
    public code = ErrorCodesEnum.INVALID_DATA_FORMAT;
    public statusCode = 400;
    public details:any="";

    constructor(message: string = 'Invalid data provided',details?:any) {
        super(message);
        this.name = 'InvalidDataFormat';
        this.details = details;
    }
}
export default InvalidDataFormat;