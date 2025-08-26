import express from 'express';
import location from '#src/routes/gps';
import bus from '#src/routes/bus';
//import bus from '#src/routes/bus';

const router = express.Router();

router.use('/location',location);
router.use('/bus',bus);









export default router;
