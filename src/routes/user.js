import express from 'express';
import user from '#src/controllers/userController';

// /api/user


const router = express.Router();


//router.get('/validate',user.test);
router.post('/login',user.AuthenticateUser);
//add driver
router.post('/driver',user.addDriver);

//add unit
// TODO : add router for adding unit
router.post('/unit',user.addUnit);
//This route may not be used kekw

export default router;
