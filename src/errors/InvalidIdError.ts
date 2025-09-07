class InvalidIdError extends Error {
  public code = "INVALID_ID";
  public statusCode = 400;
  
  constructor(message: string = 'Invalid ID provided') {
    super(message);
    this.name = 'InvalidIdError';
  }
}

export default InvalidIdError;