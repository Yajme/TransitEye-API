import express from 'express';
import location from '#src/routes/gps';
import bus from '#src/routes/bus';
import user from '#src/routes/user';
import { requireBody } from '#src/middlewares/checkBody';
const router = express.Router();

//If request method is POST, require body always
router.use(requireBody);

router.use('/location',location);
router.use('/bus',bus);
router.use('/user',user);





export default router;
