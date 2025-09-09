import logEvent from '#src/utils/logger';
import {LogLevel,EventType,sanitize} from '#src/utils/logger';

export const loggerMiddleware = async (req, res, next) => {
    // Store original end function
    const oldEnd = res.end;
    const oldJson = res.json;
    
    // Get start time
    const startTime = Date.now();

    // Add a flag to track if error middleware handled the request
    res.locals.errorHandled = false;

    // Override res.end
    res.end = function (chunk, encoding) {
        // Get response time
        const responseTime = Date.now() - startTime;
        
        // Call original end function
        oldEnd.apply(res, arguments);
         // Skip logging if error was already handled
        if (res.locals.errorHandled) {
            return;
        }

        // Skip logging if status code indicates error and errorHandler will handle it
        if (res.statusCode >= 400) {
            return;
        }

        // Map HTTP methods to event types
        const methodToEventType = {
            'GET': EventType.READ,
            'POST': EventType.CREATE,
            'PUT': EventType.UPDATE,
            'DELETE': EventType.DELETE
        };
        // put all req data to var data:
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
            eventType: methodToEventType[req.method] || EventType.INFO,
            LogLevel: LogLevel.INFO.code,
            message: `${req.method} ${req.originalUrl}`,
            action: req.method,
            //resourceType: req.baseUrl.split('/').pop(), // Gets resource type from URL
            request: request,
            status: res.statusCode,
            
        }
        // Log the request
        logEvent({
           type : EventType.INFO,
           message : `${req.method} ${req.originalUrl}`,
           data : data
        }).catch(error => console.error('Logging error:', error));
    };

    // Override res.json to capture response body
    res.json = function (body) {
        res.locals.responseBody = body;
        return oldJson.apply(res, arguments);
    };

    next();
};

// Error logging middleware
export const errorLoggerMiddleware = async (error, req, res, next) => {
    await logEvent({
        eventType: EventType.ERROR,
        LogLevel: LogLevel.ERROR.code,
        message: error.message,
        stack: error.stack,
        req: req,
        status: error.status || 500,
        data: {
            errorName: error.name,
            errorCode: error.code
        }
    }).catch(err => console.error('Error logging error:', err));

    next(error);
};