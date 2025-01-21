/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");

const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");
const mountRoute = require("./routes/index");
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const { webhookCheckout } = require("./services/orderServices");

// express app
const app = express();

// CORS Enable another domains to access this server
app.use(cors());
app.options("*", cors());

// Compress All Responses
app.use(compression());

// Webhook Checkout Session.
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// Database Connection
dbConnection();

// Middlewares
app.use(express.json({ limit: "20kb" })); // for parsing json data and set size limit to 20kb
app.use(express.static(path.join(__dirname, "uploads"))); // for serving static files
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Request logger
  console.log(`mode : ${process.env.NODE_ENV}`);
}

// To Apply Data Sanilization against NoSQL Query Injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(
  hpp({
    whitelist: [
      "quantity",
      "sold",
      "price",
      "priceAfterDiscount",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

// Mount Routes
mountRoute(app);

//create error middleware for invalid route
app.all("*", (req, res, next) => {
  next(
    new ApiError(`Can't find this route ${req.originalUrl} on this server`, 400)
  );
});

// Global Error Handler Middleware for express
app.use(globalError);

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle rejection error outside of express
process.on("unhandledRejection", (error) => {
  console.error(`unhandledRejection error: ${error.name} | ${error.message}`);
  server.close(() => {
    console.error("Shutting down...");
    process.exit(1);
  });
});
