const Listing = require('./models/listing');
const Review = require('./models/review');
const {listingSchema , reviewSchema}=require('./schema.js');
const ExpressError=require('./utils/expresserror.js');


module.exports.isLoggedin=(req,res,next)=>{

    // console.log(req.originalUrl);
    if(!req.isAuthenticated()){

        //redirect url
        req.session.redirecturl=req.originalUrl;

        req.flash('failure','You are not logged in!');
        res.redirect('/login');
    }
    next();
}

module.exports.saveredirecturl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    
    let {id}=req.params;
    // console.log(id);               helped in debugging why there is client side error of bad request
    // console.log(req.body);
    const listing=await Listing.findById(id);
    if(!(listing.owner._id.equals(res.locals.curruser._id))){
        req.flash('failure','You are not the owner of this listing!');
        return res.redirect(`/listings/${id}`);
    }

    next();

}

module.exports.validListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validReview=(req,res,next)=>{

    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.reviewAuthor=async(req,res,next)=>{

    let {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!(review.author._id.equals(res.locals.curruser._id))){
        req.flash('failure','You are not the author of this review!');
        return res.redirect(`/listings/${id}`);
    }

    next();
}