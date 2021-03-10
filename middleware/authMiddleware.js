const jwt = require("jsonwebtoken")
const conn = require("../connection");
const util = require("util")
const db = util.promisify(conn.query).bind(conn);

const ensureSeller = (req,res,next) =>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,decodedToken)=>{
            if(err){
                res.redirect("/");
                throw err;
            }
            if(decodedToken.id[0]=='B'){
                res.redirect("/buyer");
            }else{
                next();
            }
        })
    }else{
        res.redirect("/");
    }
}

const ensureBuyer = (req,res,next) =>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,decodedToken)=>{
            if(err){
                res.redirect("/");
                throw err;
            }
            if(decodedToken.id[0]=='S'){
                res.redirect("/seller");
            }else{
                next();
            }
        })
    }else{
        res.redirect("/");
    }
}

const checkUser = async(req,res,next)=>{
    let token = req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,async(err,decodedToken)=>{
            if(err){
                res.locals.user = null;
                console.log(err.message);
                next();
            }
            let userId = decodedToken.id.substr(1);
            let query = `SELECT * FROM user WHERE user.id=${userId}`
            let result = await db(query);
            res.locals.user = result[0];
            next();
        })
    }else{
        res.locals.user = null;
        next();
    }
}

const ensureGuest = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,decodedToken)=>{
            if(err){
                next();
                throw err;
            }
            if(decodedToken[0]=='B'){
                res.redirect("/buyer");
            }else{
                res.redirect("/seller")
            }
        })
    }else{
        next();
    }
}

module.exports = {ensureSeller,checkUser,ensureGuest,ensureBuyer}