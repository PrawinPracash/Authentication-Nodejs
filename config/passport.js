const LocalStratergy=require("passport-local").Strategy;
const mongoose=require("mongoose");


const User=require("../models/Users");

module.exports=function(passport){
    passport.use(
        new LocalStratergy({usernameField:'email'},(email,password,done)=>{
            User.findOne({email:email})
            .then( (user)=>{
                if(!user){
                    return done(null,false,{message :"Email is not registered"})
                }
                if(password!=user.password){
                    return done(null,false,{message :"Password incorrect"});
                }
                return done(null,user);
            })
            .catch((err)=> console.log(err));
        })

    );
    passport.serializeUser((user,done)=>{
        done(null , user.id);
    });
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user);
        });
    });

}



