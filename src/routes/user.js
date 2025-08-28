import express from 'express';
import userController from '#src/controller/userController';




// /api/user


const router = express.Router();


router.get('/validate',userController.apiKeyValidation,userController.test);











export default router;
