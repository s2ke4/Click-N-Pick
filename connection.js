const mysql = require("mysql");
const dotenv = require("dotenv")
dotenv.config({path:"./.env"})


var conn;


var db_config = {
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
};

function handleDisconnect() {
  conn = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  conn.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }else{
        performOperation()
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  conn.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


const performOperation = ()=>{
    // if(err) throw err;
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
    conn.query(query1,(error,res)=> {
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

    // creating cart table
    query1 = "CREATE TABLE IF NOT EXISTS cart(user_id INT ,item_id INT,quantity INT,PRIMARY KEY(user_id,item_id),FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE,FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE);";
    conn.query(query1,(error,res)=>{
        if(error){
            console.log("Error While Creating Cart table");
            throw error;
        }
        console.log("cart table created successfully");
    })

    // creating wishList table
    query1 = "CREATE TABLE IF NOT EXISTS wishList(user_id INT,item_id INT,PRIMARY KEY(user_id,item_id),FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE,FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE);";
    conn.query(query1,(error,res)=>{
        if(error){
            console.log("Error While Creating wishList table");
            throw error;
        }
        console.log("wishList table created successfully");
    })

    // creating orders table
    query1 = "CREATE TABLE IF NOT EXISTS orders(order_num INT PRIMARY KEY AUTO_INCREMENT, order_date DATETIME DEFAULT now(),seller_id INT , user_id INT, order_amt INT, address VARCHAR(500) NOT NULL, dispatch BOOLEAN DEFAULT FALSE, FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE,FOREIGN KEY(seller_id) REFERENCES user(id) ON DELETE CASCADE);";
    conn.query(query1,(error,res)=>{
        if(error){
            console.log("Error while creating orders table");
            throw error;
        }
        console.log("orders table created successfully");
    })

    // creating order-item table
    query1 = "CREATE TABLE IF NOT EXISTS orderitem(order_num INT, item_id INT, quantity INT, price INT, discount INT, PRIMARY KEY(order_num,item_id), FOREIGN KEY(order_num) REFERENCES orders(order_num) ON DELETE CASCADE, FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE);";
    conn.query(query1,(error,res)=>{
        if(error){
            console.log("Error while creating orderitem table");
            throw error;
        }
        console.log("orderitem table created successfully");
    })
}

module.exports = conn;