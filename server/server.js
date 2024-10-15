import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import route from "../server/routes/userRoute.js";
import path from "path";

const app = express();
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dotenv.config();

const PORT = process.env.PORT || 5001;
const URL = process.env.MONGOURL;

mongoose
  .connect(URL)
  .then(() => {
    console.log("DB connnected successfully");
    app.listen(PORT, () => {
      console.log(`Server is Running on port: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

app.use("/api/", route);
