const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const {ensureBuyer} = require("../middleware/authMiddleware");
const db = util.promisify(conn.query).bind(conn);

// all the routes will came here

//buyer dashboard route
router.get("/",async(req,res)=>{
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

//route for cart
router.get("/cart",ensureBuyer,(req,res)=>{
    res.render("buyer/cart")
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



module.exports = router;