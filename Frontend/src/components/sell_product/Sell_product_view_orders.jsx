import React, { useEffect } from 'react'
import "../../styles/sell_product/desktop/sell_product_view_orders.css"
import "../../styles/sell_product/mobile/sell_product_view_orders_mobile.css"
import axios from 'axios';

export const Sell_product_view_orders = (props) => {

    const {sell_products_datas, save_sell_products_datas, message_window} = props.utills


function formatDate(inputDate) {
    // Parse the input date string to a Date object
    const date = new Date(inputDate);
    
    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    
    // Format as DD-MM-YYYY
    return `${day}-${month}-${year}`;
    }



  return (
    <>
    
    <div className="global_grey_screen">
    <div className="view_order_containner">

        <div onClick={()=>save_sell_products_datas("view_orders", false)} className="view_order_close_button">+</div>

    {sell_products_datas.my_sold_product && sell_products_datas.my_sold_product.length > 0  ?
    <>
        <table className='vo_table'>
            <thead className='vo_thead' >
                <tr className='vo_tr' >
                    <th className='vo_th' >SNO</th>
                    <th className='vo_th'>USERNAME</th>
                    <th className='vo_th' >Quantity</th>
                    <th className='vo_th' >PRIZE</th>
                    <th className='vo_th' >ORDERED ON</th>
                </tr>
            </thead>

            <tbody className='vo_tbody' >



        {sell_products_datas.my_sold_product.map((order, index)=>(

            <tr className='vo_tr' key={index} >

                {/* sno */}
                <td className='vo_td' >
                    {index +1}
                </td>


                {/* username */}
                <td className='vo_td' >
                    {order.username}
                </td>


                {/* quantity */}
                <td className='vo_td' >1</td>


                {/* prize */}
                <td className='vo_td' >
                ₹ {order.prize}
                </td>


                {/* data */}
                <td className='vo_td' >
                    {formatDate(order.ordered_on)}
                </td>
            </tr>

        ))}

        </tbody>
        </table>

    </> :
    <><div className="sell_product_no_orders">{sell_products_datas.no_data}</div></>}


    </div>
    </div>


        
    

    </>
  )
}
