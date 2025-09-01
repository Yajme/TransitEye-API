import  UserError  from "#src/utils/userException";
import db from '#src/configs/db';
import { sha256 } from "js-sha256";
import User from "#src/models/user";




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
    AuthenticateUser
}
