const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const {ensureGuest} = require("../middleware/authMiddleware");
const db = util.promisify(conn.query).bind(conn);

//route to display the homepage of E-Commerce
router.get("/",ensureGuest,async(req,res)=>{
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
    res.render("home",{topItems: topItems,images: imgs});
})

//route to post the search keywords and filter
let filter;
let search;
router.post("/",(req,res)=>{
    filter = req.body.filter;
    search = req.body.search;
    res.redirect("search");
})

//route to get the search results
router.get("/search",async(req,res)=>{
    let searchQuery;
    try {

        if(filter==='All Categories')
            searchQuery = `SELECT * FROM items WHERE (items.product_name LIKE '%${search}%' OR items.brand_name LIKE '%${search}%' OR items.prod_description LIKE '%${search}')`;
        else
            searchQuery = `SELECT * FROM items WHERE items.category='${filter}' AND (items.product_name LIKE '%${search}%' OR items.brand_name LIKE '%${search}%' OR items.prod_description LIKE '%${search}')`;
        
        let searchResults = await db(searchQuery);
        let finalResult = [];
        for(let i=0;i<searchResults.length;i++)
        {
            let query = `SELECT imgPath FROM attachment WHERE attachment.item_id=${searchResults[i].id} LIMIT 1`;
            let attachResult = await db(query);
            let obj = searchResults[i];
            obj.img = attachResult[0].imgPath;
            finalResult.push(obj)
        }
        res.render("search",{results: finalResult,search: search,filter: filter});
    } 
    catch(e) {
        console.log("Errror in SQL Query : ",e);
    }
})


module.exports = router;