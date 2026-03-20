const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const {ListingSchema}=require("../schema.js");
const Review= require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner}=require("../middleware.js");
const { isreviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");





const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    let errMsg=error.details.map((el)=>el.message).join(",");
    if(error){
         throw new ExpressError(404,errMsg);
    }else{
        next();
    }
}

router.post("/", isLoggedIn,wrapAsync(reviewController.index)
);

//review delete route
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewController.deleteReview)
);
module.exports=router;