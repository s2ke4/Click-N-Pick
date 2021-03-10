const express = require("express");
const router = express.Router();

// all the routes will came here

//seller dashboard route
router.get("/",(req,res)=>{
    res.render("seller/dashboard")
})

//Add items route for dashboard
router.get("/addItem",(req,res)=>{
    res.render("seller/addItem");
})

//Orders route to view the orders received by the seller
router.get("/orders",(req,res)=>{
    res.render("seller/orders");
})

//To view the details of an order
router.get("/orders/order-details",(req,res)=>{
    res.render("seller/orderDetails");
})
module.exports = router;