const mongoose = require("mongoose")

const order_schema = new mongoose.Schema({
    delivery_address : {
        
        phno : {
            type : String
        },
        
        pincode : {
            type : String
        },
        state : {
            type : String
        },
        district : {
            type : String
        },
        landmark : {
            type : String
        },
        address : {
            type : String
        }

        
    },

    user_id : {
        type : String,
        required : true,
    },

    product : {
        type :  mongoose.Schema.Types.ObjectId,
        required : [true, "invalid product id"],
        ref : "product"
    },

    prize : {
        type : Number,
        required : true,
    },

    seller : {
        type : String
    },

    status : {
        type : String,
    },

    created_at : {
        type : Date,
        default : Date.now
    }

})

const order_database = mongoose.model("order", order_schema)


module.exports = order_database