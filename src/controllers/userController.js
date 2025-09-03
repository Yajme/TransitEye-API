import db from '#src/configs/db';
import { sha256 } from "js-sha256";
import User from "#src/models/user";
import { AuthError,ValidationError } from "#src/errors/index";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const AuthenticateUser = async (req,res,next)=>{
  try {
    const {username,password} = req.body;
    if(!username || !password){
      throw new ValidationError("Invalid password or username");
    }
    const users = new User(username,password);
    const credentials = await users.fetchCredentials(db.connection);
    if(credentials.length === 0){
      throw new AuthError("No match found",{username : username});
    }
    
    const hashedPassword = sha256(password+credentials[0].salt);
    if(hashedPassword !== credentials[0].password){
      throw new AuthError('Invalid password',{username : username});
    }
    const user = {
      id : credentials[0].id,
      username : username
    }
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign(user,SECRET_KEY,{expiresIn : "24h"});
    res.json({message : "Login Successful",user : user,token : token});
  } catch (error) {
    next(error);
  }
}

const addDriver = async (req,res,next)=>{
  try {
    
  } catch (error) {
    
  }
}

const addUnit = async (req,res,next)=>{
  try {
    
  } catch (error) {
    
  }
}
export default { 
    AuthenticateUser,
    addDriver,
    addUnit
}
