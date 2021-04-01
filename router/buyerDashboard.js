const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const {ensureBuyer} = require("../middleware/authMiddleware");
const { decodeBase64 } = require("bcryptjs");
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

// router to delete item from wishlist
router.delete("/deleteFromWishlist",async(req,res)=>{
    try {
        const {itemId,userId} = req.body;
        let query = `DELETE FROM wishlist WHERE user_id=${userId} AND item_id=${itemId};`;
        await db(query); 
        console.log("Item Deleted From wishlist Successfully")
    } catch (error) {
        console.log("Error While Deleting Item From wishlist ",error);
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
        let inWishList =false;
        if(res.locals.user){
            query = `SELECT * FROM wishlist WHERE item_id=${item.id} AND user_id = ${res.locals.user.id};`;
            let result2 = await db(query);
            inWishList = result2.length > 0;
        }
        query = `SELECT attachment.imgPath FROM attachment WHERE attachment.item_id=${item.id}`
        result = await db(query);
        let attachments = [];
        for(let i=0;i<result.length;i++)
        {
            attachments.push(result[i].imgPath)
        }
        query = `SELECT * FROM items WHERE items.category = "${item.category}" AND items.id <>${item.id} LIMIT 4;`;
        let similarItem = await db(query);
        let similarImg = [];
        for(let i=0;i<similarItem.length;i++)
        {
            query = `SELECT attachment.imgPath FROM attachment WHERE attachment.item_id=${similarItem[i].id} LIMIT 1`;
            result = await db(query);
            similarImg.push(result[0].imgPath);
        }
        res.render("buyer/productinfo",{item,attachments,inWishList,similarItem,similarImg});
        return;
    } catch (error) {
        console.log("Error While Opening Edit Item Page ",error);
        res.send("Internal Server Error");
    }
})

//route for your orders
router.get("/yourOrders",ensureBuyer,async(req,res)=>{
    let query = `SELECT order_num,DATE(order_date) as date,user_id,order_amt,address,dispatch FROM orders WHERE user_id=${res.locals.user.id};`;
    let orders = await db(query);
    let items = [];
    let index;
    for(let i=0;i<orders.length;i++)
    {
        let datetime = `${orders[i].date}`;
        console.log(datetime);
        let date = datetime.substring(4,15);
        orders[i].date = date;
        let item_id, item_name, quantity, price, totalPrice,order_num;
        index = orders[i].order_num;
        query = `SELECT * FROM orderitem WHERE order_num=${index}`;
        let result = await db(query);
        for(let j=0;j<result.length;j++)
        {
            quantity = result[j].quantity;
            item_id = result[j].item_id;
            order_num = result[j].order_num;
            query = `SELECT * FROM items WHERE id=${item_id}`;
            result2 = await db(query);
            item_name = result2[0].product_name;
            price = result2[0].price;
            totalPrice = result2[0].price * quantity;
            items.push({item_name,quantity,price,totalPrice,order_num});
        }
    }
    res.render("buyer/yourOrders",{orders: orders, items: items});
})

//route to view your order details
router.get("/yourOrders/yourOrderDetails",ensureBuyer,(req,res)=>{
    res.render("buyer/yourOrderDetails");
})

//route for wishlist
router.get("/wishlist",ensureBuyer,async(req,res)=>{
    try {
        let query = `SELECT * FROM wishlist WHERE user_id = ${res.locals.user.id};`;
        let result = await db(query);
        let items = [],price,name,img,id;
        for(let i=0;i<result.length;i++)
        {
            id = result[i].item_id;
            query = `SELECT * FROM items WHERE items.id=${id};`;
            let result2 = await db(query);
            name = result2[0].product_name;
            price =(result2[0].price - result2[0].discount*(result2[0].price)/100).toFixed(0);
            query = `SELECT * FROM attachment WHERE item_id=${id} LIMIT 1`;
            result2 = await db(query);
            img = result2[0].imgPath;
            let obj = {id,name,price,img};
            items.push(obj);
        }
        res.render("buyer/wishlist",{items})
    } catch (error) {
        console.log("Error While Fetching Data for wishlist ",error);
        res.send("Internal Server Error")
    }
})

// route for proceed order
router.get("/proceedOrder",ensureBuyer,async(req,res)=>{
    try {
        buyer = res.locals.user.id;
        let query = `SELECT * FROM cart WHERE cart.user_id = ${res.locals.user.id};`;
        let cartItems = await db(query);
        let items = [],quantity,price,name,img,id;
        for(let i=0;i<cartItems.length;i++)
        {
            quantity = cartItems[i].quantity;
            id = cartItems[i].item_id;
            query = `SELECT * FROM items WHERE items.id=${id};`;
            let resultItems = await db(query);
            name = resultItems[0].product_name;
            price =(resultItems[0].price - resultItems[0].discount*(resultItems[0].price)/100).toFixed(0);
            query = `SELECT * FROM attachment WHERE item_id=${id} LIMIT 1`;
            result2 = await db(query);
            img = result2[0].imgPath;
            let obj = {id,name,price,quantity,img};
            items.push(obj);
        }
            let orderAmount = 0;
            for(let i=0;i<items.length;i++)
            {
                orderAmount += (items[i].price * items[i].quantity);
            }
        res.render("buyer/proceedOrder",{items,orderAmount});
    } catch (error) {
        console.log("Error While Fetching Data For Cart" ,error);
        res.send("Internal Server Error")
    }
})

