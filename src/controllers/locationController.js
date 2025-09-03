import db from '#src/configs/db';
import Bus from '#src/models/bus';
import HttpStatus from '#src/utils/http-status-codes';
import { NotFoundError, ValidationError } from '#src/errors/index';



const getAllLocation = async (req,res,next)=>{
	try {
        //Object initializing
        //On this case we are not specifiying the bus number
        //That is why bus id is set to 0
		const bus = new Bus(0,db.connection);
		const buses = await bus.getAllLocations();
        //No Record Found
		if(buses.length === 0){
			throw new NotFoundError('No Record Found');
		}

		res
		.status(HttpStatus.OK)
		.json({
			message : "Location Fetched Successfully",
			records : buses
		});
	} catch (error) {
		next(error);
	}
}

const getLocation = async (req,res,next)=>{
//maybe i should also implement the use of api key here.
  //but the checking of the api key should be a universal middleware
  //not a function that is exclusive to this route 
    try {
		const bus_id = req.params.bus_id;
		
		//check if the bus id is valid 
		if(!bus_id || !Number(bus_id)) {
			throw new ValidationError('Invalid Bus ID,',HttpStatus.BAD_REQUEST,{bus_id:bus_id});
		}	
		//retrieve the latest gps coordinates in the database here:
		const location = new Bus(bus_id,db.connection);
		const current_location = await location.fetchCurrentStatus();
		if(current_location.length < 1){
			throw new NotFoundError(`No record found for bus no: ${bus_id}`,HttpStatus.NOT_FOUND,{bus_id: bus_id});

		}
		const geolocation = {
			latitude: current_location[0].latitude,
			longtitude : current_location[0].longtitude
		};



		res.json({
			timestamp : current_location[0].created_at,
			coordinates : geolocation, 
			status : 200, 
			message : "geolocation retrieved",
			bus_id: bus_id
		});
	} catch (error) {
		next(error);
	}
}

export default {
    getAllLocation,
    getLocation
}