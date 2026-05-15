const { model } = require("mongoose");
const Listing=require("./models/listing");
const Review= require("./models/review.js");


 const isLoggedInCart = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Please login first to add items to cart");
        return res.redirect("back"); // 👈 stays on same page
    }
    next();
};


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
const isOwner = async (req, res, next) => {

    let { id } = req.params;

    let listing = await Listing.findById(id);

    // listing not found
    if (!listing) {

        req.flash("error", "Listing not found");

        return res.redirect("/listings");

    }

    // owner check
    if (!listing.owner.equals(res.locals.currUser._id)) {

        req.flash("error", "You don't have permission");

        return res.redirect(`/listings/${id}`);

    }

    next();
};

const isreviewAuthor=async(req,res,next)=>{
                let {id,reviewId}=req.params;
              let review= await Review.findById(reviewId);
              if(!review.author || !review.author.equals(res.locals.currUser._id)){
                req.flash("error","you didn't create this review");
                                return   res.redirect(`/listings/${id}`);

              }
              next();
              

}
module.exports={isLoggedIn,saveRedirectUrl,isOwner,isreviewAuthor,isLoggedInCart};
