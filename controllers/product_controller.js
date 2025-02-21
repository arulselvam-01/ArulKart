const catch_async_error = require("../middlewares/catch_async_error")
const user_database = require("../models/user_model")
const error_handler = require("../utills/error_handler")
const product_database = require("../models/product_model")
const { products_filters } = require("../utills/product_filter")
const { resolve_seller_and_ratings } = require("../utills/resolve_seller_name_and_review")
const { decrypt, encrypt } = require("../utills/utills")



// get products 
exports.get_products = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> GET ALL PRODUCTS")
        
        
    // filter the product by query in params
    const database_query = products_filters(req.query)

    // pagenation
    const products_per_page = 15
    const currentpage = Number(req.query.page) || 1
    const skip = products_per_page * (currentpage -1)

    var products = await product_database.find(database_query).populate("seller", "name").skip(skip).limit(products_per_page)
    
    // resolve seller name
    products = await resolve_seller_and_ratings(products, "seller")

    const total_products_count = await product_database.countDocuments(database_query)

    if (!products){
        return next(new error_handler("No products found !", 401))
        
    }

    res.status(200).json({
        success :true,
        total_products_count,
        products,
        current_page : req.query.page || 1,
    })

})

// add and delete cart
exports.add_del_cart = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> ADD OR DEL PRODUCT")

    const user = req.body.user
    var {product_id, action} = req.body
    product_id = decrypt(product_id)
    action = decrypt(action)

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    if (!product_id || !action){
        return next(new error_handler("product id not found", 401))
    }

    // get user cart
    const user_cart_products = await user_database.findById(user.id)

    // add to cart
    if (action === "add"){
        const product = await product_database.findById(product_id, {stock : 1})
        if (product.stock > 0){
            user_cart_products.cart.push(product_id)
        }else{
            return next(new error_handler("product Out of stock", 401))
        }

    }
    // remove form cart
    else if (action === "del"){
        const product_id_index = user_cart_products.cart.indexOf(product_id)
        if (product_id_index > -1) {
            user_cart_products.cart.splice(product_id_index, 1);
        }
    }


    // save the cart product
    await user_cart_products.save({validateBeforeSave : false})

    res.status(200).json({
        success : true,
        cart : encrypt(user_cart_products.cart)
    })


})


// get cart
exports.get_cart = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> GET CART PRODUCTS")


    const user = req.body.user

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    // get the cart products id
    const cart_products_ids = await user_database.findById(user.id, {cart : 1})

    // get cart products
    var index = 0
    var cart_products = []
    for (let product_id of cart_products_ids.cart){
        const cart_product = await product_database.findById(product_id)

        if (cart_product){
            cart_products.push(cart_product)
        }else{
            // delete the cart product
            const del_product_id_index = cart_products_ids.cart.indexOf(product_id)
            cart_products_ids.cart.splice(del_product_id_index, 1)
            await cart_products_ids.save({validateBeforeSave : false})
        }
        index+=1
    }

    // resolve seller name
    if (cart_products){
        cart_products = await resolve_seller_and_ratings(cart_products, "seller")
    }

    res.status(200).json({
        success : true,
        cart_products : encrypt(cart_products)
    })

})


// del cart
exports.del_cart = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> DEL CART PRODUCT")
    const user = req.body.user

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    var {product_id} = req.body
    product_id = decrypt(product_id)

    if (!product_id){
        return next(new error_handler("product id not found", 401))
    }

    // get user cart
    const user_cart_products = await user_database.findById(user.id, {cart : 1})

    // remove form cart
    const product_id_index = user_cart_products.cart.indexOf(product_id)
    if (product_id_index > -1) {
        user_cart_products.cart.splice(product_id_index, 1);
    }

    // save the cart product
    await user_cart_products.save({validateBeforeSave : false})


    next()
    

})

// get single prodcut
exports.get_single_product = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> GET SINGLE PRODUCT INFO")

    const {pid} = req.query

    // if no pid
    if (!pid){
        return next(new error_handler("No products ID !", 401))
    }


    var product = await product_database.findById(pid)

    // if no product found
    if (!product){
        return next(new error_handler("Product not found !", 401))
    }
    
    // resolve seller name
    if(product.seller !== "Arul Selvam"){
        product.seller = (await user_database.findById(product.seller, {name : 1})).name
    }

    product = await resolve_seller_and_ratings(product, "ratings")


    
    res.status(200).json({
        success :true,
        product,
    })

})

// add review
exports.add_review = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> ADD REVIEW")
    const user = req.body.user

    // get product id
    const {pid} = req.query

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    // get star rate and comment
    const {star_no, comment} = req.body

    if (!star_no || !comment || !pid){
        return next(new error_handler("please rate the star!", 401))
    }

    // get the product
    var product = await product_database.findById(pid, {reviews : 1, ratings : 1})

    if (!product){
        return next(new error_handler("product not found !", 401))
    }

    var is_reviewed = false
    var total_user_ratings = 0
    var total_user_reviewed = 0

    // check user is alredy reviwed
    for (var review of product.reviews){
        if (review.user_id == user.id){
            is_reviewed = true
            review.user_id = user.id
            review.ratings = star_no.toString()
            review.comment = comment
        }
        
    }

    // if user not review
    if (!is_reviewed){
        product.reviews.push({user_id : user.id, ratings : star_no, "comment" : comment})
    }

    for (var review of product.reviews){

        // add ratings and users
        if (typeof review.ratings === "string"){
            total_user_reviewed+= 1
            total_user_ratings += Number(review.ratings)

        }
        
    }


    // calculate ratings total ratnings / total user
    const total_ratings = Math.floor(total_user_ratings / total_user_reviewed)
    if(typeof total_ratings === "number"){
        product.ratings = total_ratings.toString()
    }

    await product.save({validateBeforeSave : false})

    next()
    

    

})





