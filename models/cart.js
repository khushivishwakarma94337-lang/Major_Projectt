const mongoose=require("mongoose");
const cartSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    listingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Litsing",
    },
    title:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    country:{
        type:String
    },
    price:{
        type:Number,
        required:true
    }
});
module.exports=mongoose.model("Cart",cartSchema);