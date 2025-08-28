import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '#src/config/db';
import api from '#src/routes/index';

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));


//Connect the database(s) here
//supabase
db.initDatabase();


// /api endpoint
app.use('/api',api);

//Documentation must exist here:
app.get('/',(req,res)=>{
   console.log("Host header:", req.get("host"));    // e.g. example.com:3000
  console.log("Hostname only:", req.hostname);     // e.g. example.com
  console.log("Protocol:", req.protocol);          // http or https
  console.log("Full URL:", req.protocol + "://" + req.get("host") + req.originalUrl); 
const existingEndpoint = 
  [
    "/api/location",
    "/api/bus",
    
  ];


res.json({
  message : "Documentation Must exist here", 
  Placeholder : "this is only a place holder", 
  status : "API UP", 
  endpoints : existingEndpoint
});

});

//testing purposes might be unavailable in production
app.get('/test', async (req,res)=>{
  //if this is accessed in production:
  //we should check if request has api key
  const api_key = req.query.key;
   //check if api key exists in our database:
  if(isProd){
    if(!api_key) next();
    const query = 'SELECT id FROM api_keys WHERE key = $1 AND deleted_at IS NULL';
    const response = await db.connection.query(query,[api_key]);
    if(response.rowCount < 1) {
      res.json({message : "Invalid API key, please try again later", status : 401});
    }
  }
  const timestamp = new Date().toISOString();
  res.json({
    message : "HTTP request success", 
    status: 200, 
    timestamp : timestamp
  });
})

app.get('/test/generate', async (req,res)=>{
  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

  //check here if on PRODUCTION
  const isProd = process.env.NODE_ENVIRONMENT;
  if(isProd === 'PRODUCTION'){
    next();
  }
  const apiKey = makeid(16);
  const salt = makeid(5);

  //insert to table:

  const query = "INSERT INTO api_keys (key, salt) VALUES($1,$2);";
  await db.connection.query(query,[apiKey,salt]);
  

  //const timestamp = new Date()
  res.json({
    message : "api key successfully generated.", 
    timestamp : new Date().toISOString(), 
    key: apiKey
  });
})

app.post('/test/device',(req,res,next)=>{
  console.log(req.body);
  res.json({message : "OK",body : req.body});
})
//catches non existent url
app.use((req, res, next) => {
    const requestedURL = req.url;
    const error = new Error('Wrong URL ' + requestedURL + " is not existent");
    error.status = 404; // You can set the status to 404 or any other appropriate status code.
    
    next(error); // Pass the error to the error-handling middleware.
});

app.use((err, req, res, next) => {  
    /*logEvent({

            message : err.message,
            stack : err.stack,

       data: {
            ...err.data }


    })*/
  
    res.status(err.status || 500).json({
        message: err.message,
        data : !isProd ? err.data : undefined,
        stack: !isProd ? err.stack : undefined,
        status: err.status
    });
});

const isProd = process.env.NODE_ENVIRONMENT === 'PRODUCTION' ? true : false;
const PORT = process.env.PORT;
app.listen(PORT,()=>{

    console.log(`Now listening on http://localhost:${PORT}`);

});


