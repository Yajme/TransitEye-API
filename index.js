import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '#src/config/db';
import api from '#src/routes/api';

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

});
app.get('/test',(req,res)=>{
  const timestamp = new Date().toISOString();
  res.json({message : "HTTP request success", status: 200, timestamp : timestamp});
})
app.use('/api',api);

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
        stack: isProd ==='false' ? err.stack : undefined,
        status: err.status
    });
});

const isProd = process.env.PRODUCTION ?? 'false';
const PORT = process.env.PORT;
app.listen(PORT,()=>{

    console.log(`Now listening on http://localhost:${PORT}`);

});
