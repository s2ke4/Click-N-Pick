const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const conn = require("./connection");
const cookieParser = require("cookie-parser");
const {checkUser,ensureGuest,ensureBuyer,ensureSeller} = require("./middleware/authMiddleware");

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

app.get("*",checkUser);

app.get("/",ensureGuest,(req,res)=>{
    res.render("home");
})

//route for seller login and signup
app.use('/sellerAuth',require("./router/sellerAuth"));

//route for buyer login and signup
app.use("/buyerAuth",require("./router/buyerAuth"));

//route for seller dashboard
app.use("/seller",ensureSeller,require("./router/sellerDashboard"));

//route for buyer dashboard
app.use("/buyer",ensureBuyer,require("./router/buyerDashboard"))

app.use((req,res)=>{
    res.render("error");
})

app.listen(port,(req,res)=>{
    console.log(`Server is listening on port ${port}`);
})
