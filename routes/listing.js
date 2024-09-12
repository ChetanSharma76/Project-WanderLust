const express=require('express');
const Listing=require('../models/listing.js');        //don't forget to put . with respect to the root directory
const wrapAsync=require('../utils/wrapasync.js');
const router=express.Router();
const {isLoggedin, isOwner , validListing}=require('../middleware.js');


const listingController=require('../controllers/listing.js');

//these two are the middleware functions used for validating the server side 
router.route('/')

.get(wrapAsync(listingController.index))

//create route for new listing
.post(validListing , isLoggedin , wrapAsync(listingController.createnewlisting));

//New Route
router.get('/new',isLoggedin,listingController.newroute);         //displaying form for the new listing

router.route('/:id')

//show Route
.get(wrapAsync(listingController.showlisting))

//update route 
.put(validListing , isLoggedin,isOwner, wrapAsync(listingController.updatelisting))

//delete route
.delete(isLoggedin,isOwner,wrapAsync(listingController.deletelisting));


//edit route
router.get('/:id/edit',isLoggedin,isOwner,wrapAsync(listingController.editlisting));



module.exports=router;
