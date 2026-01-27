class ErrorHandler extends Error {
  constructor(message, statusCode) { // Accept message and statusCode as parameters and message
    super(message); // Call the parent class constructor with the message and parent class is Error
    this.statusCode = statusCode; // Set the status code

    Error.captureStackTrace(this, this.constructor);
  }
}
export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || 'Internal Server Error';
  err.statusCode = err.statusCode || 500;

  if(err.code === 11000){
    const message = `Duplicate field value entered`
   err = new ErrorHandler(message, 400);
}
   
  if(err.name === 'JsonWebTokenError'){
    const message = `Json Web Token is invalid, try again`;
   err = new ErrorHandler(message, 400);
};

    if(err.name === 'TokenExpiredError'){
    const message = `Json Web Token is expired, try again`;
   err = new ErrorHandler(message, 400);
}
//errors may have multiple messages as it is an object so hmne object values use kiya hai and 
// further mapped with value to get individual messages
const errorMessage = err.errors
                    ?Object.values(err.errors)
                    .map(value=>value.message).join(' ')
                    : err.message;
                    
        return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
        });
};
export default ErrorHandler;
//200 OK
//201 Created
//400 Bad Request
//401 Unauthorized
//403 Forbidden
//404 Not Found
//500 Internal Server Error