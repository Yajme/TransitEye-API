import express from 'express';

const router = express.Router();
router.get('/all',(req,res,next)=>{
	res.send('all bus geolocation');
});
router.get('/:bus_id',(req,res,next)=>{

    const bus_id = req.params.bus_id;
	if(!bus_id) {
		return res.status(404).json({message : "bus id is not found",status : 404});
	}	
	//check if the bus id is valid in database
	if(!Number(bus_id)){
		return res.status(501).json({message : "error", error : "bus id is not valid"});
	}
	//retrieve the latest gps coordinates in the database here:
	const example_location = {
		latitude : 50.459445,
		longtitude: 0.348753
	}
	const geolocation = example_location;



	res.json({
		timestamp : new Date(Date.now()).toISOString(),
		coordinates : geolocation, 
		status : 200, 
		message : "geolocation retrieved",
		bus_id: bus_id
	});
});





export default router;
