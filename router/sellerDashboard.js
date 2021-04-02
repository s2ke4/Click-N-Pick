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
router.get("/",async(req,res)=>{
    seller = res.locals.user;
    let query = `SELECT * FROM items WHERE items.seller_id=${seller.id};`;
    let result = await db(query);
    let attachment = [];
    for(let i=0;i<result.length;i++)
    {
        query = `SELECT imgPath FROM attachment WHERE attachment.item_id=${result[i].id} LIMIT 1`;
        let attachResult = await db(query);
        attachment.push(attachResult[0]);
    }
    res.render("seller/dashboard",{items:result,images:attachment,path:'/seller'})
})

//Add items route for dashboard
router.get("/addItem",(req,res)=>{
    seller = res.locals.user;
    res.render("seller/addItem",{path:'/seller/addItem'});
    
})

//Orders route to view the orders received by the seller
router.get("/orders",async(req,res)=>{
    try {
        seller = res.locals.user;
        let query = `SELECT order_num,DATE(order_date) as date,user_id,order_amt,dispatch FROM orders WHERE seller_id=${seller.id};`;
        let result = await db(query);
        let orders=[];
        for(let i=0;i<result.length;i++)
        {
            let datetime = `${result[i].date}`;
            let obj = result[i];
            obj.date = datetime.substring(4,15);
            query = `SELECT name FROM user WHERE user.id = ${obj.user_id};`;
            let response = await db(query);
            obj.name = response[0].name;
            orders.push(obj);
        }
        res.render("seller/orders",{path:'/seller/orders',orders});
    } catch (error) {
        console.log("Error While Fetching Order : ",error)
    }
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

//route for product info
router.get("/productInfo/:id",async(req,res)=>{
    try {
        let query = `SELECT * FROM items WHERE items.id=${req.params.id} AND items.seller_id = ${res.locals.user.id};`
        let result = await db(query);
        if(result.length==0){
            res.render("error")
            return;
        }
        let item = result[0];
        query = `SELECT * FROM attachment WHERE attachment.item_id=${item.id};`;
        result = await db(query);
        let attachments = [];
        for(let i=0;i<result.length;i++)
        {
            attachments.push(result[i].imgPath)
        }
        res.render("seller/productInfo",{item,attachments,path:'product info'});
        return;
    } catch (error) {
        console.log("Error While showing product info ",error);
        res.send("Internal Server Error");
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
        res.render("seller/editItem",{item,attachments,path:'editing item'});
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
router.get("/orders/order-details/:id",async(req,res)=>{
    try {
        let orderNum = req.params.id;
        let query = `SELECT * FROM orders WHERE order_num = ${orderNum};`;
        let result = await db(query);
        if(result.length==0 || result[0].seller_id!=res.locals.user.id){
            res.render("error")
            return;
        }
        let customer_id = result[0].user_id;
        let order_amt = result[0].order_amt;
        let dispatch = result[0].dispatch;
        query = `SELECT name FROM user WHERE user.id = ${customer_id};`;
        result = await db(query);
        let customerName = result[0].name;
        query = `SELECT * FROM orderitem WHERE order_num = ${orderNum};`;
        result = await db(query);
        let items = [];
        for(let i=0;i<result.length;i++)
        {
            query = `SELECT * FROM items WHERE items.id=${result[i].item_id};`;
            let response= await db(query);
            let product_name =response[0].product_name;
            let quantity = result[i].quantity;
            let id = response[0].id
            let obj = {product_name,id,quantity}
            items.push(obj);
        }
        let generalInfo = {customerName,dispatch,orderNum,order_amt};
        res.render("seller/orderDetails",{path: '/seller/orders',generalInfo,items});
    } catch (error) {
        console.log("Error While showing particular detail")
        console.log(error);
    }
})

//put request to update an item
router.put("/editItem/:id",upload.array("photos",100),async(req,res)=>{
    try {
        const removeImages= req.body.remove;
        const {productName,brandName,price,discount,numberOfItems,productColour,category,description} = req.body;

        
        let query;
        if(removeImages){
            // deleting images from local folder
            for(let i=0;i<removeImages.length;i++)
            {
                fs.unlink(`public/uploads/${removeImages[i]}`,(err)=>{
                    if(err){
                    console.log("error while deleting image ",err);
                    }else{
                    console.log("Image Deleted Successfully :) ");
                    }
                })
            }
            // deleting image row from attachment table
            removeImages.forEach(async(img)=>{
                query = `DELETE FROM attachment WHERE attachment.item_id=${req.params.id} attachment.imgPath=${img};`;
                await db(query);
            })
        }
        // adding new images in attachment table
        for(let i=0;i<req.files.length;i++){
            query = `INSERT INTO attachment(item_id,imgPath) VALUES(${req.params.id},"${req.files[i].filename}");`
            await db(query);
        }
        // update in item table
        query = `UPDATE items SET product_name="${productName}",brand_name="${brandName}",price=${price},discount=${discount},num_of_items=${numberOfItems},product_color="${productColour}",category="${category}",prod_description="${description}" WHERE items.id=${req.params.id} AND items.seller_id=${seller.id};`;
        await db(query);
        console.log("Item updated successfully")
    } catch (error) {
        console.log("Error While Updating ",error);
    }
})
module.exports = router;