const express = require("express");
const router = express.Router();

// all the routes will came here

//seller dashboard route
router.get("/",(req,res)=>{
    res.render("buyer/dashboard")
})

//user image route
router.get("/",(req,res)=>{
    res.render("public/asset/user")
})

module.exports = router;