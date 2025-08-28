import { UserError } from "#src/module/userException";
import db from '#src/config/db';
import { sha256 } from "js-sha256";
import User from "#src/model/user";
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
    const {username,password} = req.body;
    const user = new User(username,password);
    const credentials = await user.fetchCredentials(db.connection);
   

    const hashedPassword = sha256(password+credentials[0].salt);
    if(hashedPassword !== credentials[0].password){
      throw new UserError('Invalid password',401,{username : username});
    }

    res.json({message : "OK",credentials : credentials});
  } catch (error) {
    next(error);
  }
}

export default { 
    apiKeyValidation,
    test,
    AuthenticateUser
}
