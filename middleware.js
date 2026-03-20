const { model } = require("mongoose");
const Listing=require("./models/listing");
const Review= require("./models/review.js");



 const isLoggedIn=(req,res,next)=>{
    console.log(req.user);
        if(!req.isAuthenticated()){
         req.session.redirectUrl=req.originalUrl;
        req.flash("error","You have to logged in");
        return res.redirect("/login");
    }
    next();
}
const saveRedirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
   }
   next();
}
const isOwner=async(req,res,next)=>{
    
                let {id}=req.params;
            let Listing= await Listing.findById(id);
            if(!Listing.owner.equals(res.locals.currUser._id )){
                req.flash("error","You don't have permission to edit");
                return   res.redirect(`/listings/${id}`);

            }
next();
}

const isreviewAuthor=async(req,res,next)=>{
                let {id,reviewId}=req.params;
              let review= await Review.findById(reviewId);
              if(!Review.author.equals(res.locals.currUser._id)){
                req.flash("error","you didn't create this review");
                                return   res.redirect(`/listings/${id}`);

              }
              next();
              

}
module.exports={isLoggedIn,saveRedirectUrl,isOwner,isreviewAuthor};
