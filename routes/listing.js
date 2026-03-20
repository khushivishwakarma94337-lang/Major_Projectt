const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {ListingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner}=require("../middleware.js");
const ListingController=require("../controllers/listing.js");
const multer  = require('multer');
const{storage}=require("../cloudConflict.js");
const upload = multer({storage});









const validateList=(req,res,next)=>{
     
    let {error}= ListingSchema.validate(req.body);
    if(error){
            let errMsg=error.details.map((el) =>el.message).join(",");

        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
router.get("/new", isLoggedIn,(ListingController.newRoute));

router.route("/")
 .get(wrapAsync(ListingController.index)
)
.post(isLoggedIn,
    upload.single("listing[image]"),

    wrapAsync(ListingController.newListForm)
);

// router.route("/new")
// .post(isLoggedIn,wrapAsync(ListingController.newListForm)
// );


router.route("/:id")
 .get(wrapAsync(ListingController.showRoute)
)
// .put(isLoggedIn,isOwner,
//         upload.single("listing[image]"),
// wrapAsync(ListingController.edit));







router.get("/:id/edit",wrapAsync(ListingController.editForm)
);
router.put("/:id",isLoggedIn,isOwner,
        upload.single("listing[image]"),
wrapAsync(ListingController.edit));




router.delete("/:id/delete",isLoggedIn,isOwner, wrapAsync(ListingController.deleteList)
);
module.exports=router;


