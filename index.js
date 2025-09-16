//TransitEye-API 

//npm packages
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//configs
import firebase from '#src/configs/firebase';
import db from '#src/configs/db';

// routes
import api from '#src/routes/index';
import test from '#src/routes/test';

// utils
import HttpStatus from '#src/utils/http-status-codes';
import mqttClient from '#src/utils/mqtt';
//middlewares
import { apiKeyValidation } from '#src/middlewares/authMiddleware';
import { errorHandler, notFoundHandler } from '#src/middlewares/errorHandler';
import { log } from '#src/utils/logger';
import formatResponse from '#src/middlewares/formatResponse';
import { loggerMiddleware, errorLoggerMiddleware } from '#src/middlewares/loggerMiddleware';

//app initialization
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
 

//Connect the database(s) here

//supabase
db.initDatabase();
//Firebase
firebase.initializeFirebase();

// Prevent the error by responding to /favicon.ico requests with an empty response
app.get('/favicon.ico', (req, res) => res.status(HttpStatus.NO_CONTENT).end());
app.get('/favicon.png', (req, res) => res.status(HttpStatus.NO_CONTENT).end());

app.use(loggerMiddleware);
app.use(formatResponse);

// /api endpoint
app.use('/api',apiKeyValidation,api);

// /test endpoint
app.use('/test',test)



// Initialize MQTT after database connections
mqttClient.setupMQTTSubscriptions();


//Documentation must exist here:
app.get('/',async (req,res)=>{
const authHeader = req.headers["authorization"];
console.log(authHeader);
  console.log("Host header:", req.get("host"));    // e.g. example.com:3000
  console.log("Hostname only:", req.hostname);     // e.g. example.com
  console.log("Protocol:", req.protocol);          // http or https
  console.log("Full URL:", req.protocol + "://" + req.get("host") + req.originalUrl); 



  const existingEndpoint = 
  [
    "/api/location",
    "/api/bus",
    "/api/user"
  ];


 
  res.json({
    message : "Documentation Must exist here", 
    Placeholder : "this is only a place holder", 
    status : "API UP", 
    endpoints : existingEndpoint
  });

});

//Handle cron job 
//
app.get('/activate',(req,res,next)=>{
  try {
    const password = process.env.CRON_JOB_PASSWORD;
    const key = req.query.key;
    

    if(!password){
      throw new Error('Internal Server Error');
    }


    if (password !=== key){
      throw new Error('Internal Server Error');
    }


    res.json({message : "OK"});
  } catch (error ) {
    throw error;
  }
})


//catches non-existing urls
app.use(notFoundHandler);
//handles error
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  
  log(`${process.env.APP_NAME || "Express API"} listening on port ${PORT} (${process.env.NODE_ENVIRONMENT})`);
});



