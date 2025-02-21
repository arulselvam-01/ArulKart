const catch_async_error = require("../middlewares/catch_async_error")
const user_database = require("../models/user_model")
const error_handler = require("../utills/error_handler")
const { send_session_key } = require("../utills/send_session_key")
const { decrypt } = require("../utills/utills")


// signup 
exports.signup = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> SIGNUP");
    var {name, email, password, confirm_password}= req.body
    name = decrypt(name)
    email = decrypt(email)
    password = decrypt(password)
    confirm_password = decrypt(confirm_password)

    if (password !== confirm_password){
        return next(new error_handler("Password does not match with confirm password!", 400))
    }

    // check user is already is exist or not
    const chcek_unique_email = await user_database.findOne({email})

    if (chcek_unique_email){
        return next(new error_handler("User already exist", 400))
    }

    // address
    const delivery_address = {phno : "", pincode : "", state : "", district : "", landmark : "", address : ""}

    // create new user
    const user = await user_database.create({name, email, password, delivery_address})



    // send cookie and response
    send_session_key(user, 200, res)

})

// login
exports.login = catch_async_error(async (req, res, next)=>{
    console.log("LOG --> LOGIN");
    var {email, password} = req.body

    email = decrypt(email)
    password = decrypt(password)
    

    if (!email || !password){
        return next(new error_handler("please enter valid email or password !", 401))
    }

    // get user
    const user = await user_database.findOne({email}).select("+password")

    // if given emial is not valid
    if (!user){
        return next(new error_handler("user does not found !", 401))
    }

    // check password
    if (!await user.check_password(password)){
        return next(new error_handler("Invalid password !", 401))
    }


    send_session_key(user, 200, res)

})


// logout
exports.logout = catch_async_error(async (req, res, next)=>{
    console.log("LOG --> LOGOUT")
    res.status(200)
        .cookie("arul_kart", undefined, {expires : new Date(Date.now())})
        .json({
            success : true
        })

})

