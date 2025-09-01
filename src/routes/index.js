import express from 'express';
import location from '#src/routes/gps';
import bus from '#src/routes/bus';
import user from '#src/routes/user';

const router = express.Router();

router.use('/location',location);
router.use('/bus',bus);
router.use('/user',user);





export default router;
