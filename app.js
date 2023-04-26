const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require('mongoose');
const flash=require("connect-flash");
const session=require("express-session");
const passport = require("passport");


app.use(expressLayouts);
app.set("view engine", "ejs");
require("./config/passport")(passport);
const db = require("./config/keys").MongoURI;

mongoose.connect(db, { useNewUrlParser: true }).then(() => {
    console.log("Mongoose connected...");
}).catch((err) => {
    console.log(err);
});

//body parser
app.use(express.urlencoded({ extended: false }));







app.use(session({secret:'secret',         
 resave: true,  
saveUnitialized: true}));    

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{

    res.locals.success_msg=req.flash("success_msg");
    res.locals.error_msg=req.flash("error_msg");
    res.locals.error=req.flash("error");
    next();
    
});

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running on  port 5000...");
});

app.use(express.static(path.join(__dirname, 'CSS')));
