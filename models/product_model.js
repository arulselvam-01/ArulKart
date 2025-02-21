const mongoose = require("mongoose")

const product_schema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "please enter product name"],
        trim : true,
        maxlength : [200, "product name cannot exceed 100 characters"]
    },

    prize : {
        type : Number,
        default : 0.0
    },

    description : {
        type : String,
    },

    stock : {
        type : Number,
        required : [true, "please enter product stock"]
    },

    ratings : {
        type : String,
        default : 0
    },

    image : {
        type : String,
        default : "no image"
    },

    category : {
        type : String,
        required : [true, "please enter product category"],
        enum : {
            values : [
                "electronics",
                "tech",
                "mobile",
                "laptops",
                "accessories",
                "headphones",
                "food",
                "books",
                "clothes",
                "shoes",
                "beauty",
                "health",
                "sports",
                "outdoor",
                "home"
            ],
            message : "please select category"
        }
    },

    seller : {
        type : String,
        required : [true, "please enter seller id"],
    },

    reviews: [
        {
            user_id: {
                type: String, 
            },
            user_image: {
                type: String, 
            },
            user_name: {
                type: String, 
            },
            ratings: {
                type: String,
            },
            comment: {
                type: String,
            }
        }

      ],


    created_at : {
        type : Date,
        default : Date.now()
    }

})

const product_database = mongoose.model("product", product_schema)

module.exports = product_database

