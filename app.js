const express=require('express');
const mongoose=require('mongoose');
const app=express();      //don't forget to put . with respect to the root directory
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/expresserror.js');
const session = require('express-session');
const flash= require('connect-flash');
const passport=require('passport');
const localStrategy=require('passport-local');
const user=require('./models/user.js');



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));

const sessionOptions={
    secret:'mysupersecretcode',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,    //current time in ms from Date.now()
        maxAge:7*24*60*60*1000
    }
};

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

//flash must be initialized before the routes because for these routes only we are creating flash

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());              //to activate the passport
app.use(passport.session());                //session intialized
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{                       //middleware for reading success message
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash('failure');
    res.locals.curruser=req.user;
    next();
});

const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js')

app.use('/listings',listingsRouter);  
app.use('/listings/:id/reviews',reviewsRouter);
app.use('/',userRouter);


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