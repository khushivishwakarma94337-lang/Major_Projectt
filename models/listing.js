const mongoose=require("mongoose");
const Review= require("./review.js");


// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
// }
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename:{
            type:String,
            default:"Listingimage",
        },
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1767283675283-e1a435ea630b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        // default:"https://unsplash.com/photos/a-bird-flies-over-a-vast-lake-with-mountains-mrAbkszw62M",
        // type:String,
        // set:(v)=>v===" " ? "https://unsplash.com/photos/a-bird-flies-over-a-vast-lake-with-mountains-mrAbkszw62M" :v,
        // filename:String,
        // url:String,
    },
    price:Number,
    location:String,
    country:String,
    
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
}
);

listingSchema.post("findOneAndDelete",async function(doc){
    if(doc){
        const Review=require("./review.js");
        await Review.deleteMany({_id: { $in: doc.reviews}});
    }
})
const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;