import express from 'express';
import { UserError } from '#src/module/userException';
import { Query } from 'pg';
const router = express.Router();
router.post('/',(req,res,next)=>{

  try {
    const bus_id = req.body.bus_id;
    const geolocation = {
    latitude : req.body.geolocation.latitude,
    longtitude : req.body.geolocation.longtitude
  };
  const timestamp  = new Date().toISOString();

  //data validation here 
  if(!Number(bus_id)){
    throw new UserError('Invalid bus id',406,{query : "Updating bus status but client device has invalid bus id", bus_id : bus_id});
  }
  if(!Number(geolocation.latitude) || !Number(geolocation.longtitude)){
    throw new UserError('Invalid geolocation coordinates',406,{query : "Updating bus status but client device has invalid geolocation",bus_id: bus_id, geolocation :geolocation});
  }

  //insert the data here
  //to the database


  } catch (error) {
    next(error);
  }
  res.json({bus_id : bus_id, geolocation : geolocation, timestamp : timestamp});
});
router.get('/',(res,req,next)=>{





});




export default router;
