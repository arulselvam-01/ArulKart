const error_handler = require("../utills/error_handler")


module.exports = (err, req, res, next)=>{

    console.log(err)

    console.log("LOG --> ERR MIDDLEWARE")
    

    err.status_code = err.status_code || 500

    // error for development
    if (process.env.NODE_ENV==="development"){

        // send error report for development
        res.status(err.status_code).json({
            success : false,
            message : err.message,
            stack : err.stack
        })
    }

    // error for production
    if (process.env.NODE_ENV==="production"){
        var message = err.message
        var error = new error_handler(message)
        error.status_code = err.status_code || 500

        // cast error
        if (err.name === "castError"){
            message = "Resource Not Found !"
            error = new error_handler(message, 404)
        }

        // validation error
        if (err.name === "ValidationError"){
            message = Object.values(err.errors).map((bulk_err)=>bulk_err.message)
            error = new error_handler(message, 404)
        }


        // send error in production
        res.status(error.status_code).json({
            success : false,
            message : error.message || "Internal Server Error !"
        })
    }





}