const Review=require('../models/review');
const Listing=require('../models/listing');

module.exports.renderReview=async (req,res)=>{

    const allListings=await Listing.find({});
    res.render('listings/index.ejs',{allListings});
    
};


module.exports.createReview=async(req,res)=>{
    
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success",'new review created!');

    res.redirect(`/listings/${listing._id}`);
    
};


module.exports.deleteReview=async (req,res)=>{

    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});     //that review in reviews array that matches with the id will be pulled out.
    await Review.findByIdAndDelete(reviewId);

    req.flash("success",'review deleted!');

    res.redirect(`/listings/${id}`);

};


