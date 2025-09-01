import express from 'express';
import db from '#src/configs/db';
import { sha256 } from 'js-sha256';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const isProd = process.env.NODE_ENVIRONMENT === 'PRODUCTION' ? true : false;

//testing purposes might be unavailable in production
router.get('/', async (req,res,next)=>{
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
    timestamp : timestamp,
    request : req.ip
  });
})

router.get('/generate', async (req,res,next)=>{
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
    return next();
  }
  const apiKey = sha256(makeid(16));
  const salt = makeid(5);

  //insert to table:

  const query = "INSERT INTO api_keys (key, salt) VALUES($1,$2);";
  await db.connection.query(query,[apiKey,salt]);
  

  
  res.json({
    message : "api key successfully generated.", 
    timestamp : new Date().toISOString(), 
    key: apiKey
  });
})

router.post('/device',(req,res,next)=>{
  
  res.json({message : "OK",body : req.body});
})

router.post('/auth',(req,res,next)=>{

});
export default router;
