import { UserError } from "#src/module/userException";
import db from '#src/config/db';


const apiKeyValidation = async (req,res,next) =>{
    try {
        const apiKey = req.query.key;
        console.log(apiKey);
        console.log(req.query);
        if(!apiKey){
            throw new UserError('Invalid API Key',404,{query : "User wants to access /user endpoint but didn't provide any api key"});
        }
          //check here if api key is existing in the database;
          const query = 'SELECT id FROM api_keys WHERE key = $1 AND deleted_at IS NULL';

          const response = await db.connection.query(query,[apiKey]);
          console.log(response);
          if(response.rowCount < 1){
            throw new UserError('Invalid API Key, please try again later.',401,{query : "User wants to access /user endpoint but provided an non-existing API Key", api_key : apiKey});
          }

          next();
        
    } catch (error) {
        next(error);
    }
};

const test = (req,res,next)=>{
  try {
   res.json({message : "OK"}); 
  } catch (error) {
    next(error);
  }
}


const AuthenticateUser = async (req,res,next)=>{
  try {
    
  } catch (error) {
    next(error);
  }
}

export default { 
    apiKeyValidation,
    test
}
