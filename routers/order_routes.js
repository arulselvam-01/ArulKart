const express = require("express")
const { get_profile, change_password, change_username, delete_account, change_address, change_profile_picture } = require("../controllers/account_controller")
const { is_authenticated_user } = require("../middlewares/authenticated_user")
const { create_order, get_orders, cancel_order } = require("../controllers/order_controller")
const order_router = express.Router()


// create orders
order_router.post("/create_order", is_authenticated_user, create_order)

// get orders
order_router.get("/get_orders", is_authenticated_user, get_orders)

// cancel order
order_router.post("/cancel_order", is_authenticated_user, cancel_order, get_orders)


module.exports = order_router
