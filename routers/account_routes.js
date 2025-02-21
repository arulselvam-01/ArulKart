const express = require("express")
const { get_profile, change_password, change_username, delete_account, change_address, change_profile_picture } = require("../controllers/account_controller")
const { is_authenticated_user } = require("../middlewares/authenticated_user")
const account_router = express.Router()


// get user profile
account_router.get("/profile", is_authenticated_user, get_profile)

// change password
account_router.put("/change_password", is_authenticated_user, change_password)

// change username
account_router.put("/change_username", is_authenticated_user, change_username)

// change address
account_router.put("/change_address", is_authenticated_user, change_address)

// change profile picture
account_router.put("/change_profile", is_authenticated_user, change_profile_picture)

// delete account
account_router.delete("/delete_account", is_authenticated_user, delete_account)

module.exports = account_router