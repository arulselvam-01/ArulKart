import React, { useEffect, useState } from 'react'
import "../../styles/cart/desktop/cart.css"
import "../../styles/cart/mobile/cart_mobile.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlaceOrder } from '../orders/PlaceOrder';
import { decrypt, encrypt } from '../utills/utills';

export const Cart = (props) => {

const {message_window, user_info, set_user_info, save_user_info, get_date, loading} = props.utills

const navigate = useNavigate()

const [no_data, set_no_data] = useState("")

  // calculate prize
  const sum_products_prize = ()=>{
    const totalPrize = user_info.cart_products.reduce((total, product) => total + product.prize, 0)

    return totalPrize
  }

// get cart products
useEffect(() => {
  if(user_info.cart.length < 1){
    set_no_data("No products in cart : (")
  }
  const controller = new AbortController(); // Create an AbortController
  const signal = controller.signal;

  const get_cart_products = async () => {
    try {
      set_no_data("")
      loading(true)
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get_cart`, {withCredentials: true, signal}
      );

      if (res.data.success) {
        // if no product
        if(decrypt(res.data.cart_products) && decrypt(res.data.cart_products).length < 1){
          set_no_data("No products in cart : (")
        }
        save_user_info("cart_products", decrypt(res.data.cart_products))

      }
    } catch (err) {
      set_no_data("No products in cart : (")
      // if server cannot start
      if (err.code === "ERR_NETWORK"){
        message_window("Connection refused !", "bad")
      }

    }

    loading(false)
  };

  get_cart_products();

    return () => {
      controller.abort()
    }
  }, [user_info.cart])
  


// delete cart
const delete_cart = async(product_id)=>{

  try{
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/del_cart`,{"product_id" : encrypt(product_id)}, {withCredentials : true})
      

      if(res.data.success){
          save_user_info("cart_products", decrypt(res.data.cart_products))

          // delete product id from cart in user_info
          save_user_info("cart", user_info.cart.filter(id => id !== product_id))
      }

  }
  catch(err){
      const err_message = err.response ? err.response.data : null

      // if server cannot start
      if (err.code === "ERR_NETWORK"){
          message_window("Connection refused !", "bad")
      }

  }
}




  return (
    <>
      <div className="cart_main_containner">

      {/* if products in cart */}
      {user_info.cart_products && user_info.cart_products.length > 0 ?
      <>
      <div className="cart_containner">
        {/* show shipping address */}
          <div className="show_shipping_address_containner">

            {/* address */}
            <div className="shipping_address">
              <p className='cart_delivered_to_name' >Delivered to : <span>{`${user_info.name}`}</span></p>
              <p className='cart_delivered_to_address' >{user_info.delivery_address.address}, {user_info.delivery_address.district}</p>
            </div>

            {/* change address button */}
            <button onClick={()=>navigate("/profile")} className="change_shipping_address_button">Change Address</button>
          </div>

          {/* show products */}
          <div className="cart_products_containner">
            
            {user_info.cart_products.map((product)=>(
              <div key={product._id} className="cart_product">
                
                {/* cart prodcut image */}
                <div
                onClick={()=>{navigate(`/product?pid=${product._id}`)}}
                className="cart_product_image">
                  <img src={product.image}
                  onError={(e)=>{
                  if(!e.target.dataset.fallback){
                      e.target.dataset.fallback = "true"
                      e.target.src = "images/product.svg";
                  }
                    }}
                    alt="no image" />
                </div>

                {/* cart prodcut info */}
                <div className="cart_product_info">

                  {/* product name */}
                  <div
                  onClick={()=>{navigate(`/product?pid=${product._id}`)}}
                  className="cart_product_name">
                    {product.name.length > 20 ? product.name.slice(0,20)+"..." : product.name}
                  </div>
                  
                  {/* product des */}
                  <div
                  onClick={()=>{navigate(`/product?pid=${product._id}`)}}
                  className="cart_product_des">
                    {product.description.length > 20 ? product.description.slice(0,20)+"..." : product.description}
                  </div>
                  
                  {/* product prize */}
                  <div
                  onClick={()=>{navigate(`/product?pid=${product._id}`)}}
                  className="cart_product_prize">
                  ₹ {product.prize} <s>₹ {product.prize + 2500}</s>
                  </div>
                  
                  {/* product seller */}
                  <div className="cart_product_seller">
                    Seller : <span>{product.seller}</span>
                  </div>
                  
                  {/* delivery data*/}
                  <div className="cart_product_delivery_date">
                      Delivery by {get_date(6)} | <span>FREE</span>
                  </div>

                  {/* cart_product_remove */}
                  <button
                    onClick={()=>delete_cart(product._id)}
                    className='cart_product_remove'
                  >Remove</button>

                  {/* out of stock */}
                  {product.stock < 1 && <><div className="cart_product_out_of_stock">Out Of Stock</div></>}

                </div>

              </div>
            ))}

          </div>


          {/* product summary */}
          <div className="product_summary_containner">
            {/* product details heading */}
            <div className="cart_product_details">
            Order Summary
            </div>

            {/* product details indo */}
            <div className="product_details_info">
              {/* prize */}
              <div className="product_summary_prize_name_and_prize">
                <div className="prize_name">Prize ({user_info.cart_products.length} items)</div>
                <div className="prize_value">₹ {sum_products_prize()}</div>
              </div>
              
              
              {/* delivery charges */}
              <div className="product_summary_dc_name_and_dc">
                <div className="dc_name">Delivery Charges</div>
                <div className="dc_value"><s>₹ {user_info.cart_products.length * 40} </s>Free</div>
              </div>
              
              {/* total amount */}
              <div className="product_summary_total_ammount_name_and_total_ammount">
                <div className="total_ammount_name">Total Amount</div>
                <div className="total_ammount_value">₹ {sum_products_prize()}</div>
              </div>


              {/* place order */}
              <PlaceOrder utills = {{"from" : "cart", products_id : user_info.cart, "save_user_info" : save_user_info, "user_info" : user_info, prize : sum_products_prize(), "message_window" : message_window, "loading" : loading}} />






            </div>

          </div>

      </div>
      </> 
      :
        // if no products in cart
      <>  
        <div className="no_cart_product">
            {no_data}
        </div>
      </>}



      </div>

    </>
  )
}
