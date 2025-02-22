import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { decrypt, encrypt } from '../utills/utills';

export const Orders = (props) => {

  const {message_window, user_info, set_user_info, save_user_info, get_date, loading} = props.utills

  const navigate = useNavigate()

  const [no_data, set_no_data] = useState("")

  useEffect(() => {
    const controller = new AbortController(); // Create an AbortController
    const signal = controller.signal;

    const get_orders = async () => {
      try {
        set_no_data("")
        loading(true)

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/get_orders`, {withCredentials: true, signal}
        );

        if (res.data.success) {
          // no orders found
          if(decrypt(res.data.my_orders) && decrypt(res.data.my_orders).length < 1){
            set_no_data("No Orders Found !")
          }

          save_user_info("my_orders", decrypt(res.data.my_orders))
        }

      } catch (err) {
        set_no_data("No Orders Found !")
        
        // if server cannot start
        if (err.code === "ERR_NETWORK"){
          message_window("Connection refused !", "bad")
        }

      }
      loading(false)
    }

    get_orders()

    return () => {
      controller.abort()
    }
  }, [])

  const product = user_info.my_orders

  function formatDate(dateString) {
    const date = new Date(dateString);
  
    const options = { weekday: 'short', day: '2-digit', month: 'short' }; // e.g., Tue 21 Jan
    return date.toLocaleDateString('en-GB', options);
  }

  const cancel_order = async (order_id, pid)=>{
    try {
      loading(true)

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/cancel_order`, {order_id : encrypt(order_id), pid : encrypt(pid)}, {withCredentials: true}
      );

      if (res.data.success) {
        save_user_info("my_orders", decrypt(res.data.my_orders))
      }

    } catch (err) {
      // if server cannot start
      if (err.code === "ERR_NETWORK"){
        message_window("Connection refused !", "bad")
      }

    }
    loading(false)
  }

  const total_prize_and_count = (orders)=>{
    var total_prod = 0
    var total_prize = 0
    for(const order of orders){
      if(order.status === "pending"){
        total_prod+=1
        total_prize+=order.prize
      }
    }

    return {"total_prod" : total_prod, "total_prize" : total_prize}

  }


  return (
    <>
{user_info.my_orders && user_info.my_orders.length > 0 ? (
    <>
    <div className="cart_main_containner">

    <div className="cart_containner">
    <div className="my_orders_heading">My Orders : </div>

        {/* show products */}
        <div className="cart_products_containner">

        {(user_info.my_orders.slice().reverse()).map((product)=>{

          return (

          
            <div key={product._id} className="cart_product">
            
            {/* cart prodcut image */}
            <div
            onClick={()=>{navigate(`/product?pid=${product.pid}`)}} 
            className="cart_product_image">
                <img src={`${product.image}`}
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

                {/* ordered on */}
                <div
                onClick={()=>{navigate(`/product?pid=${product.pid}`)}} 
                className="cart_product_ordered_on">
                  Ordered On : <span>{formatDate(product.created_at)}</span>
                </div>

                {/* product name */}
                <div
                onClick={()=>{navigate(`/product?pid=${product.pid}`)}} 
                className="cart_product_name">
                {product.name.length >= 20 ? product.name.slice(0, 20)+"..." : product.name}
                </div>
                
                {/* product des */}
                <div
                onClick={()=>{navigate(`/product?pid=${product.pid}`)}} 
                className="cart_product_des">
                {product.description.length >= 20 ? product.description.slice(0, 20)+"..." : product.description}
                </div>
                
                {/* product prize */}
                <div
                onClick={()=>{navigate(`/product?pid=${product.pid}`)}} 
                className="cart_product_prize">
                ₹ {product.prize} <s>₹ {product.prize + 2500}</s>
                </div>
                
                {/* product seller */}
                <div className="cart_product_seller">
                Seller : <span>{product.seller}</span>
                </div>
                
                {/* delivery date*/}
                {product.status === "pending" &&
                <div className="cart_product_delivery_date">
                    Delivery by {get_date(6)} | <span>FREE</span>
                </div>}

                {/* order status */}
                <div className={`order_status order_${product.status}`}>
                  Status : <span>{product.status}</span>
                </div>


                {/* cancel order button */}
                {product.status === "pending" &&
                <button
                onClick={()=>{cancel_order(product._id, product.pid)}}
                className='my_orders_cancel_order_button' >Cancel Order</button>}
                



            </div>

            </div>

        )})}

        </div>


        {/* product summary */}
        <div className="product_summary_containner">
        {/* product details heading */}
        <div className="cart_product_details">
        Order Info
        </div>

        {/* product details info */}
        <div className="product_details_info">
            {/* prize */}
            <div className="product_summary_prize_name_and_prize">
              <div className="prize_name">Prize ({total_prize_and_count(user_info.my_orders).total_prod} items)</div>
              <div className="prize_value">
                ₹ {total_prize_and_count(user_info.my_orders).total_prize}
              </div>
            </div>
            
            
            {/* delivery charges */}
            <div className="product_summary_dc_name_and_dc">
              <div className="dc_name">Delivery Charges ({total_prize_and_count(user_info.my_orders).total_prod} items)</div>
              <div className="dc_value"><s>₹ {total_prize_and_count(user_info.my_orders).total_prod * 40} </s>Free</div>
            </div>
            
            {/* total amount */}
            <div className="product_summary_total_ammount_name_and_total_ammount">
              <div className="total_ammount_name">Total Amount to Pay </div>
              <div className="total_ammount_value">₹ {total_prize_and_count(user_info.my_orders).total_prize}</div>
            </div>



        </div>

        </div>

    </div>



    </div>
    
    </>
) : <><div className="no_orders_found">{no_data}</div></>}

        </>
  )
}
