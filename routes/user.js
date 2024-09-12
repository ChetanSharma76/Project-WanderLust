const express=require('express');
const router=express.Router();
const User=require('../models/user.js');
const wrapAsync = require('../utils/wrapasync.js');
const passport=require('passport');
const {saveredirecturl}=require('../middleware.js');


const userController=require('../controllers/user.js');

//sign up page 
router.get('/signup',userController.signupRender);

//sign up info save in db
router.post('/signup',wrapAsync(userController.signupSave));

//login page
router.get('/login',userController.loginRender);

//login verification through passport
router.post('/login',
    saveredirecturl,                 //middleware to save the original requested URL
    passport.authenticate('local',{failureRedirect: '/login' , failureFlash:true , failureMessage: true}),   //mechanism to authenticate the user based on local strategy i.e involves basically the verification of the username and the password
    userController.loginVerify            //what has to done after the authentication is successful redirecting to the intended page etc.
);

//logout
router.get('/logout',userController.logout);

module.exports=router;
