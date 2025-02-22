import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { PlaceOrder } from '../orders/PlaceOrder'
import { decrypt } from '../utills/utills'

export const OrderSummary = (props) => {

const {message_window, user_info, set_user_info, save_user_info, get_date, loading} = props.utills

const navigate = useNavigate()

const [product, set_product] = useState("error")

const { search } = useLocation();
const queryParams = new URLSearchParams(search);

const pid = queryParams.get('pid');

// if product id is undefined
useEffect(() => {

    if (!pid) {
      return navigate("/");
    }

    
    // get single product
    const controller = new AbortController(); // Create an AbortController
    const signal = controller.signal;

    const get_single_product = async () => {
        try {
        loading(true)
        
        const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/get_single_product?pid=${pid}`, {withCredentials: true, signal}
        );

        if (res.data.success) {
            set_product(res.data.product)
        }

        } catch (err) {
            navigate("/")

        }
        loading(false)

    }

    get_single_product();

    return () => {
        controller.abort()
    }

  }, [pid, navigate]);



  return (
    <>
{product !== "error" && (
    <>
    <div className="cart_main_containner">

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
        
            <div className="cart_product">
            
            {/* cart prodcut image */}
            <div onClick={()=>{navigate(`/product?pid=${pid}`)}} className="cart_product_image">
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
            <div onClick={()=>{navigate(`/product?pid=${pid}`)}} className="cart_product_info">

                {/* product name */}
                <div className="cart_product_name">
                {product.name.length > 20 ? product.name.slice(0,20)+"..." : product.name}
                </div>
                
                {/* product des */}
                <div className="cart_product_des">
                {product.description.length > 20 ? product.description.slice(0,20)+"..." : product.description}
                </div>
                
                {/* product prize */}
                <div className="cart_product_prize">
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


                {/* out of stock */}
                {product.stock < 1 && <><div className="cart_product_out_of_stock">Out Of Stock</div></>}

            </div>

            </div>

        </div>


        {/* product summary */}
        <div className="product_summary_containner">
        {/* product details heading */}
        <div className="cart_product_details">
        Order Summary
        </div>

        {/* product details info */}
        <div className="product_details_info">
            {/* prize */}
            <div className="product_summary_prize_name_and_prize">
            <div className="prize_name">Prize (1 items)</div>
            <div className="prize_value">₹ {product.prize}</div>
            </div>
            
            
            {/* delivery charges */}
            <div className="product_summary_dc_name_and_dc">
            <div className="dc_name">Delivery Charges</div>
            <div className="dc_value"><s>₹ 40 </s>Free</div>
            </div>
            
            {/* total amount */}
            <div className="product_summary_total_ammount_name_and_total_ammount">
            <div className="total_ammount_name">Total Amount</div>
            <div className="total_ammount_value">₹ {product.prize}</div>
            </div>


            {/* place order */}
            <PlaceOrder utills = {{"from" : "order_summary", "pid" : pid, "save_user_info" : save_user_info, "user_info" : user_info, prize : product.prize, "message_window" : message_window, "loading" : loading}} />


        </div>

        </div>

    </div>



    </div>
    
    </>
)}

        </>
  )
}
