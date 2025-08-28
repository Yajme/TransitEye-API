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


//Connect the database here
//supabase
db.initDatabase();


//Documentation must exist here:
app.get('/',(req,res)=>{
const existingEndpoint = 
  ["/api/location","/api/bus"]
;


res.json({message : "Documentation Must exist here", Placeholder : "this is only a place holder", status : "API UP"
, endpoints : existingEndpoint
});

});
app.get('/test',(req,res)=>{
  const timestamp = new Date().toISOString();
  res.json({message : "HTTP request success", status: 200, timestamp : timestamp});
})
app.use('/api',api);
app.get('/test/generate', async (req,res)=>{
  
  //check here if on PRODUCTION
  const isProd = process.env.NODE_ENVIRONMENT;
  if(isProd === 'PRODUCTION'){
    return res.json({message : "cannot process this end point, please try again later"});
  }
  const apiKey = makeid(16);
  const salt = makeid(5);

  //insert to table:

  const query = "INSERT INTO api_keys (key, salt) VALUES($1,$2);";
  await db.connection.query(query,[apiKey,salt]);
  

  //const timestamp = new Date()
  res.json({message : "api key successfully generated.", timestamp : new Date().toISOString(), key: apiKey});
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
  console.log(isProd);
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


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
