const express = require("express");
const router = express.Router();
const conn = require("../connection");
const bcrypt = require("bcryptjs");
const util = require('util');
const jwt = require("jsonwebtoken");
const {ensureGuest,ensureBuyer}  = require("../middleware/authMiddleware")

const MAXAGE = 3*60*60*24;
const db = util.promisify(conn.query).bind(conn);

const getToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:MAXAGE
    })
}
// all the routes will came here
//router for buyer login
router.get("/login",ensureGuest,(req,res)=>{
    res.render("buyer/authentication/login");
})

//post request for login
router.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        let query = `SELECT * FROM user WHERE user.email="${email}"`;
        let result = await db(query);
        if(result.length==0){
            res.render("buyer/authentication/login",{msg:"Email Or Password is Wrong"});
            return;
        }
        let isMatch = await bcrypt.compare(password,result[0].password);
        if(!isMatch){
            res.render("buyer/authentication/login",{msg:"Email Or Password is Wrong"});
            return;
        }
        if(result[0].role == "seller"){
            res.render("buyer/authentication/login",{msg:"This Account Not Belong To Buyer Account"});
            return;
        }
        let id = 'B' + result[0].id;
        const token = getToken(id);
        res.cookie("jwt",token,{
            maxAge:MAXAGE * 1000,
            httpOnly:true
        })
        res.redirect("/buyer");
    } catch (error) {
        console.log("Error While login");
        res.render("buyer/authentication/login",{msg:"Error Occured While login"});
        throw error;
    }
})

//router for buyer signup
router.get("/register",(req,res)=>{
    res.render("buyer/authentication/signup");
})

// post request for buyer register
router.post("/register",ensureGuest,async(req,res)=>{
    const {name,email,password,repassword} = req.body;

    if(password !=repassword){
        res.render("buyer/authentication/signup",{msg:"Password Not Match"});
    }else{
        (async()=>{
            try {
                let query = `SELECT * FROM user WHERE user.email = "${email}";`;
                let rows = await db(query);
                
                // it means user already exists
                if(rows.length > 0){
                    res.render("buyer/authentication/signup",{msg:"User Already Exists"});
                    return;
                }
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password,salt);

                query = `INSERT INTO user(name,email,password,role) VALUES("${name}","${email}","${hash}","buyer");`;
                rows  = await db(query);
                console.log("Buyer saved in user table successfully");
                
                let id = 'B' + rows.insertId;
                const token = getToken(id);
                res.cookie("jwt",token,{
                    maxAge:MAXAGE,
                    httpOnly:true
                })
                res.redirect("/buyer");

            } catch (error) {
                console.log("Error While Registering Buyer");
                res.render("buyer/authentication/signup",{msg:"Error Occured While Saving in database"});
                throw error;
            }
        })()
    }
})

router.get("/logout",ensureBuyer,(req,res)=>{
    res.cookie("jwt","",{maxAge:1});
    res.redirect("/");
})

module.exports = router;