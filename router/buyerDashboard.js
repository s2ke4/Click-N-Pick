const express = require("express");
const router = express.Router();

// all the routes will came here

//seller dashboard route
router.get("/",(req,res)=>{
    res.render("buyer/dashboard")
})

//route for cart
router.get("/cart",(req,res)=>{
    res.render("buyer/cart")
})

module.exports = router;