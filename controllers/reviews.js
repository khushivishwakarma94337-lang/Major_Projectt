const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.index=(async(req,res)=>{
   let listing=await Listing.findById(req.params.id);
   console.log(req.params.id);
   let newreview=new Review(req.body.review);
   newreview.author=req.user._id;
   
  listing.reviews.push(newreview);
// console.log(newreview);
   await newreview.save();
// console.log(newreview);

   await listing.save();
   console.log(newreview);

//    res.redirect(`/listings/${listing._id}`);
res.redirect(`/listings/${listing._id}`);
})


module.exports.deleteReview=(async(req,res)=>{
    let{id,reviewId}=req.params;
    Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);

});