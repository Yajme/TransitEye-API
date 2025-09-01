import  UserError  from "#src/utils/userException";
import db from '#src/configs/db';

export const apiKeyValidation = async (req,res,next) =>{
    try {
        const apiKey = req.query.key;

        if(!apiKey){
            throw new UserError('Invalid API Key',404,{query : "User wants to access /user endpoint but didn't provide any api key"});
        }
          //check here if api key is existing in the database;
          const query = 'SELECT id FROM api_keys WHERE key = $1 AND deleted_at IS NULL';

          const response = await db.connection.query(query,[apiKey]);
         
          if(response.rowCount < 1){
            throw new UserError('Invalid API Key, please try again later.',401,{query : "User wants to access /user endpoint but provided an non-existing API Key", api_key : apiKey});
          }

          next();
        
    } catch (error) {
        next(error);
    }
};