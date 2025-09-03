import express from 'express';
import bus from '#src/controllers/busController';

const router = express.Router();
// /api/bus

//Documentation must exist here:
router.get('/',bus.documentation);

//endpoint for receiving geolocation
router.post('/',bus.receiveLocation);

//get an array of units with passenger count
router.get('/all', bus.getAllBus);

//get the current passenger count with coordinates
router.get('/:bus_id', bus.getCurrentStatus);

export default router;
