const mongoose=require("mongoose");
const Indata=require("./data.js");
const Listing=require("../models/listing.js");
const Mongo_url="mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(Mongo_url);
}
main().
then((res)=>{console.log("Connection ")})
.catch((err)=>{console.log(err)});
 const init = async()=>{
  await Listing.deleteMany({});
    Indata.data=Indata.data.map((obj)=> ({
    ...obj,
    owner:"699328097e0518426dda1124",
  }));
  await Listing.insertMany(Indata.data);
  console.log("data was initialized")
 };
 init();