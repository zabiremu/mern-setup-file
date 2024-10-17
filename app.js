const express = require("express");
const router = require("./src/routes/api");
const app = new express();

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotENV = require("dotenv");
const multer = require("multer");
const {
  DefaultErrorHandler,
  NotFoundError,
} = require("./src/utility/ErrorHandler");
dotENV.config();

let URL = process.env.DATABASE_URL;

mongoose
  .connect(URL)
  .then((res) => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.APP_URL,
  })
);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json({ limit: process.env.MAX_JSON_SIZE }));
app.use(
  express.urlencoded({ limit: process.env.MAX_JSON_SIZE, extended: true })
);

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT,
  max: process.env.RATE_LIMIT_MAX,
});
app.use(limiter);

app.use("/api", router);

//Not Found Error Handler
app.use(NotFoundError);

// Default Error Handler
app.use(DefaultErrorHandler);

module.exports = app;
