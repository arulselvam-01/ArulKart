import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "../../styles/product/desktop/Product_display.css"
import "../../styles/product/mobile/Product_display_mobile.css"
import { useNavigate } from 'react-router-dom';
import { Product_review } from './Product_review';
import { decrypt, encrypt } from '../utills/utills';

export const Product_display = (props) => {
  const {pid, message_window, user_info, set_user_info, save_user_info, get_date, loading} = props.utills

  const navigate = useNavigate()

  const [product, set_product] = useState("error")

  const [star_data, set_star_data] = useState({
      // star image datas
      star_no : 0,
      change_star : true,

      // comment
      comment : "",

      // review datas
      show_comment : false,

      // no product
      no_data : ""
    })

  const save_star_data = (key, value)=>{
  set_star_data((old)=>(
      {...old, [key] : value}
  ))
  }

  useEffect(() => {
        const controller = new AbortController(); // Create an AbortController
        const signal = controller.signal;
    
        const get_single_product = async () => {
          try {
            save_star_data("no_data", "")
            loading(true)

            const res = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/get_single_product?pid=${pid}`, {withCredentials: true, signal}
            );
    
            if (res.data.success) {
              set_product(res.data.product)
              
            }

          } catch (err) {
            save_star_data("no_data", "Product Not Found !")
            set_product("error")
            // if server cannot start
            if (err.code === "ERR_NETWORK"){
              message_window("Connection refused !", "bad")
            }

          }
          loading(false)

        }

        get_single_product();
    
        return () => {
          controller.abort()
        }
      }, [pid])

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

// handle buy button 
const handle_buy_button = (product_id, stock)=>{
  // if user not logined
  if (!user_info.name){
    return navigate("/login")
  }else{
    navigate(`/order-summary?pid=${product_id}`)
  }
}



  return (
    <>
    {/* display single */}
    {product === "error" ?
    // if no product found
    (
    <div className="single_product_not_found">{star_data.no_data}</div>
    )
    :
    // display product
    <>
    {/* product canvas */}
    <div className="product_canvas">
        <div className="product_display_containner">

            {/* images  */}
            <div className="single_product_image_con">
            {product.stock < 1 && <p className='single_product_out_of_stock'>Out Of Stock</p>}
            <img
                src={`${product.image}`}
                onError={(e)=>{
                    if(!e.target.dataset.fallback){
                        e.target.dataset.fallback = "true"
                        e.target.src = "images/product.svg";
                    }
                }}
                alt="no image" />
            </div>

          {/* divider */}
          <div className="single_product_divider"></div>

          {/* single product info */}
          <div className="single_product_info">

            {/* product name */}
            <div className="single_product_name">
            {product.name.length > 20 ? product.name.slice(0,20)+"..." : product.name}
            </div>

            {/* product des */}
            <div className="single_product_des">
            {product.description.length > 20 ? product.description.slice(0,20)+"..." : product.description}
            </div>

            {/* product prize */}
            <div className="single_product_prize">
            ₹ {product.prize} <s>₹ {product.prize + 2500}</s>
            </div>

            {/* seller name*/}
            <div className="single_product_seller_name">
              Seller : <span>{product.seller}</span>
            </div>

            {/* ratings */}
            <div className="single_product_raings">
              <img src={`/images/star/star${product.ratings}.png`} alt="" />
               Reviewed <span>{product.reviews.length}</span>
            </div>

            {/* delivery by */}
            <div className="single_product_delivery_by">
            Delivery by {get_date(6)} | <span>FREE</span>
            </div>


            {/* buy button and cart button */}
            <div className="single_product_buy_cart_button">
              
              {/* add to cart button */}
              <button
              onClick={()=>{handle_add_cart_buuton(product._id)}}
              className={user_info.cart && user_info.cart.includes(product._id) ? "single_product_add2cart_button single_product_remove_cart_button" : "single_product_add2cart_button"} >{user_info.cart && user_info.cart.includes(product._id) ? "Remove Cart" : "Add To Cart"}</button>
              
              {/* buy button */}
              {product.stock > 0 && <button
              onClick={()=>{handle_buy_button(product._id)}}
              className='single_product_buy_button' >Buy</button>}
            </div>

          </div>

        {/* divider */}
        <div className="single_product_divider"></div>



        {/* product review */}
        <Product_review utills={{"user_info" : user_info, "set_user_info" : set_user_info, "message_window" : message_window, "save_user_info" : save_user_info, "pid" : pid, "product" : product, "save_star_data" : save_star_data, "star_data" : star_data, "set_product" : set_product, "loading" : loading}} />



            
            

        </div>
    </div>
        
    </>}

    </>
  )
}
