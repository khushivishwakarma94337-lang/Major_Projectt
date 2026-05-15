const Listing = require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken:mapToken});
const Cart=require("../models/cart.js");
const { default: mongoose } = require("mongoose");

//cart


 


module.exports.cartPost = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let existingItem = await Cart.findOne({
        userId: req.user._id,
        listingId: listing._id
    });

    if (existingItem) {
        req.flash("error", "Item already in cart");
        return res.redirect("/listings/cart");
    }

    let item = new Cart({
        userId: req.user._id,
        listingId: listing._id,
        title: listing.title,
        image: listing.image.url,
        price: listing.price
    });

    await item.save();





    req.flash("success", "Added to cart");
    res.redirect("/listings/mycart");
};

module.exports.cart=(async(req,res)=>{
    let items=await Cart.find({
        userId:req.user._id
    })
    console.log(items);
res.render("listings/cart.ejs",{items})
})
module.exports.removeCart=(async(req,res)=>{
    let {id}=req.params;
    await Cart.findByIdAndDelete(id);
    req.flash("success","Item Removed from Cart!");
    res.redirect("/listings/mycart");

})
    
 

module.exports.index=(async (req,res)=>{
 let {category}=req.query;
 let allList;
 if(category){
    allList=await Listing.find({category});
 
 }else{
    allList=await Listing.find({});
 }
//  console.log(allList);
res.render("listings/index.ejs",{allList});
});
module.exports.searchDestination = async (req, res) => {
    let { country } = req.query;

    let allList = await Listing.find({ country });
    console.log(allList);

    res.render("listings/index.ejs", { allList });
};


module.exports.newRoute=(req,res)=>{
    res.render("listings/new.ejs")
};
module.exports.newListForm = async (req, res, next) => {
let response = await  geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()
 console.log( JSON.stringify(response.body.features[0].geometry,null,2));

    // console.log("router hit");
    // res.send("form submit");

    const newList = new Listing(req.body.listing);
    
    

   
     if (req.file) {
        newList.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    newList.owner = req.user._id;
    newList.geometry=response.body.features[0].geometry;
    let savedList= await newList.save();
    console.log(savedList);

    req.flash("success", "New listing is created!!");

    res.redirect("/listings");   
};

// module.exports.showRoute=(async (req,res)=>{
//     let {id}=req.params;

//      let inddata=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
//      console.log(inddata);
//      if(!inddata){
//         req.flash("error","Listing you created doesn't exist");
//        return res.redirect("/listings");
//      }
//      console.log(Listing);
//           res.render("listings/index.ejs",{inddata});
// });

module.exports.showRoute = async (req, res,next) => {
    let { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return next();
    }

    let inddata = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!inddata) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }

    res.render("listings/index1.ejs", { inddata }); 
};
// module.exports.newListForm=(async(req,res,next)=>{
//   console.log(req.body);
//     const newList= new Listing(req.body.listing);
//         console.log(newList);
//         if(req.file){
//             newList.image={
//                 url:req.file.path,
//                 filename:req.file.filename
//             };
//         }

//     newList.owner=req.user._id;
//     await newList.save();
//     console.log(newList);
//     req.flash("success","new listing is created");
//     res.redirect("listings/new.ejs");
  
// })

module.exports.editForm=( async (req,res)=>{
        let {id}=req.params;

     const inddata=await Listing.findById(id);
     res.render("listings/edit.ejs",{inddata});


})
module.exports.edit=(async(req,res)=>{
            let {id}=req.params;
            
            
  await  Listing.findByIdAndUpdate(id,{...req.body.listing});
 
        if( typeof req.file !== "undefined"){
       let url=req.file.path;
       let filename=req.file.filename;
       listing.image={url,filename};
       await listing.save();
        }

   req.flash("success","Listing is updated");
   res.redirect(`/listings/${id}`);
})

module.exports.deleteList=(async (req,res)=>{
    let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted");
     res.redirect("/listings");
});