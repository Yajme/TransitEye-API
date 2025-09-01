import logEvent from '#src/utils/logger';
import HttpStatus from '#src/utils/http-status-codes';
export const errorHandler = (err, req, res, next) => {  
  
    logEvent({
            req : req,
            res : res,
            status : err.status,
            message : err.message,
            stack : err.stack,

       data: {
            ...err.data }


    })
  
    res.status(err.status || 500).json({
        message: err.message,
        data : !isProd ? err.data : undefined,
        stack: !isProd ? err.stack : undefined,
        status: err.status
    });
}

//catches non existent url
export const notFoundHandler = (req, res, next) => {
    const requestedURL = req.url;
    const error = new Error('Wrong URL ' + requestedURL + " is not existent");
    error.status = HttpStatus.NOT_FOUND; 
    
    next(error); // Pass the error to the error-handling middleware.
};