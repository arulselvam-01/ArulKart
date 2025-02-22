import React, { useEffect } from 'react'
import "../../styles/place_order/desktop/place_order.css"
import { useLocation, useNavigate } from 'react-router-dom';

export const OrderPlaced = (props) => {

  const {message_window, user_info, set_user_info, save_user_info, get_date} = props.utills

  const location = useLocation();
  const prize = location.state;

  const navigate = useNavigate()

  return (
    <>
      {prize && (
    <div className="ordered_message_containner">
      <p className='greet_hooray' >Hooray.....</p>
      <div className="greet_order_prize">
        Order placed for ₹ {prize}
      </div>

      <div className="greet_delivery_data">
        your order will be delivered by {get_date(6)}
      </div>

      {/* navigate to orders */}
      <button onClick={()=>{navigate("/orders")}} className='greet_goto_orders_button' >Goto My Orders</button>



        {/* party poper */}
      <div className="partyContainer active">
        {Array.from({ length: 100 }).map((_, index) => (
          <div 
            key={index} 
            className="piece"
            style={{
              left: `${Math.random() * 100}%`, 
              animationDelay: `${Math.random() * 1}s`
            }}
          />
        ))}
      </div>
        
    </div>
)}


    </>
  )
}
