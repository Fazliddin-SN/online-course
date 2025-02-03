import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/dbConnect.js";
import { errorHandler } from "./middlewares/errorHandling.js";
import { apiRouter } from "./routes/index.js";

// geting instance from express
const app = express();

// dotenv instance from config();
const env = dotenv.config();
app.use(express.json());
app.use(cors());

// connect the server
connectDB();

app.use((req, res, next) => {
  console.time("middleware");
  console.log({
    method: req.method,
    url: req.url,
  });

  next();
  console.timeEnd("middleware");
});

// use api endpoint for all routes
app.use("/api", apiRouter);

// global error handling
app.use(errorHandler);

//running the server
const port = process.env.PORT || 7004;
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
