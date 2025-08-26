import express from 'express';
import database from '#src/config/db';
import { Bus } from '#src/model/bus';
//import location from '#src/routes/bus';
const router = express.Router();


// /api/bus
router.post('/',async (req,res,next)=>{
  const bus_id = req.body.bus_id;
  const geolocation = {
    latitude : req.body.geolocation.latitude,
    longtitude : req.body.geolocation.longtitude
  };
  const timestamp  = new Date().toISOString();
  //Data Validation here




  //insert the data here
  //to the database
  const bus_status = new Bus(bus_id,geolocation,timestamp,0);

  await bus_status.InsertData(database.connection);

  res.json({message : "data inserted"});
});

router.get('/',(req,res,next)=>{
  res.json({message : "default endpoint for /api/bus"});
})
router.get('/:bus_id',(req,res,next)=>{

const bus_id = req.params.bus_id;


  res.json({bus_id: bus_id});



});




export default router;
