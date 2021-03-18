const express = require("express");
const router = express.Router();

// all the routes will came here

//seller dashboard route
router.get("/",(req,res)=>{
    res.render("buyer/dashboard")
})

<<<<<<< HEAD
=======
//route for cart
router.get("/cart",(req,res)=>{
    res.render("buyer/cart")
})

>>>>>>> 90b8c139d3e75d79ba675477d9213146d5351a88
module.exports = router;