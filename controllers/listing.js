const Listing=require('../models/listing');

module.exports.index=
    async (req,res)=>{
        const allListings=await Listing.find({});
        res.render('listings/index.ejs',{allListings});
        
    };

module.exports.newroute=
    (req,res)=>{
        res.render('listings/new.ejs');
    };

module.exports.createnewlisting=
    async (req,res,next)=>{

        // let{title,description,image,price,country,location}=req.body;
    
        const newListing= new Listing(req.body.listing);
        newListing.owner=req.user._id;
        await newListing.save();
    
        req.flash("success",'new listing added!');
        res.redirect('/listings');
        
    };

module.exports.showlisting=
    async (req,res)=>{

        let {id}=req.params;
        const listing=await Listing.findById(id)
        .populate
        ({path:'reviews',populate:{path:'author',},}).populate('owner');
        if(!listing){
            req.flash('failure','Listing you requested does not exist.');
            res.redirect('/listings');
        }
        res.render('listings/show.ejs',{listing});
    
    };

module.exports.editlisting=
    async (req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        if(!listing){
            req.flash('failure','Listing you requested does not exist.');
            res.redirect('/listings');
        }
        res.render('listings/edit.ejs',{listing});
    };

module.exports.updatelisting=
    async (req,res)=>{

        let {id}=req.params;
        // console.log(id);               helped in debugging why there is client side error of bad request
        // console.log(req.body);
        await Listing.findByIdAndUpdate(id,{...req.body.listing});     //passing the new values entered by the user and updating the corresponding id.
        req.flash("success",'listing updated!');
        res.redirect(`/listings/${id}`);
    
    };

module.exports.deletelisting=
    async (req,res)=>{

        let {id}=req.params;
        let deletedListing=await Listing.findByIdAndDelete(id);
        req.flash("success",'listing deleted!');
        res.redirect('/listings');
    
    };