//route for placing the order
router.post('/proceedOrder',ensureBuyer,async(req,res)=>{
    let success = true;
    try {
        let query = `SELECT * FROM cart WHERE cart.user_id = ${buyer};`;
        let cartItems = await db(query);
        let items = [],quantity,price,id,resultItems,sellerId;
        for(let i=0;i<cartItems.length;i++)
        {
            quantity = cartItems[i].quantity;
            id = cartItems[i].item_id;
            query = `SELECT * FROM items WHERE items.id=${id};`;
            resultItems = await db(query);
            if(resultItems[0].num_of_items < quantity) {
                success = false;
                break;
            }
            sellerId = resultItems[0].seller_id;
            price =(resultItems[0].price - resultItems[0].discount*(resultItems[0].price)/100).toFixed(0);
            let obj = {id,sellerId,price,quantity};
            items.push(obj);
        }
        if(success===true) {
            let orderAmount = 0;
            items.sort((a,b)=>a.sellerId - b.sellerId)
            let address = req.body.address;
            let city = req.body.city;
            let country = req.body.Country;
            let pincode = req.body.pincode;
            address += " " + city + " " + country + " - " + pincode;
            for(let i=0;i<items.length;i++)
            {
                orderAmount = (items[i].price * items[i].quantity);
                let itemFromOneSeller = [];
                let currentSeller = items[i].sellerId;
                itemFromOneSeller.push(items[i]);
                while(i+1<items.length && items[i+1].sellerId==currentSeller){
                    itemFromOneSeller.push(items[i+1]);
                    i++;
                    orderAmount += (items[i].price * items[i].quantity);
                }
                query = `INSERT INTO orders(seller_id,user_id,order_amt,address) VALUES (${currentSeller},${buyer},${orderAmount},'${address}')`;
                resultItems = await db(query);
                let order_no = resultItems.insertId;
                for(let j=0;j<itemFromOneSeller.length;j++)
                {
                    query = `INSERT INTO orderitem VALUES(${order_no},${itemFromOneSeller[j].id},${itemFromOneSeller[j].quantity})`;
                    await db(query);
                }
            } 
            console.log("Order Placed Successfully!");

            //reducing the number of items from the items table
            for(let i = 0; i < cartItems.length; i++) {
                id = cartItems[i].item_id;
                query = `UPDATE items SET num_of_items = num_of_items - ${cartItems[i].quantity} WHERE (id=${id});`;
                await db(query);
            }

            //emptying the cart as the order has been placed
            query = `DELETE FROM cart WHERE user_id=${buyer}`;
            await db(query);
            console.log("Cart Emptied!");
        }
        
    } 
    catch(e) {
        console.log("Error while placing order : ",e);
    }

    if(success===true)
        res.redirect('orderPlaced');
    else
        res.redirect('errorPlacingOrder');
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

//router for adding item in wishlist
router.post("/addToWishlist",async(req,res)=>{
    try {
        const {itemId,userId} = req.body;
        let query = `INSERT INTO wishlist VALUES (${userId},${itemId});`;
        await db(query);
        console.log("Item Added To wishlist Successfully")
    } catch (error) {
        console.log("Error While Adding Item In wishlist ",error);
        res.send("Internal Server Error");
    }
})

// router for moving item in wishlist from cart
router.post("/moveToWishListFromCart",async(req,res)=>{
    try {
        const {itemId,userId} = req.body;
        let query = `REPLACE INTO wishlist VALUES (${userId},${itemId});`;
        await db(query);
        query = `DELETE FROM cart WHERE user_id=${userId} AND item_id=${itemId};`;
        await db(query); 
        console.log("Item move To wishlist Successfully")
    } catch (error) {
        console.log("Error While moving Item In wishlist ",error);
        res.send("Internal Server Error");
    }
})

//router for moving item from wishlist to cart
router.post("/moveToCartFromWishList",async(req,res)=>{
    try {
        const {itemId,userId} = req.body;
        let query = `INSERT INTO cart VALUES (${userId},${itemId},1) ON DUPLICATE KEY UPDATE quantity = quantity + 1;`;
        await db(query);
        query = `DELETE FROM wishlist WHERE user_id=${userId} AND item_id=${itemId};`;
        await db(query); 
        console.log("Item move To cart Successfully")
    } catch (error) {
        console.log("Error While moving cart In wishlist ",error);
        res.send("Internal Server Error");
    }
})



//router for confirming the placed order
router.get('/orderPlaced',ensureBuyer,(req,res)=>{
    res.render('buyer/orderPlaced');
})

//router for informing the error while placing order
router.get('/errorPlacingOrder',ensureBuyer,(req,res)=>{
    res.render('buyer/errorPlacingOrder');
})

router.get("/profile",ensureBuyer,async(req,res)=>{
    try {
        let query = `SELECT * FROM user WHERE user_id = ${res.locals.user.id};`;
        let result = await db(query);
        let user = [],address,name,password,id,email;
        id = result[0].id;
        name = result[0].name;
        email = result[0].email;
        password = result[0].password;
        address = result[0].address;
        let obj = {id,name,email,password,address};
        user.push(obj);
        res.render("buyer/profile",{user})
    } catch (error) {
        console.log("Error While Fetching Data for wishlist ",error);
        res.send("Internal Server Error")
    }
})


module.exports = router;