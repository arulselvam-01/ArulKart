const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator")


const mongoose = require("mongoose")

const user_schema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please Give Username !"]
    },

    email : {
        type : String,
        required : [true, "Please Give Email !"],
        validate : [validator.isEmail, "Please Enter Valid Email !"],
        unique : true
    },

    password : {
        type : String,
        required : [true, "Please Give Password !"],
        maxlength : [30, "Password Cannot Exceed 30 Characters"],
        select : false
    },

    avatar : {
        type : String,
        default : "no profile"
    },

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

    created_at : {
        type : Date,
        default : Date.now
    },

    cart : [
        {
            type : String
        }
    ]

})

// pre functions

// hash password
user_schema.pre("save", async function (next){
    if (!this.password){
        next()
    }
    // hasing the password
    this.password = await bcrypt.hash(this.password, 10)

})


//create session key / jwt token
user_schema.methods.generate_session_key = function(next){
    return jwt.sign({id : this.id}, process.env.JWT_ENCRYPTION_KEY, {expiresIn : process.env.JWT_ENCRYPTION_KEY_EXPIRES})
}

// check password
user_schema.methods.check_password = async function(entered_password){
    return await bcrypt.compare(entered_password, this.password)
}





const user_database =  mongoose.model("user", user_schema)

module.exports = user_database