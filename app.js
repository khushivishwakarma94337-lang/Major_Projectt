if(process.env.NODE_ENV !="production"){
require('dotenv').config() ;

}
console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const methodOverride= require("method-override");
app.use(methodOverride("_method"));
app.use(express.json());
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const dbUrl=process.env.ATLAS;

const ListingRouter=require("./routes/listing.js");
const ReviewRouter=require("./routes/review.js");
const userRouter=require("./routes/User.js");
const ExpressError=require("./utils/ExpressError.js");

const session=require("express-session")
const MongoStore=require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const store= new MongoStore({
  mongoUrl:dbUrl,
  crypto:{
  secret:process.env.SECRET,
    
  },
  touchAfter:24*3600,
});

store.on("error",(err)=>{
  console.log("ERROR IN MONGO SESSION STORE" ,err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,   // better practice
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
  }
};

app.use(session(sessionOption));   // 1️⃣ FIRST
app.use(passport.initialize());    // 2️⃣
app.use(passport.session());       // 3️⃣
app.use(flash());                  // 4️⃣

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demo",async(req,res)=>{
//     let fakeuser=new User({
//         email:"khush@gmail.com",
//         username:"khush",
//     })
//     let registeredUser=await User.register(fakeuser,"hello");
//     res.send(registeredUser);
// });
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  res.locals.mapToken=process.env.MAP_TOKEN;

  next();
});

app.use("/listings",ListingRouter);
app.use("/listings/:id/reviews",ReviewRouter);
app.use("/", userRouter);



// app.get("/",(req,res)=>{
//     res.send("working");
// })
app.listen(8080,()=>{
    console.log("app is listening ");
})
// const Mongo_url="mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(dbUrl);
}
main().then((res)=>{console.log("Connection ")})
.catch((err)=>{console.log(err)});

app.all(/.*/,(req,res,next)=>{
   next(new ExpressError(404,"Page not found"));
});


app.use((err,req,res,next)=>{
    const status=err.status|| 500;
    const message=err.message|| "Something wrong";
   res.status(status).render("error.ejs",{message});
    
    // res.status(status).send(message);
})
app.get("/test",(req,res)=>{
  res.send("done");
})