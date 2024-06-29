const express=require('express');
const mongoose=require('mongoose');
const app=express();      //don't forget to put . with respect to the root directory
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/expresserror.js');
const Review=require('./models/review.js');


const listings = require('./routes/listing.js');
const reviews = require('./routes/listing.js');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));


let mongoUrl='mongodb://127.0.0.1:27017/wanderlust'

main()
.then(()=>{
    console.log('Connected to DB');
})
.catch((err)=>{
    console.log(err);
});

//creating db

async function main(){
    await mongoose.connect(mongoUrl);
}


app.get('/',(req,res)=>{
    res.send(`working on the root`);
});


app.use('/listings',listings);  
app.use('/listings/:id/reviews',reviews);


//if the requested page (route) does not match the above route's

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,'page not found'));
});


//defining middleware to handle the wrong req from client side
app.use((err,req,res,next)=>{
    let{statusCode=500 , message='something went wrong'}=err;
    res.status(statusCode).render('error.ejs',{message});
    // res.status(statusCode).send(message);
});


//Listening to the port (starting the server)

app.listen(8080,()=>{
    console.log(`listening to the port ${8080}`);
});