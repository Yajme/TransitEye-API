import express from 'express';
import user from '#src/controllers/userController';

// /api/user


const router = express.Router();


//router.get('/validate',user.test);
router.post('/login',user.AuthenticateUser);


//This route may not be used kekw

export default router;
