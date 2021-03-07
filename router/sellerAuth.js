const express = require("express");
const router = express.Router();

// all the routes will came here
//router for seller login
router.get("/login",(req,res)=>{
    res.render("seller/authentication/login");
})

//router for seller signup
router.get("/register",(req,res)=>{
    res.render("seller/authentication/signup");
})

module.exports = router;