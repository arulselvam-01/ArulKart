const express = require("express")
const { signup, login, logout, cook } = require("../controllers/auth_controller")
const { get_products, add_del_cart, get_cart, del_cart, get_single_product, add_review } = require("../controllers/product_controller")
const { is_authenticated_user } = require("../middlewares/authenticated_user")
const products_router = express.Router()


// get_products
products_router.get("/get_products", get_products)

// get single product
products_router.get("/get_single_product", get_single_product)

// add or del cart
products_router.post("/add_del_cart",is_authenticated_user,  add_del_cart)

// get cart products
products_router.get("/get_cart",is_authenticated_user,  get_cart)

// del cart product in cart button
products_router.put("/del_cart",is_authenticated_user,  del_cart, get_cart)

// add review
products_router.post("/add_review",is_authenticated_user,  add_review, get_single_product)


module.exports  = products_router