import express from 'express';
import db from '#src/config/db';
import Bus from '#src/model/bus';
import UserError  from '#src/module/userException';
import HttpStatus from '#src/utils/http-status-codes';

// /api/location
const router = express.Router();



//Documentation must exist here:
router.get('/',(req,res,next)=>{
  res.json({message : "api endpoint for gps location"});
})


//Getting all the geolocation
//filters must be applied
//api key is mandatory
router.get('/all',(req,res,next)=>{
	res.status(HttpStatus.NOT_IMPLEMENTED).send('all bus geolocation');
});
//endpoint for retrieving geolocation
router.get('/:bus_id',async (req,res,next)=>{

    try {
		const bus_id = req.params.bus_id;
		
		//check if the bus id is valid 
		if(!bus_id || !Number(bus_id)) {
			throw new UserError('Invalid Bus ID,',HttpStatus.BAD_REQUEST,{bus_id:bus_id});
		}	
		//retrieve the latest gps coordinates in the database here:
		const location = new Bus(bus_id,db.connection);
		const current_location = await location.fetchCurrentStatus();
		if(current_location.length < 1){
			throw new UserError(`No record found for bus no: ${bus_id}`,HttpStatus.NOT_FOUND,{bus_id: bus_id});

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
});





export default router;
