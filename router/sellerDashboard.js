const express = require("express");
const router = express.Router();
const multer = require("multer");
const conn = require("../connection");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);
let seller;
const fs = require("fs");

//multer options
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,"public/uploads/")      //you tell where to upload the files,
    },
    filename: function (req, file, cb) {
      var regex = new RegExp('[^.]+$');
      let extension = file.originalname.match(regex);
      var x = Math.floor((Math.random() * 1000) + 1);
      if (!Date.now) {
        Date.now = function() { return new Date().getTime(); }
      }
      let name = x + Date.now()
      cb(null, name+'.'+extension)
    }
  })

var upload = multer({
    storage: storage,
});

//seller dashboard route
router.get("/",(req,res)=>{
    res.render("seller/dashboard")
})

//Add items route for dashboard
router.get("/addItem",(req,res)=>{
    seller = res.locals.user;
    res.render("seller/addItem");
    
})

//Orders route to view the orders received by the seller
router.get("/orders",(req,res)=>{
    res.render("seller/orders");
})

//router for adding item
router.post("/addItem",upload.array("photos",100),async(req,res)=>{
    // console.log(req.files)
    try {
        const {productName,brandName,price,discount,numberOfItems,productColour,category,description} = req.body;
        let query = `INSERT INTO items(product_name,brand_name,price,discount,num_of_items,product_color,category,prod_description,seller_id) VALUES("${productName}","${brandName}",${price},${discount},${numberOfItems},"${productColour}","${category}","${description}",${seller.id});`;
        let result = await db(query);
        let itemId = result.insertId;
        for(let i=0;i<req.files.length;i++){
            query = `INSERT INTO attachment(item_id,imgPath) VALUES(${itemId},"${req.files[i].filename}");`
            await db(query);
        }
        console.log("ITEM ADDED successfully")
    } catch (error) {
        console.log("Error while adding item",error);
        res.send("Error");
    }
})

//to edit an item
router.get("/edit/:id",async(req,res)=>{
    try {
        let query = `SELECT * FROM items WHERE items.id=${req.params.id} LIMIT 1;`;
        let result = await db(query);
        if(result.length==0){
            res.render("error");
            return;
        }
        let item = result[0];
        seller = res.locals.user;
        if(item.seller_id!=seller.id){
            res.render("error")
            return;
        }
        query = `SELECT attachment.imgPath FROM attachment WHERE attachment.item_id=${item.id}`
        result = await db(query);
        let attachments = [];
        for(let i=0;i<result.length;i++)
        {
            attachments.push(result[i].imgPath)
        }
        res.render("seller/editItem",{item,attachments});
        return;
    } catch (error) {
        console.log("Error While Opening Edit Item Page ",error);
        res.send("Internal Server Error");
    }
})

//router to delete an item
router.delete("/deleteItem/:id",async(req,res)=>{
    try {
        let query = `SELECT * FROM attachment WHERE item_id=${req.params.id};`;
        let result = await db(query);
        for(let i=0;i<result.length;i++)
        {
            fs.unlink(`public/uploads/${result[i].imgPath}`,(err)=>{
                if(err){
                  console.log("error while deleting image ",err);
                }else{
                  console.log("Image Deleted Successfully :) ");
                }
              })
        }
        query = `DELETE FROM items WHERE items.id = ${req.params.id};`;
        await db(query);
        console.log("Item Delete Successfully")
    } catch (error) {
        console.log("Error While Deleting Item")
        console.log(error);
    }
})

//To view the details of an order
router.get("/orders/order-details",(req,res)=>{
    res.render("seller/orderDetails");
})
module.exports = router;