import React from 'react'
import "../../styles/place_order/desktop/place_order.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { encrypt } from '../utills/utills'

export const PlaceOrder = (props) => {

    const {loading} = props.utills

    const navigate = useNavigate()

    const {from, pid, products_id, save_user_info, user_info, prize, message_window} = props.utills

    var order_ids = []

    if(from == "order_summary"){
        order_ids.push(pid)
    }else if(from == "cart"){
        order_ids = products_id
    }
    order_ids =  encrypt(order_ids)




// place the order
const place_order = async () => {
    try {
    loading(true)

    const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/create_order`, {order_ids, from : encrypt(from)}, {withCredentials: true}
    );

    if (res.data.success) {

        // empty the cart 
        if(from=="cart"){
            save_user_info("cart", [])
            save_user_info("ordered", true)
        }

        message_window("order placed successfully", "good")
        navigate("/order-placed", {state : prize})
    }

    } catch (err) {
        const err_message = err.response ? err.response.data : null
        // if server cannot start
        if (err.code === "ERR_NETWORK"){
            message_window("Connection refused !", "bad")
        }

        if (err_message.message === "Product out of stock"){
            message_window(err_message.message, "bad")
        }

    }
    loading(false)

}

const place_order_validate = ()=>{

    // validate address 
    if (user_info.delivery_address.phno.length == 10 &&
        user_info.delivery_address.pincode.length ==  6 &&
        user_info.delivery_address.state.length > 0 &&
        user_info.delivery_address.district.length > 0 &&
        user_info.delivery_address.landmark.length > 0 &&
        user_info.delivery_address.address.length > 0){

        place_order()

    }else{
        message_window("Invalid delivery addresses !", "bad")
        navigate("/profile")
    }
}

  return (
    <>
        <button onClick={()=>{place_order_validate()}} className='place_order_button' >Place Order</button>


    </>
  )
}
