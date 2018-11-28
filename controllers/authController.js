const passport = require('passport');


exports.login = passport.authenticate('local',{
    failureRedirect:'/login',
    failureFlash:'Failed login',
    successRedirect:'/',
    successFlash:'You are logged in'
})

exports.logout = (req, res)=>{
    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('/');   
}

exports.isLoggedIn= (req,res,next)=>{
    //firts check is the user is authenticated
    if(req.isAuthenticated()){
        next();
        return;
    }
    req.flash('error','Oops you must be logged in to that');
    res.redirect('/login');
}