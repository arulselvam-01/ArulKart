const catch_async_error = require("../middlewares/catch_async_error")
const user_database = require("../models/user_model")
const product_database = require("../models/product_model")
const error_handler = require("../utills/error_handler")



exports.resolve_seller_and_ratings = async (products, seller_ratings) => {

    // resolve the seller id with seller name
    if (seller_ratings === "seller"){
        var index = 0
        for (const product of products){
            const seller_id = product.seller
            try{         
                // seller name
                if(seller_id !== "Arul Selvam"){
                    const seller_name = await user_database.findById(seller_id, {name : 1})
                    products[index].seller = seller_name.name || "unknown seller"

                }
            }catch(err){}
    
            index+=1
        }
        
    
        return products
    }

    // resolve ratings user id with user name
    if (seller_ratings === "ratings"){
        for (const review of products.reviews){
            const user_id = review.user_id
            // if user id found
            if(user_id){
                try{
                    const user_info = await user_database.findById(user_id, {name : 1, avatar : 1, })
    
                    // if user info found
                    if(user_info){
                        review.user_image = user_info.avatar
                        review.user_name = user_info.name
                    }

                }catch(err){

                }

            }

        }

        return products
    }
}

