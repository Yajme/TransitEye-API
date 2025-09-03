import database from '#src/configs/db';
import Bus from '#src/models/bus';
import UserError from '#src/utils/userException';
import HttpStatus from '#src/utils/http-status-codes';
import { NotFoundError, ValidationError } from '#src/errors/index';



const receiveLocation = async (req,res,next)=>{
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
    throw new ValidationError(
      'Bus ID must be a positive integer',
      {
        bus_id : bus_id
      }
    );
  }
  if(!Number(geolocation.latitude) || !Number(geolocation.longtitude)){
    throw new ValidationError(
      'Invalid geolocation, please try again later.',
      {
        body : req.body
      }
    );
  }
  if(!Number.isInteger(passenger_count) || passenger_count <= 0){
    throw new ValidationError(
      'Passenger count must be a positive integer',
      {
        body : req.body
      }
    );
  }
  //insert the data here
  //to the database
  const bus_status = new Bus(bus_id,geolocation.latitude,geolocation.longtitude,timestamp,passenger_count);

  //What if the bus status did not insert?
  //what are the approach to this?
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
}

const getAllBus =  async (req,res,next)=>{
  try {
    const bus = new Bus(0,database.connection);
    const buses = await bus.getAll();
    if(buses.length === 0){
      throw new NotFoundError('No Records Found');
    }
    res
    .status(HttpStatus.OK)
    .json(
      {
        message : "Buses successfully fetched",
        records :  buses
      });
  } catch (error) {
    next(error);
  }
}

const getCurrentStatus = async (req,res,next)=>{
  try {
  const bus_id = Number(req.params.bus_id);
  if(!Number.isInteger(bus_id) || bus_id <= 0){
    throw new UserError('Bus ID must be a positive integer',HttpStatus.BAD_REQUEST);
  }
  const bus = new Bus(bus_id,database.connection);
  const current_passenger = await bus.fetchCurrentStatus();
  if(!current_passenger.length){
    throw new NotFoundError('no record found',{body : req.body});
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


}
const documentation = (req,res,next)=>{
  const endpoints =[
    {endpoint : "/api/bus",method : "POST", required_fields :["latitude","longtitude","bus number","passenger count"]},
    {endpoint :"/api/bus/{bus_id}", method : "GET"},
    {endpoint : "/api/bus/all", method : "GET", description: "Get all buses status"}

  ]
  res.status(HttpStatus.NOT_IMPLEMENTED).json({message : "default endpoint for /api/bus", endpoints : endpoints});
}
export default {
    documentation,
    receiveLocation,
    getAllBus,
    getCurrentStatus
}