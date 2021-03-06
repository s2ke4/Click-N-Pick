const express = require("express");

const app = express();
const port = 3000 || process.env.PORT;

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.render("home");
})

app.listen(port,(req,res)=>{
    console.log(`Server is listening on port ${port}`);
})