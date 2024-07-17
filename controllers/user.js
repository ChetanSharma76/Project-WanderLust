const User=require('../models/user');

module.exports.signupRender=(req,res)=>{
    res.render('user/signup.ejs');
};

module.exports.signupSave=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newuser=new User({email,username});
        const registereduser = await User.register(newuser,password);
        req.login(registereduser,(err)=>{
            if(err)return next(err);
            req.flash('success','user registered successfully!');
            res.redirect('/listings');

        });
    }
    catch(err){
        req.flash('failure',err.message);
        res.redirect('/signup');
    }
};

module.exports.loginRender=(req,res)=>{

    res.render('user/login.ejs');

};

module.exports.loginVerify=async(req,res)=>{                 //authenticate the user acts as a route middleware
    req.flash('success','Welcome to WanderLust!');
    if(!(res.locals.redirecturl))res.locals.redirecturl='/listings';        //if the user logs in using home page then the middleware wouldn't get anything when it triggers so we have undefined in that case and we need to handle that.
    res.redirect(res.locals.redirecturl);
};

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err)next(err);

        req.flash('success','You are logged out!');
        res.redirect('/login');
    });
};