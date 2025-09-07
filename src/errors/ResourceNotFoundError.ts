import ErrorCodesEnum from "../constants/ErrorCodesEnum";

class ResourceNotFoundError extends Error{
    public code = ErrorCodesEnum.NOT_FOUND;
    public statusCode = 404;
    public details:any="";

    constructor(message: string="Resource not found",details?:any) {
        super(message);
        this.name = "ResourceNotFoundError";
    }

}

export default ResourceNotFoundError;