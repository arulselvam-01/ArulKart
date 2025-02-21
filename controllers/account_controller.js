const catch_async_error = require("../middlewares/catch_async_error")
const user_database = require("../models/user_model")
const error_handler = require("../utills/error_handler")
const { send_session_key } = require("../utills/send_session_key")
const {upload_helper} = require("../file_upload")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const product_database = require("../models/product_model")
const order_database = require("../models/order_model")
const { decrypt, encrypt } = require("../utills/utills")
const cloudinary = require("../cloudinary")



// get user profile info
exports.get_profile = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> GET PROFILE");

    const user = req.body.user

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    // ingnore __v
    user.__v = undefined


    res.status(200).json({
        success : true,
        user : encrypt(user)
    })

})


// change user password
exports.change_password = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> CHANGE PASSWORD");

    const user = req.body.user
    var {old_password, new_password, confirm_password} = req.body

    old_password = decrypt(old_password)
    new_password = decrypt(new_password)
    confirm_password = decrypt(confirm_password)

    // check all requires fields are filled or not
    if (!old_password || !new_password || !confirm_password){
        return next(new error_handler("Please enter all required fields !", 401))
    }

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    // check confirm password
    if (new_password !== confirm_password){
        return next(new error_handler("password does not match with confirm password !", 401))
    }

    // get the user
    const password_user = await user_database.findById(user.id).select("+password")

    // check old password is correct or wrong
    if(!await password_user.check_password(old_password)){
        return next(new error_handler("Old password is incorrect !", 401))
    }

    // change password
    password_user.password = new_password
    await password_user.save({validateBeforeSave : false})

    res.status(200).json({
        success : true,
        message : "password saved successfully"
    })

})


// change user name
exports.change_username = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> CHANGE USERNAME");

    const user = req.body.user
    var {new_username} = req.body
    new_username = decrypt(new_username)

    // check all requires fields are filled or not
    if (!new_username){
        return next(new error_handler("please enter username !", 401))
    }

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    // get the user
    const new_user = await user_database.findByIdAndUpdate(user.id, {name : new_username}, {new :true})


    res.status(200).json({
        success : true,
        message : "username changed successfully",
        new_username : encrypt(new_user.name)
    })

})


// change address
exports.change_address = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> CHANGE ADDRESS");

    const user = req.body.user
    var {new_phno, new_pincode, new_state, new_district, new_landmark, new_address} = req.body

    new_phno = decrypt(new_phno)
    new_pincode = decrypt(new_pincode)
    new_state = decrypt(new_state)
    new_district = decrypt(new_district)
    new_landmark = decrypt(new_landmark)
    new_address = decrypt(new_address)

    // check all requires fields are filled or not
    if (!new_phno || !new_pincode || !new_state || !new_district || !new_landmark || !new_address){
        return next(new error_handler("please enter required fields !", 401))
    }


    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    const delivery_address = {phno : new_phno, pincode : new_pincode, state : new_state, district : new_district, landmark : new_landmark, address : new_address}

    // get the user
    const new_user = await user_database.findByIdAndUpdate(user.id, {delivery_address : delivery_address}, {new :true})


    res.status(200).json({
        success : true,
        message : "address changed successfully",
        new_delivery_address : encrypt(new_user.delivery_address)
    })

})


// change profile picture
exports.change_profile_picture = (req, res, next) => {
    console.log("LOG --> CHANGE PROFILE PICTURE");
  
    const user = req.body.user;
    if (!user) return next(new error_handler("User not found!"));

    // storage folder
    req.storage_folder = "users"
  
    upload_helper(req, res, async (error) => { 

    // if error while uploading
      if (error){
        return next(new error_handler(error));
      }

    // after image succesully uploaded
  
      // Delete old Cloudinary profile image (if exists)
      if (user.avatar) {
        const old_avatar = user.avatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`users/${old_avatar}`);
      }
  
      // Save new avatar URL in the database
      user.avatar = req.image_url;
      await user.save({ validateBeforeSave: false });
  
      res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        new_avatar: encrypt(user.avatar),
      });
    });
  };
  

// delete account
exports.delete_account = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> DEL ACCOUNT");

    const user = req.body.user

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    // get the user and delete user
    await user_database.findByIdAndDelete(user.id)

    // delete user selled product
    await product_database.deleteMany({seller : user.id})
    
    // delete orders that user selled product
    await order_database.deleteMany({seller : user.id})


    res.status(200)
        .cookie("arul_kart", undefined, {maxAge : 0})
        .json({
        success : true,
        message : "Account deleted successfully",
    })

})



