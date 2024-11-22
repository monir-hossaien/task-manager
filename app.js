import express from "express";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import mongoose from "mongoose";
import helmet from 'helmet';
import router from './routes/api.js';
import {DATABASE, MAX_JSON_SIZE, REQUEST_NUMBER, REQUEST_TIME, WEB_CACHE} from "./app/config/config.js";

const app = express();

//app level middleware
app.use(express.json({limit: MAX_JSON_SIZE}));
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(helmet());


//app use limiter setup
const limiter = rateLimit({windowMs:REQUEST_TIME,max:REQUEST_NUMBER});
app.use(limiter);

// Cache
app.set('etag',WEB_CACHE)

//database connect
mongoose.connect(DATABASE)
    .then(()=>{
        console.log("MongoDB Connected");
    })
    .catch((err)=>{
        console.log(err.toString());
    })

//router setup
app.use("/api", router);



export default app;