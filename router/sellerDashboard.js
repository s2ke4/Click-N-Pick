const express = require("express");
const router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: '/uploads/' })
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

//router for adding item
router.post("/addItem",upload.array('photos', 12),(req,res)=>{
    console.log(req.files[0])
    res.send("HELLO")
})

module.exports = router;