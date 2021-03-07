const express = require("express");

const app = express();
const port = 3000 || process.env.PORT;

app.use(express.static("./public/"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.render("home");
})

//route for seller login and signup
app.use('/sellerAuth',require("./router/sellerAuth"));

//route for buyer login and signup
app.use("/buyerAuth",require("./router/buyerAuth"));

//route for seller dashboard
app.use("/seller",require("./router/sellerDashboard"));

app.listen(port,(req,res)=>{
    console.log(`Server is listening on port ${port}`);
})