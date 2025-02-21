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
const { encrypt } = require("../utills/utills")
const cloudinary = require("../cloudinary")



// add product
exports.add_product = catch_async_error(async(req, res, next)=>{
  console.log("LOG --> SELL PRODUCT - ADD PRODUCT")
    // get the user
    const seller = req.body.user
    // if user not in database 
    if (!seller){
        return next(new error_handler("Seller not found !", 401))
    }

    req.storage_folder = "products"

    upload_helper(req, res, async (error) => { 

      // if error while uploading
      if (error){
        return next(new error_handler(error));
      }



    // create new product
      const {product_name, product_des, product_prize, product_category, product_stock} = req.body
        
      // if reqired fields is not filled
      if (!product_name || !product_des || !product_prize || !product_category || !product_stock){
        // delete product image
        const uploaded_product_img = req.image_url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`users/${uploaded_product_img}`);

        return next(new error_handler("please enter required fields !", 401))
      }

      // max char
      if(product_name.length > 55 || product_des.length > 55){
        return next(new error_handler("characters cannot exceed 50 !", 401))
      }

      // create new product
      var product = await product_database.create({name : product_name, prize : product_prize, description : product_des, category : product_category, stock : product_stock, seller : seller.id, image : req.image_url})

      // reset the file name in req
      req.multer_new_image_name = undefined


    // send the response
      res.status(200).json({
        success : true,
        message: "product added successfully",
        product
      })

    })

})


// edit product
exports.edit_product = catch_async_error(async(req, res, next)=>{
  console.log("LOG --> SELL PRODUCT - EDIT PRODUCT")
    // get the seller
    const seller = req.body.user

    // if user not in database 
    if (!seller){
        return next(new error_handler("Seller not found !", 401))
    }

     // get edit product id
    const product_id = req.params.id

    // if no product id found in params
    if (!product_id){
      return next(new error_handler("product id not found !", 401))
  }

  // get and find product
  const product = await product_database.findById(product_id)
  if (!product){
    return next(new error_handler("product id not found !", 401))
  }


    req.storage_folder = "products"

    upload_helper(req, res, async (error) => { 

      // if error while uploading
      if (error){
        return next(new error_handler(error));
      }


    // edit product
      const {product_name, product_des, product_prize, product_category, product_stock} = req.body

        
      // if reqired fields is not filled
      if (!product_name || !product_des || !product_prize || !product_category || !product_stock){
          return next(new error_handler("please enter required fields !", 401))
      }

      // max char
      if(product_name.length > 55 || product_des.length > 55){
        return next(new error_handler("characters cannot exceed 50 !", 401))
      }

      // edit product
      // if image in body edit image name else ignore edit image
      if (req.body.is_update_image === "yes"){
        // delete old product image
        const old_product_img = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${old_product_img}`);

        await product_database.findByIdAndUpdate(product_id, {name : product_name, prize : product_prize, description : product_des, category : product_category, stock : product_stock, seller : seller.id, image : req.image_url})

      }else{
        await product_database.findByIdAndUpdate(product_id, {name : product_name, prize : product_prize, description : product_des, category : product_category, stock : product_stock, seller : seller.id})
      }

    // send the response
      res.status(200).json({
        success : true,
        message: "product Updated successfully",
      })

    })

})


// get selled products
exports.my_selled_products = catch_async_error(async(req, res, next)=>{
  console.log("LOG --> SELL PRODUCT - GET MY SELLED PRODUCTS")

    // get the seller
    const seller = req.body.user

    // if seller not in database 
    if (!seller){
        return next(new error_handler("Seller not found !", 401))
    }

    const my_selled_products = await product_database.find({seller : seller.id})

    // count total orders
    const orders = await order_database.find({seller : seller.id})

    // calculate total out of stock
    var total_order_prize = 0
    var total_orders = 0

    // calculate total orders and orders prize
    for (const order of orders){
      if (order.status == "pending"){
        total_order_prize+=order.prize
        total_orders+=1
      }
    }

    res.status(200).json({
      success : true,
      my_selled_products : encrypt(my_selled_products),
      total_orders : encrypt(total_orders),
      total_order_prize : encrypt(total_order_prize)
    })

})

// delete product
exports.delete_product = catch_async_error(async(req, res, next)=>{
  console.log("LOG --> SELL PRODUCT - DEL PRODUCT")

  // get the seller
  const seller = req.body.user

  // if seller not in database 
  if (!seller){
      return next(new error_handler("Seller not found !", 401))
  }

  const product_id = req.params.id

  // if product id not found
  if (!product_id){
    return next(new error_handler("Product ID not found !", 401))
  }

  await product_database.deleteOne({_id : product_id, seller : seller.id})
  await order_database.deleteOne({product : product_id})
  

  res.status(200).json({
    success : true
  })

})


// view orders
exports.product_orders = catch_async_error(async(req, res, next)=>{
  console.log("LOG --> SELL PRODUCT - GET SOLD PRODUCTS")

    // get the user
    const seller = req.body.user

    const {pid} = req.body

    // if user not in database 
    if (!seller){
        return next(new error_handler("Seller not found !", 401))
    }

    const orders = await order_database.find({product : pid})

    var my_sold_product = []

    for(const order of orders){
      const product = {}
      if (order.status == "pending"){
        // get username
        const user = await user_database.findById(order.user_id, {name : 1})
        product["username"] = user.name || "No User"
  
        // prize
        product["prize"] = order.prize
  
        // ordered data
        product["ordered_on"] = order.created_at
  
        my_sold_product.push(product)
      }

    }


    res.status(200).json({
      success : true,
      my_sold_product : encrypt(my_sold_product)
    })


})

