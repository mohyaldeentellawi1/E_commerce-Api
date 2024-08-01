const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config({ path: 'config.env'});  
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const productRoute = require('./routes/productRoute');
const brandsRoute = require('./routes/brandRoute');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');

const ApiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware');

// express app
const app = express();

// Database Connection
dbConnection();

// Middlewares
app.use(express.json()); // for parsing json data
app.use(express.static(path.join(__dirname, 'uploads'))); // for serving static files
if(process.env.NODE_ENV === 'development') {
app.use(morgan('dev')); // Request logger
console.log(`mode : ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subCategory", subCategoryRoute);
app.use('/api/v1/brands',brandsRoute);
app.use('/api/v1/products',productRoute);
app.use('/api/v1/users',userRoute);
app.use("/api/v1/auth", authRoute);



//create error middleware for invalid route
app.all('*',(req,res,next)=>{
next(new ApiError(`Can't find this route ${req.originalUrl} on this server`, 400));
});

// Global Error Handler Middleware for express
app.use(globalError);

const PORT = process.env.PORT; 
const server =  app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});

// Handle rejection error outside of express
process.on('unhandledRejection', (error) => {
console.error(`unhandledRejection error: ${error.name} | ${error.message}`);
server.close(() => {
console.error('Shutting down...');
process.exit(1);
});
})