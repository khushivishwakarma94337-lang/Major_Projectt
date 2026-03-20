const express=require("express");
const router=express.Router();
const user=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
 const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");


router.get("/signup",(userController.signupForm))

router.post("/signup",wrapAsync(userController.postMethodForm)
);

router.get("/login",(userController.loginForm))

router.post("/login",
  saveRedirectUrl,
   passport.authenticate("local",{
    failureRedirect:'/login',
   failureFlash:true,
  
}), 
   (userController.loginFormPost)


);
// async(req,res)=>{
//    req.flash("success","Welcome to Wanderlust you logged in");
//    res.send("welcome");
// });

// router.post("/login",passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
//      res.send("Welcome to Wanderlust you logged in");
// })
router.get("/logout",(userController.logoutFun))



module.exports=router;