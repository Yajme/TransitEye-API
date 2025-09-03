import express from 'express';
import location from '#src/controllers/locationController';


// /api/location
const router = express.Router();

//Documentation must exist here:
router.get('/',(req,res,next)=>{
  res.json({message : "api endpoint for gps location"});
})


//Getting all the geolocation
//filters can be applied
router.get('/all',location.getAllLocation);
//endpoint for retrieving geolocation
router.get('/:bus_id',location.getLocation);





export default router;
