const server = require("./app")
const path = require("path")
// set and config environmental variable
const env = require("dotenv")
env.config({path : path.join(__dirname, "config", "config.env")})

// server code from here

console.log("LOG --> SERVER.JS");


server.listen(process.env.PORT, ()=>console.log(`Server is litening on port : ${process.env.PORT} in ${process.env.NODE_ENV} mode`))