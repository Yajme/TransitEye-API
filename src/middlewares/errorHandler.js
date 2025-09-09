import logEvent from '#src/utils/logger';
import { EventType,sanitize,LogLevel } from '#src/utils/logger';
import HttpStatus from '#src/utils/http-status-codes';
import dotenv from 'dotenv';

dotenv.config();
//handle custom exceptions
// marginalize the req data such as headers and env
const isProd = process.env.NODE_ENVIRONMENT === 'PRODUCTION' ? true : false;
export const errorHandler = async (err, req, res, next) => {  
    res.locals.errorHandled = true;

    const statusCode = err.status || 500;
    const request = {
                client :{
                    ip: req.ip,
                    userAgent: req.headers['user-agent'],
                    referrer: req.headers['referer'] || null,
                    headers: req.headers,
                },
                method: req.method,
                url: req.url,
                hostname: req.hostname,
                query: req.query,
                body: sanitize(req.body) || null,
                protocol: req.protocol,
            }
            const data  = {
                eventType:statusCode >= 500 ? EventType.ERROR : EventType.WARN,
                LogLevel: statusCode >= 500 ? LogLevel.ERROR.code : LogLevel.WARN.code,
                message: `${req.method} ${req.originalUrl}`,
                action: req.method,
                //resourceType: req.baseUrl.split('/').pop(), // Gets resource type from URL
                request: request,
                status: res.statusCode,
                
            }
    await logEvent({
        data : data,
        type : statusCode >= 500 ? EventType.ERROR : EventType.WARN,
        message : err.message,
        error : {
            message : err.message,
            code : err.name,
            details : err.details || {},
            stack : err.stack,
            status : statusCode
        }
    })
  
   
    
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || 'Internal Server Error',
        error: {
            code: err.name,
            details: err.details || {}
        },
        timestamp: new Date().toISOString()
    });
}

//catches non existent url
export const notFoundHandler = (req, res, next) => {
    const requestedURL = req.url;
    const error = new Error('Wrong URL ' + requestedURL + " is not existent");
    error.status = HttpStatus.NOT_FOUND; 
    next(error); // Pass the error to the error-handling middleware.
};
