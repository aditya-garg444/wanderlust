if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
let {data} = require("./data.js");

main().then(()=>{
    console.log("Connected to database successfully!");
}).catch(err=>{
    console.log("Error while connecting to database!");
    console.log(err);
});

const dbURL = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
    await Listing.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});

    let sampleUser = new User({
        username: "admin",
        email: "admin@gmail.com",
    });
    const registeredUser = await User.register(sampleUser, process.env.SAMPLE_PASSWORD);
    data = data.map((obj)=>({...obj, owner: registeredUser._id})); // we inserted a sample user and assigned it as owner for all sample listings data
    await Listing.insertMany(data);
    console.log("Data was initialized!");
};

initDB();