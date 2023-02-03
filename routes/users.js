const express = require("express");
const router = express.Router();
const passport=require("passport");

router.get("/login", (req, res) => {
    res.render("login");
});

const User = require('../models/Users');



router.get("/register", (req, res) => {
    res.render("register")
});


router.post("/register", (req, res) => {
    console.log(req.body);
    const { name, email, password, confirm_password } = req.body;
    let errors = [];
    let flag = 1;
    if (!name || !email || !password || !confirm_password) {
        flag = 0;
        errors.push({ msg: "Fill all the fields" });
    }

    if (password.length < 6 && flag) {
        errors.push({ msg: "Password should be atleast 6 characters" });
    }
    if (password != confirm_password && flag) {
        errors.push({ msg: "Password doesn't match" });
    }
    console.log(errors);


    if (errors.length > 0) {
        res.render('register', {
            errors, name, email, password, confirm_password
        });
    }
    else {
        User.findOne({ email: email }).then((user) => {
            console.log(user);
            if (user) {
                errors.push({ msg: "Email already registered" });
                res.render('register', {
                    errors, name, email, password, confirm_password
                });
            } else {
                const new_user = new User({
                    name,
                    email,
                    password
                });
                new_user.save().then((user) => {
                    req.flash("success_msg","Successfully Registered");
                    res.redirect('/users/login');
                }).catch((err) => {
                    console.log(err);
                });

            }
        }).catch((err) => {
            console.log(err);
        });



    }

});
// router.post("/login", (req, res) => {


//     let errors = []
//     const { name, email, password } = req.body;
//     console.log(email, password);
//     User.findOne({ email: email }).then((user) => {
//         if (!user) {
//             errors.push({ msg: "Email not registered" });
//             res.render('login', {
//                 errors,
//                 email,
//                 password
//             });
//         } else {
//             if (user.password != password) {
//                 errors.push({ msg: "Password incorrect" });
//                 res.render('login', {
//                     errors,
//                     email,
//                     password
//                 });
//             } else {
//                 console.log(user.name,'pp');
//                 const name=user.name;
//                 res.render('dashboard',{
//                     name,email,password
//                 });
//             }
//         }
//     }).catch((err) => {
//         console.log(err);
//     })




// });


router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:"/dashboard",
        failureRedirect: "/users/login",
        failureFlash:true
    })(req,res,next);
});


router.get("/logout",(req,res)=>{
    req.logout((err)=>{{
        if(err){
            return err;
        }
        req.flash("success_msg","Successfully logged out");
    res.redirect("/users/login");

    }});
    
    

});



module.exports = router;
