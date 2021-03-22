const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const {ensureBuyer} = require("../middleware/authMiddleware");
const db = util.promisify(conn.query).bind(conn);
let buyer;

// all the routes will came here

//buyer dashboard route
router.get("/",async(req,res)=>{
    buyer = res.locals.user;
    let queryTopItems = `(SELECT * FROM items WHERE items.category='Grocery' LIMIT 4) UNION ALL (SELECT * FROM items WHERE items.category='Electronics' LIMIT 4) UNION ALL (SELECT * FROM items WHERE items.category='Clothing' LIMIT 4)
    UNION ALL (SELECT * FROM items WHERE items.category='Footwear' LIMIT 4) UNION ALL (SELECT * FROM items WHERE items.category='Stationary' LIMIT 4) UNION ALL (SELECT * FROM items WHERE items.category='Novels' LIMIT 4)
    UNION ALL (SELECT * FROM items WHERE items.category='Luggage' LIMIT 4) UNION ALL (SELECT * FROM items WHERE items.category='Furniture' LIMIT 4) UNION ALL (SELECT * FROM items WHERE items.category='Cosmetics' LIMIT 4)
    UNION ALL (SELECT * FROM items WHERE items.category='Health and Medicine' LIMIT 4) UNION ALL (SELECT * FROM items WHERE items.category='Games' LIMIT 4) UNION ALL (SELECT * FROM items WHERE items.category='Home and Kitchen' LIMIT 4)`;
    let topItems = await db(queryTopItems);
    let imgs = [];
    for(let i=0;i<topItems.length;i++)
    {
        let query = `SELECT imgPath FROM attachment WHERE attachment.item_id=${topItems[i].id} LIMIT 1`;
        let attachResult = await db(query);
        imgs.push(attachResult[0]);
    }
    res.render("home",{topItems: topItems,images: imgs})
})

// router to delete item from cart
router.delete("/deleteFromCart",async(req,res)=>{
    try {
        const {itemId,userId} = req.body;
        let query = `DELETE FROM cart WHERE user_id=${userId} AND item_id=${itemId};`;
        await db(query); 
        console.log("Item Deleted From Cart Successfully")
    } catch (error) {
        console.log("Error While Deleting Item From Cart ",error);
    }
})

// put route for updating quantity in user cart
router.put("/updateCart",async(req,res)=>{
    try {
        const {quantity,itemId,userId} = req.body;
        let query = `UPDATE cart SET quantity=${quantity} WHERE user_id=${userId} AND item_id=${itemId};`;
        await db(query); 
        console.log("Cart Updated Successfully")
    } catch (error) {
        console.log("Error While Updating Quantity In Cart ",error);
    }
})

//route for cart
router.get("/cart",ensureBuyer,async(req,res)=>{
    try {
        let query = `SELECT * FROM cart WHERE cart.user_id = ${res.locals.user.id};`;
        let result = await db(query);
        let items = [],quantity,price,name,img,id;
        for(let i=0;i<result.length;i++)
        {
            quantity = result[i].quantity;
            id = result[i].item_id;
            query = `SELECT * FROM items WHERE items.id=${id};`;
            let result2 = await db(query);
            name = result2[0].product_name;
            price =(result2[0].price - result2[0].discount*(result2[0].price)/100).toFixed(0);
            query = `SELECT * FROM attachment WHERE item_id=${id} LIMIT 1`;
            result2 = await db(query);
            img = result2[0].imgPath;
            let obj = {id,name,price,quantity,img};
            items.push(obj);
        }
        res.render("buyer/cart",{items});
    } catch (error) {
        console.log("Error While Fetching Data For Cart" ,error);
        res.send("Internal Server Error")
    }
})

//productinfo 
router.get("/productinfo/:id",async(req,res)=>{
    try {
        let query = `SELECT * FROM items WHERE items.id=${req.params.id} LIMIT 1;`;
        let result = await db(query);
        if(result.length==0){
            res.render("error");
            return;
        }
        let item = result[0];
        query = `SELECT attachment.imgPath FROM attachment WHERE attachment.item_id=${item.id}`
        result = await db(query);
        let attachments = [];
        for(let i=0;i<result.length;i++)
        {
            attachments.push(result[i].imgPath)
        }
        res.render("buyer/productinfo",{item,attachments});
        return;
    } catch (error) {
        console.log("Error While Opening Edit Item Page ",error);
        res.send("Internal Server Error");
    }
})

//route for wishlist
router.get("/wishlist",ensureBuyer,(req,res)=>{
    res.render("buyer/wishlist")
})

// route for proceed order
router.get("/proceedOrder",ensureBuyer,(req,res)=>{
    res.render("buyer/proceedOrder");
})

// router for adding item in cart
router.post("/addToCart",ensureBuyer,async(req,res)=>{

    try {
        const {itemId,userId} = req.body;
        let query = `INSERT INTO cart VALUES (${userId},${itemId},1) ON DUPLICATE KEY UPDATE quantity = quantity + 1;`;
        await db(query);
        console.log("Item Added To Cart Successfully")
    } catch (error) {
        console.log("Error While Adding Item In Cart ",error);
        res.send("Internal Server Error");
    }
})


module.exports = router;