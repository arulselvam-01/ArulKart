const catch_async_error = require("../middlewares/catch_async_error")
const user_database = require("../models/user_model")
const error_handler = require("../utills/error_handler")
const product_database = require("../models/product_model")
const { products_filters } = require("../utills/product_filter")
const { resolve_seller_and_ratings } = require("../utills/resolve_seller_name_and_review")
const order_database = require("../models/order_model")
const { decrypt, encrypt } = require("../utills/utills")




// create order
exports.create_order = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> CREATE ORDER")
    const user = req.body.user

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    var {order_ids, from} = req.body
    order_ids = decrypt(order_ids)
    from = decrypt(from)

    if (!order_ids || order_ids.length < 1){
        return next(new error_handler("product id not found !", 401))
    }

    // check for out of stock
    for (const product_id of order_ids){
        const product = await product_database.findById(product_id)
        
        // check stock
        if (product.stock < 1){
            return next(new error_handler("Product out of stock", 401))
        }
    }


    // create order
    for (const product_id of order_ids){
        const product = await product_database.findById(product_id)

        // create order
        const ordered = await order_database.create({
            delivery_address : user.delivery_address, 
            user_id : user.id,
            product : product_id,
            prize : product.prize,
            seller : product.seller,
            status : "pending"

        })

        if(ordered){
            product.stock = product.stock - 1
            await product.save({validateBeforeSave : false})

            // remove from cart
            if(from == "cart"){
                await user_database.findByIdAndUpdate(user.id, {cart : []})
            }
        }
        
    }

    res.status(200).json({
        success : true
    })



})

// get my order
exports.get_orders = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> GET MY ORDERS")
    const user = req.body.user

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    // get order
    var orders = await order_database.find({user_id : user.id}).populate("product", "name description prize seller image created_at status");

    var my_orders = []

    if (orders){
        for(const order of orders){

            const single_ordered_product = {}

            // order id
            single_ordered_product["_id"] = order._id

            // if ordered product is remove by seller
            if (order.product){
                // product id
                single_ordered_product["pid"] = order.product._id
                
                // product created at
                single_ordered_product["created_at"] =  order.created_at
    
                // product image
                single_ordered_product["image"] = order.product.image
    
                // product name
                single_ordered_product["name"] = order.product.name
                
                // product des
                single_ordered_product["description"] = order.product.description
                
                // product prize
                single_ordered_product["prize"] = order.prize
                
                // product seller name
                const seller = await resolve_seller_and_ratings([order.product], "seller")
                single_ordered_product["seller"] = seller[0].seller
    
                // product status
                single_ordered_product["status"] = order.status

                my_orders.push(single_ordered_product)
            }
            
            



        }
    }



    res.status(200).json({
        success : true,
        my_orders : encrypt(my_orders)
    })

})


// cancel order
exports.cancel_order = catch_async_error(async(req, res, next)=>{
    console.log("LOG --> CANCEL ORDER")
    const user = req.body.user

    // if user not in database 
    if (!user){
        return next(new error_handler("User not found !", 401))
    }

    var {order_id, pid} = req.body
    order_id = decrypt(order_id)
    pid = decrypt(pid)

    if (!order_id){
        return next(new error_handler("product id not found !", 401))
    }

    await order_database.findByIdAndUpdate(order_id, {status : "Cancelled"})

    const product = await product_database.findById(pid, {stock : 1})

    product.stock +=1

    // increment the stock 1
    await product.save({validateBeforeSave : false})


    next()
})