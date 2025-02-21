const express = require("express")
const { signup, login, logout, cook } = require("../controllers/auth_controller")
const auth_router = express.Router()


// signup user
auth_router.post("/signup", signup)

// login user
auth_router.post("/login", login)

// logout user
auth_router.delete("/logout", logout)




module.exports = auth_router