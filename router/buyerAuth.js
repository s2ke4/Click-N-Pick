const express = require("express");
const router = express.Router();

// all the routes will came here
//router for buyer login
router.get("/login",(req,res)=>{
    res.render("buyer/authentication/login");
})

//router for buyer signup
router.get("/register",(req,res)=>{
    res.render("buyer/authentication/signup");
})

module.exports = router;