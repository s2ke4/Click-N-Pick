const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const conn = require("./connection");
const cookieParser = require("cookie-parser");
const {checkUser,ensureGuest,ensureSeller} = require("./middleware/authMiddleware");
const methodOverride = require("method-override");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);

conn.connect((err)=>{
    if(err) throw err;
    // code for creating database

    // let query1 = `CREATE DATABASE ${process.env.DATABASE}`;
    // conn.query(query1,(error,res)=>{
    //     if(error){
    //         console.log("Error while creating database");
    //         throw error;
    //     }
    //     console.log("Database created successfully")
    // })
    console.log("Successfully Connected To Database.")

    // creating user table
    let query1 = "CREATE TABLE IF NOT EXISTS user(id INT PRIMARY KEY AUTO_INCREMENT,name TEXT,email TEXT,password TEXT,role TEXT);";
    conn.query(query1,(error,res)=>{
        if(error){
            console.log("Error While Creating user table");
            throw error;
        }
        console.log("USER table created successfully");
    })

    //creating seller table
    query1 = "CREATE TABLE IF NOT EXISTS seller(id INT PRIMARY KEY,phone_number TEXT,address TEXT,FOREIGN KEY(id) REFERENCES user(id) ON DELETE CASCADE);";
    conn.query(query1,(error,res)=>{
        if(error){
            console.log("Error While Creating seller table");
            throw error;
        }
        console.log("seller table created successfully");
    })

    //creating item table
    query1 = "CREATE TABLE IF NOT EXISTS items(id INT PRIMARY KEY AUTO_INCREMENT,product_name TEXT,brand_name TEXT,price INT,discount INT,num_of_items INT,product_color TEXT,category TEXT,prod_description TEXT,seller_id INT,FOREIGN KEY(seller_id) REFERENCES seller(id) ON DELETE CASCADE);";
    conn.query(query1,(error,res)=>{
        if(error){
            console.log("Error While Creating items table");
            throw error;
        }
        console.log("items table created successfully");
    })

    //creating attachemnt table
    query1 = "CREATE TABLE IF NOT EXISTS attachment(id INT PRIMARY KEY AUTO_INCREMENT,item_id INT,imgPath TEXT,FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE);";
    conn.query(query1,(error,res)=>{
        if(error){
            console.log("Error While Creating attachment table");
            throw error;
        }
        console.log("attachment table created successfully");
    })
})

app.use(express.static("./public/"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

// to override method
app.use(methodOverride('X-HTTP-Method-Override'));

app.get("*",checkUser);

//route to display the homepage of E-Commerce
app.get("/",ensureGuest,async(req,res)=>{
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
app.post("/",(req,res)=>{
    filter = req.body.filter;
    search = req.body.search;
    res.redirect("search");
})

//route to get the search results
app.get("/search",async(req,res)=>{
    let searchQuery;
    try {

        if(filter==='All Categories')
            searchQuery = `SELECT * FROM items WHERE (items.product_name LIKE '%${search}%' OR items.brand_name LIKE '%${search}%' OR items.prod_description LIKE '%${search}')`;
        else
            searchQuery = `SELECT * FROM items WHERE items.category='${filter}' AND (items.product_name LIKE '%${search}%' OR items.brand_name LIKE '%${search}%' OR items.prod_description LIKE '%${search}')`;
        
        let searchResults = await db(searchQuery);
        let imgs=[];
        for(let i=0;i<searchResults.length;i++)
        {
            let query = `SELECT imgPath FROM attachment WHERE attachment.item_id=${searchResults[i].id} LIMIT 1`;
            let attachResult = await db(query);
            imgs.push(attachResult[0]);
        }
        console.log(searchResults,search,filter);
        res.render("search",{results: searchResults,images: imgs,search: search,filter: filter});
    } 
    catch(e) {
        console.log("Errror in SQL Query : ",e);
    }
    
    
})



//route for seller login and signup
app.use('/sellerAuth',require("./router/sellerAuth"));

//route for buyer login and signup
app.use("/buyerAuth",require("./router/buyerAuth"));

//route for seller dashboard
app.use("/seller",ensureSeller,require("./router/sellerDashboard"));

//route for buyer dashboard
app.use("/buyer",require("./router/buyerDashboard"))

app.use((req,res)=>{
    res.render("error");
})

app.listen(port,(req,res)=>{
    console.log(`Server is listening on port ${port}`);
})
