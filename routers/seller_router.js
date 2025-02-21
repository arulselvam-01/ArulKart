const express = require("express")
const { add_product, my_selled_products, delete_product, edit_product, seller_get_orders, product_orders } = require("../controllers/seller_controller")
const { is_authenticated_user } = require("../middlewares/authenticated_user")
const seller_router = express.Router()

// create new product
seller_router.post("/add_product", is_authenticated_user, add_product)

// edit product
seller_router.put("/edit_product/:id", is_authenticated_user, edit_product)

// get selled products
seller_router.get("/get_selled_products", is_authenticated_user, my_selled_products)

// delete product
seller_router.delete("/delete_product/:id", is_authenticated_user, delete_product)

// delete product
seller_router.post("/product_orders", is_authenticated_user, product_orders)



module.exports = seller_router