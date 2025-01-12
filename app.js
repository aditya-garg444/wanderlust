if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const otherRouter = require("./routes/other.js");

const dbURL = process.env.ATLASDB_URL;
main().then(()=>{
    console.log("Connected to database successfully!");
}).catch(err=>{
    console.log("Error while connecting to database!");
    console.log(err);
});

async function main() {
    await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24*60*60
});
store.on("error", (err)=>{
    console.log("ERROR in MONGO SESSION STORE", err);
})
const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
    store: store
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user; // to check if user is logged in or not
    next();
});

app.get("/", (req, res)=>{
    res.redirect("/listings");
});

// Listings routes
app.use("/listings", listingRouter);

// Reviews routers
app.use("/listings/:id/reviews", reviewRouter);

//users routes
app.use("/", userRouter);

//other routes like privacy, terms and social media handles
app.use("/", otherRouter);

//Page not found error(Accessing some route that does not exist)
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found", "404"));
});

app.use((err, req, res, next)=>{
    console.log(err);
    let {statusCode = 500, message = "Something went wrong", name="Some error"} = err;
    res.status(statusCode).render("error.ejs", {message, name});
});

let port = 8080;
app.listen(port, ()=>{
    console.log("Listening to port", port);
});