const path=require("path");
require("dotenv").config({path:
    path.resolve(__dirname,"../.env")
});

const mongoose = require("mongoose");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const Indata = require("./data.js");
const Listing = require("../models/listing.js");

const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({
  accessToken: mapToken,
});

async function main() {
  await mongoose.connect(process.env.ATLAS);
  console.log("DB Connected");

  await init();
}

const init = async () => {
  await Listing.deleteMany({});

  let newData = [];

  for (let obj of Indata.data) {
    let response = await geocodingClient
      .forwardGeocode({
        query: obj.location,
        limit: 1,
      })
      .send();

    newData.push({
      ...obj,
      owner: new mongoose.Types.ObjectId("69ee5704fe6ec3fadd8343aa"),
      geometry: response.body.features[0].geometry,
    });
  }

  await Listing.insertMany(newData);

  console.log("Data initialized");
};

main().catch((err) => {
  console.log(err);
});