const AppError = require('..//utils/apiError');

const handleJwtInvalidSignature = () => new AppError('Invalid Token. Please login again', 401);


const globalError = (error,req,res,next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(error,res);
    }  else {
        if(error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'){
            error = handleJwtInvalidSignature();
        }
        sendErrorProd(error,res);
    }
};

const sendErrorDev = (error,res) => {
    return res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack
    });
};
const sendErrorProd = (error,res) => {
    return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
};



module.exports = globalError;
