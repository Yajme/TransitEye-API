import express from 'express';
import user from '#src/controller/userController';




// /api/user


const router = express.Router();


router.get('/validate',user.apiKeyValidation,user.test);
router.post('/login',user.AuthenticateUser);










export default router;
