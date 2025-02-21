const mongoose = require("mongoose")

exports.connect_database = ()=>{
    // connect to database
    mongoose.connect(process.env.DATABASE_URL)
            .then((con)=>{
                console.log(`Database connected successfully ${con.connection.host}`)
            })
            .catch((err)=>{
                console.log(err)
            })
}