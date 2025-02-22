import axios from 'axios'
import React, { useEffect, useState } from 'react'
import "../../styles/home/desktop/home_display_products.css"
import "../../styles/home/mobile/home_display_products_mobile.css"
import { useNavigate } from 'react-router-dom'
import { decrypt, encrypt } from '../utills/utills'

export const Home_display_products = (props) => {

    const {home_datas, save_home_datas, message_window, user_info, set_user_info, save_user_info, get_product_api, get_date, loading} = props.utills

    const navigate = useNavigate()
 
    // add to cart api
    const add_to_user_cart = async(product_id, action)=>{

        try{
            loading(true)
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add_del_cart`,{"product_id" : encrypt(product_id), "action" : encrypt(action)}, {withCredentials : true})
  
            if(res.data.success){
                save_user_info("cart", decrypt(res.data.cart))
                if(action==="add"){
                    message_window("Product added to cart", "good")
                }
            }

  
        }
        catch(err){
            const err_message = err.response ? err.response.data : null
  
            // if server cannot start
            if (err.code === "ERR_NETWORK"){
                message_window("Connection refused !", "bad")
            }
            
            // if server cannot start
            if (err_message.message === "product Out of stock"){
                message_window(err_message.message, "bad")
            }
        }

        loading(false)
    }

    // onclick add to cart button
    const handle_add_cart_buuton = (product_id)=>{
        // check user is logined or not
        if (user_info.name){
            // action for cart
            const action = user_info.cart && user_info.cart.includes(product_id) ? "del" : "add";

            add_to_user_cart(product_id, action)
        }
        // if user not login bring them to login page
        else{
            navigate("/login")
        }
    }

    // navigate to display single product
    const navigate_to_product = (product_id)=>{
        navigate(`/product?pid=${product_id}`)
    }

    // handle handle_buy_button
    const handle_buy_button = (product_id)=>{
        // if user not login
        if(!user_info.name){
            return navigate("/login")
        }

        navigate(`/order-summary?pid=${product_id}`)

    }

  return (
    <>

    <div className="display_product_parent_containner">

        {/* display product containner */}
        <div className="display_product_containner">

            

            {/* iterate the all products */}
            {home_datas.all_products.map((product, index)=>(
                // single product containner
                <div
                key={product._id || index} className="product_containner">

                    {/* product image containner */}
                    <div
                    onClick={()=>{navigate_to_product(product._id)}}
                    className="product_image_con">
                        <img src={`${product.image}`}
                        onError={(e)=>{
                            if(!e.target.dataset.fallback){
                                e.target.dataset.fallback = "true"
                                e.target.src = "images/product.svg";
                            }
                        }}
                        alt="no image" />
                    </div>

                    {/* product details containner */}
                    <div className="product_details_con">

                        {/* product name */}
                        <div
                        onClick={()=>{navigate_to_product(product._id)}}
                        className="product_name">
                            {product.name.length > 20 ? product.name.slice(0, 20)+"..." : product.name}
                        </div>

                        {/* product description */}
                        <div
                        onClick={()=>{navigate_to_product(product._id)}}
                        className="product_description">
                        {product.description.length > 20 ? product.description.slice(0, 20)+"..." : product.description}
                        </div>

                        {/* product prize containner */}
                        <div
                        onClick={()=>{navigate_to_product(product._id)}}
                        className="product_prize_conatinner">
                            {/* product prize */}
                            <div className="product_prize">₹ {product.prize}</div>
                            <s className="prize_strike">₹ {product.prize + 2500}</s>
                        </div>

                        {/* seller name */}
                        <div
                        onClick={()=>{navigate_to_product(product._id)}}
                        className="product_seller_name">
                            Seller : <span>{product.seller.length >=25 ? product.seller.slice(0, 25)+"..." : product.seller}</span>
                        </div>

                        {/* ratings */}
                        <div
                        onClick={()=>{navigate_to_product(product._id)}}
                        className="home_ratings">
                            <img src={`/images/star/star${product.ratings}.png`} alt="" />
                            <span>{product.reviews.length}</span>
                        </div>

                        {/* free delivery */}
                        <div
                        onClick={()=>{navigate_to_product(product._id)}}
                        className="product_free_delivery">
                            FREE delivery <span> {get_date(6)}</span>
                        </div>

                        {/* add cart and buy button */}
                        <div className="add_cart_and_buy_button">
                            {/* cart button */}
                            <button
                            onClick={()=>{handle_add_cart_buuton(product._id)}}
                            className={user_info.cart && user_info.cart.includes(product._id) ? "home_add_to_cart_button home_remove_cart_button" : "home_add_to_cart_button"}>
                                {user_info.cart && user_info.cart.includes(product._id) ? "Remove Cart" : "Add To Cart"}
                            </button>

                            {/* buy cutton */}
                            {product.stock > 0 && <button
                                onClick={()=>handle_buy_button(product._id)}
                                className='home_buy_button'
                            >Buy</button>}
                        </div>

                        {/* out of stack */}
                        {product.stock < 1 && 
                        <div className="product_out_of_stock">Out Of Stock</div>
                            }


                    </div>
                </div>
                
            ))}

        </div>
        



    </div>


    </>
  )
}
