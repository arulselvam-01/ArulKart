console.log("LOG --> APP.JS");
const express = require("express")
const app = express()
const path = require("path")
// set and config environmental variable
const env = require("dotenv")
env.config({path : path.join(__dirname, "config", "config.env")})
const cors = require("cors")
const bp = require("body-parser")
const cookie = require("cookie-parser")
const {connect_database} = require("./config/connect_database")

// import routes
const error_middleware = require("./middlewares/error_middleware")
const auth_router = require("./routers/auth_routes")
const account_router = require("./routers/account_routes")
const seller_router = require("./routers/seller_router")
const products_router = require("./routers/product_routes")
const order_router = require("./routers/order_routes")



    // server code from here

        // static folder for images
        app.use("/public", express.static(path.join(__dirname, "public")));

        // cookie
        app.use(cookie())

        // body parser 
        app.use(express.json())
        app.use(bp.urlencoded({extended: true}))

        // allow third party api calls and cookies
        app.use(cors({origin : true, credentials : true}))
        

    // connect database
    connect_database()

    // auth router
    app.use("/api", auth_router)
    // account router
    app.use("/api", account_router)
    // seller router
    app.use("/api", seller_router)
    // product router
    app.use("/api", products_router)
    // order router
    app.use("/api", order_router)


    // server frontend file
    if(process.env.NODE_ENV === "production"){
        app.use(express.static(path.join(__dirname, "build")))
        app.get("*", (req, res)=>{
            console.log("LOG --> SERVER INDEX.HTML")
            res.sendFile(path.resolve(__dirname, "build", "index.html"))
        })
    }

    
    // error handler
    app.use(error_middleware)

module.exports = app
