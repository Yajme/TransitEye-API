const formatResponse = (req, res, next) => {
    res.sendResponse = (data, message = 'Success', statusCode = 200) => {
        return res.status(statusCode).json({
            success: statusCode >= 200 && statusCode < 300,
            status: statusCode,
            message: message,
            data: data,
            timestamp: new Date().toISOString()
        });
    };
    next();
};

export default formatResponse;