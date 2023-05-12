import express from 'express'
import registerHandler from '../securityHandler/registration.js';
import loginHandler from '../securityHandler/loginHandler.js';
import test from '../securityHandler/test.js';
import {impMiddleware, isAdmin} from '../middleware/authMiddleware.js'
import {forgotpassHandler, updateProfile} from '../securityHandler/forgotpassHandler.js';


//router Objects
const router = express.Router();

//Router 
//REGISTRATION || Method POSt

router.post('/register', registerHandler);

router.post('/login' ,loginHandler);

router.get('/test', impMiddleware , isAdmin ,test );

router.post('/forgotpass' ,forgotpassHandler );

//protecting user dasbord
router.get('/user-auth' , impMiddleware ,(req,res)=>{
    res.status(201).send({ok : true});
})

//protected admin dashbord
router.get('/admin-auth' , impMiddleware , isAdmin ,(req,res)=>{
    res.status(201).send({ok : true});
})

//padate profile
router.put('/profile',impMiddleware,updateProfile)
export default router;