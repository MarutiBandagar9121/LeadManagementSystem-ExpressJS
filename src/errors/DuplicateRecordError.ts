import ErrorCodesEnum from "../constants/ErrorCodesEnum";
class DuplicateRecordError extends Error{
    public code = ErrorCodesEnum.DUPLICATE_RECORD;
    public statusCode = 400;
    public details:any="";

    constructor(message: string = 'Dupliacte record found',details?:any) {
        super(message);
        this.name = 'DuplicateRecordError';
        this.details = details;
    }
}
export default DuplicateRecordError;