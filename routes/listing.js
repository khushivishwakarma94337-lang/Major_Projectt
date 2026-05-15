const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const { ListingSchema } = require("../schema.js");

const ExpressError = require("../utils/ExpressError.js");

const { isLoggedIn, isOwner,isLoggedInCart } = require("../middleware.js");

const ListingController = require("../controllers/listing.js");

const multer = require("multer");

const { storage } = require("../cloudConflict.js");

const upload = multer({ storage });



// VALIDATION
const validateList = (req, res, next) => {

    let { error } = ListingSchema.validate(req.body);

    if (error) {

        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);

    } else {

        next();

    }
};



// SEARCH
router.get(
    "/search",
    ListingController.searchDestination
);


// CART
router.get(
    "/mycart",
    ListingController.cart
);

router.post(
    "/:id/cart",
    isLoggedInCart,
    wrapAsync(ListingController.cartPost)
);

router.delete(
    "/mycart/:id",
    isLoggedIn,
    wrapAsync(ListingController.removeCart)
);



// NEW LISTING FORM
router.get(
    "/new",
    isLoggedIn,
    ListingController.newRoute
);



// EDIT FORM
router.get(
    "/:id/edit",
    wrapAsync(ListingController.editForm)
);



// INDEX + CREATE
router.route("/")
.get(
    wrapAsync(ListingController.index)
)

.post(
    isLoggedIn,

    upload.single("listing[image]"),

    wrapAsync(ListingController.newListForm)
);



// SHOW + UPDATE + DELETE
router.route("/:id")

.get(
    wrapAsync(ListingController.showRoute)
)

.put(
    isLoggedIn,

    isOwner,

    upload.single("listing[image]"),

    wrapAsync(ListingController.edit)
)

.delete(
    isLoggedIn,

    isOwner,

    wrapAsync(ListingController.deleteList)
);



module.exports = router;