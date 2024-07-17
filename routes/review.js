const express=require('express');
const Review=require('../models/review.js');
const router=express.Router({mergeParams:true});
const Listing=require('../models/listing.js');        //don't forget to put . with respect to the root directory
const wrapAsync=require('../utils/wrapasync.js');
const {validReview,isLoggedin,reviewAuthor} = require('../middleware.js');



const reviewController=require('../controllers/review.js');

router.get('/',wrapAsync(reviewController.renderReview));

//reviews route
router.post('/',isLoggedin,validReview,wrapAsync(reviewController.createReview));

//delete reviews route
router.delete('/:reviewId',isLoggedin,reviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;