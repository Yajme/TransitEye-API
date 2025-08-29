import express from 'express';
import database from '#src/config/db';
import Bus from '#src/model/bus';
import UserError from '#src/module/userException';
import HttpStatus from '#src/utils/http-status-codes';

const router = express.Router();


// /api/bus

//Documentation must exist here:
router.get('/',(req,res,next)=>{
  res.status(HttpStatus.NOT_IMPLEMENTED).json({message : "default endpoint for /api/bus"});
});

//endpoint for receiving geolocation
router.post('/',async (req,res,next)=>{
  try {
    const bus_id = Number(req.body.bus_id);
    const geolocation = {
    latitude : req.body.geolocation.latitude,
    longtitude : req.body.geolocation.longtitude
  };
   const passenger_count = Number(req.body.passenger_count);
  const timestamp  = new Date().toISOString();
  //Data Validation here
  if(!Number.isInteger(bus_id) || bus_id <= 0){
    throw new UserError(
      'Bus ID must be a positive integer',
      HttpStatus.BAD_REQUEST,
      {
        bus_id : bus_id
      }
    );
  }
  if(!Number(geolocation.latitude) || !Number(geolocation.longtitude)){
    throw new UserError(
      'Invalid geolocation, please try again later.',
      HttpStatus.BAD_REQUEST,
      {
        body : req.body
      }
    );
  }
  if(!Number.isInteger(passenger_count) || passenger_count <= 0){
    throw new UserError(
      'Passenger count must be a positive integer',
      HttpStatus.BAD_REQUEST,
      {
        body : req.body
      }
    );
  }
  //insert the data here
  //to the database
  const bus_status = new Bus(bus_id,geolocation,timestamp,passenger_count);

  await bus_status.insertData(database.connection);

  res
  .status(HttpStatus.CREATED)
  .json(
    { 
      message: "Bus status recorded successfully",
      bus_id: bus_id,
      timestamp: timestamp
    }
  );
  } catch (error) {
    next(error);
  }
});

//get the current passenger count with coordinates
router.get('/:bus_id', async (req,res,next)=>{
  try {
  const bus_id = Number(req.params.bus_id);
  console.log(bus_id);
  if(!Number.isInteger(bus_id) || bus_id <= 0){
    throw new UserError('Bus ID must be a positive integer',HttpStatus.BAD_REQUEST);
  }
  const bus = new Bus(bus_id,database.connection);
  const current_passenger = await bus.fetchCurrentStatus();
  if(!current_passenger.length){
    throw new UserError('no record found',HttpStatus.NOT_FOUND,{body : req.body});
  } 
  res
  .status(HttpStatus.OK)
  .json({
    message : "Passenger count retrieved successfully",
    bus_id: bus_id,
    passenger_count : current_passenger[0].passenger_count,
    timestamp : new Date().toISOString()
  });

  } catch (error) {
    next(error);
  }


});




export default router;
