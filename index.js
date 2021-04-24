const express = require("express");
const app = express();
const port = process.env.PORT || 3000  ;
const cookieParser = require("cookie-parser");
const {checkUser,ensureSeller} = require("./middleware/authMiddleware");
const methodOverride = require("method-override");

app.use(express.static("./public/"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

// to override method
app.use(methodOverride('X-HTTP-Method-Override'));

app.get("*",checkUser);

//router for search and dashboard for logged out
app.use("/",require("./router/home"));

//route for seller login and signup
app.use('/sellerAuth',require("./router/sellerAuth"));

//route for buyer login and signup
app.use("/buyerAuth",require("./router/buyerAuth"));

//route for seller dashboard
app.use("/seller",ensureSeller,require("./router/sellerDashboard"));

//route for buyer dashboard
app.use("/buyer",require("./router/buyerDashboard"))

app.use((req,res)=>{
    res.render("error");
})

app.listen(port,(req,res)=>{
    console.log(`Server is listening on port ${port}`);
})
