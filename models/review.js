const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// async function main(){
//     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// }

// main().then((res)=>{console.log("connection")})
// .catch((err)=>{console.log("err")});

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
});
module.exports=mongoose.model("Review",reviewSchema); 