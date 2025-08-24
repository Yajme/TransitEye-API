import express from 'express';
import location from '#src/routes/gps';
import device from '#src/routes/device';
//import bus from '#src/routes/bus';

const router = express.Router();

router.use('/location',location);
router.use('/device',device);









export default router;