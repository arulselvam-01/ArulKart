const catch_async_error = require("./catch_async_error");
const jwt = require("jsonwebtoken");
const error_handler = require("../utills/error_handler");
const user_database = require("../models/user_model");


// is logined user
exports.is_authenticated_user = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> IS_AUTHENTICATED_USER / GET COOKIE")
    // get cookie from request
    const {arul_kart} = req.cookies

    // if there is no token in request
    if (!arul_kart){
        return next(new error_handler("login or signup"), 402)
    }

    // decode id from cookie
    const decoded_cookie = jwt.verify(arul_kart, process.env.JWT_ENCRYPTION_KEY)

    const user_id = decoded_cookie.id


    // if there is no id found in cookie
    if (!user_id){
        return next(new error_handler("login or signup"), 401)
    }

    // find the user from database using decoded cookie
    const user = await user_database.findById(user_id)

    // if there is no id found in user database
    if (!user){
        return next(new error_handler("login or signup"), 401)
    }


    req.body.user = user

    next()

})