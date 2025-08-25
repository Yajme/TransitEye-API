import express from 'express';
import database from '#src/config/db';
import { Bus } from '#src/model/bus';
const router = express.Router();



router.post('/',async (req,res,next)=>{
  const bus_id = req.body.bus_id;
  const geolocation = {
    latitude : req.body.geolocation.latitude,
    longtitude : req.body.geolocation.longtitude
  };
  const timestamp  = new Date().toISOString();

  //insert the data here
  //to the database
  const bus_status = new Bus(bus_id,geolocation,timestamp,0);

  await bus_status.InsertData(database.connection);

  res.json({message : "data inserted"});
});
router.get('/',(res,req,next)=>{





});




export default router;
