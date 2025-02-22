import axios from 'axios'
import React, { useEffect, useState } from 'react'
import "../../styles/sell_product/desktop/sell_products_dashboard.css"
import "../../styles/sell_product/mobile/sell_products_dashboard_mobile.css"
import { decrypt, encrypt } from '../utills/utills'

export const Sell_products_dashboard = (props) => {
    const {sell_products_datas, save_sell_products_datas, message_window, reset_sell_product_input_fields, get_product_orders, loading} = props.utills


    // fetch selled products
    useEffect(() => {
        const controller = new AbortController(); // Create an AbortController
        const signal = controller.signal;
    
        const fetchSoldProducts = async () => {
          try {
            save_sell_products_datas("no_data", "")
            loading(true)

            const res = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/get_selled_products`, {
                withCredentials: true, signal}
            );
    
            if (res.data.my_selled_products.length >= 1){

              // no selled proudct
              if (decrypt(res.data.my_selled_products) && decrypt(res.data.my_selled_products).length < 1){
                save_sell_products_datas("no_data", "no products found  : (")
              }

              save_sell_products_datas("my_selled_products", decrypt(res.data.my_selled_products))
              save_sell_products_datas("total_orders", decrypt(res.data.total_orders))
              save_sell_products_datas("total_orders_prize", decrypt(res.data.total_order_prize))
              save_sell_products_datas("total_out_of_stock", decrypt(res.data.my_selled_products).filter(product => product.stock <= 0).length);
            }
          

          } catch (err) {
            save_sell_products_datas("no_data", "no products found :(")

            if (axios.isCancel(err)) {
            } else {
              const err_message = err.response ? err.response.data : null;
    
    
              if (err.code === "ERR_NETWORK") {
                message_window("Connection refused!", "bad");
              }
    
              if (err_message) {
                message_window(err_message.message, "bad");
              }
            }
          }
          loading(false)
        }
    
        fetchSoldProducts();

        return () => {
          controller.abort()
        }
      }, [sell_products_datas.fetch_sell_product])

    // sold products
    if (sell_products_datas.my_selled_products){
        var sold_products = sell_products_datas.my_selled_products
    }

  // delete product 
  const sell_product_delete_product = async()=>{
    const del_product_id = sell_products_datas.delete_product_id

    try {
      loading(true)

      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/delete_product/${sell_products_datas.delete_product_id}`, {
          withCredentials: true}
      );

      if (res.data.success){
        save_sell_products_datas("my_selled_products", false);
      }

    } catch (err) {
      if (axios.isCancel(err)) {
        
      } else {
        const err_message = err.response ? err.response.data : null;

        if (err.code === "ERR_NETWORK") {
          message_window("Connection refused!", "bad");
        }

        if (err_message) {
          message_window(err_message.message, "bad");
        }
      }
    }

    save_sell_products_datas("delete_product_id", false)
    save_sell_products_datas("fetch_sell_product", Date.now())

  }

  // handle edit button
  const on_click_edit_product_button = (product)=>{
    // reset input fields
    reset_sell_product_input_fields()

    save_sell_products_datas("edit_product", product)

    save_sell_products_datas("product_name", product.name)
    save_sell_products_datas("product_description", product.description)
    save_sell_products_datas("product_prize", product.prize)
    save_sell_products_datas("product_stock", product.stock)
    save_sell_products_datas("product_category", product.category)
    save_sell_products_datas("product_image", product.image)


  }

  // handdle view order button
  const view_orders_func = (pid)=>{
    save_sell_products_datas("view_orders", true)
    get_product_orders(pid)
  }



  return (
    <>


    {sell_products_datas.my_selled_products && sell_products_datas.my_selled_products.length >= 1 ?
    
    <>
      {/* product dashboard */}
      <table className="sell_products_score_board">
        <tbody>
          <tr>
            <td>Total Products</td>
            <td>{sell_products_datas.my_selled_products.length}</td>
          </tr>
          <tr>
            <td>Total Orders</td>
            <td>{sell_products_datas.total_orders}</td>
          </tr>
          <tr>
            <td>Total Orders Prize</td>
            <td>₹ {sell_products_datas.total_orders_prize}</td>
          </tr>
          <tr>
            <td>Total Out Of Stock</td>
            <td>{sell_products_datas.total_out_of_stock}</td>
          </tr>
        </tbody>
    </table>

    <div className="sell_products_containner">
      

        {sold_products.map((product, index)=>{
          return (
              // sell product containner 
              <div key={product._id || index}  className="sold_product_con">
                    {/* product image */}
                    <div className="sold_product_image">
                      <img src={`${product.image}`}
                        onError={(e)=>{
                            if(!e.target.dataset.fallback){
                                e.target.dataset.fallback = "true"
                                e.target.src = "images/product.svg";
                            }
                        }}
                      alt="no image" />
                    </div>

                    {/* product name */}
                    <div className="sold_product_name">
                      {product.name.length > 20 ? product.name.slice(0, 20)+"..." : product.name}
                    </div>
                    
                    {/* product category */}
                    <div className="sold_product_category">{product.category} </div>
                    
                    {/* product prize */}
                    <div className="sold_product_prize">₹ {product.prize} </div>
                    

                    {/* sold product action */}
                    <div className="sold_product_action_button_con">
                        {/* delete button */}
                        <button
                        onClick={()=>save_sell_products_datas("delete_product_id", product._id)}
                        className='sell_product_delete_button' >Delete</button>

                        {/* edit button */}
                        <button
                        onClick={()=>on_click_edit_product_button(product)}
                        className='sell_product_edit_button'  >Edit</button>

                        {/* orders view */}
                        <button onClick={()=>{view_orders_func(product._id)}} className='sell_product_orders_button' >Orders</button>
                    </div>

                  {/* out of stock overlay */}
                  {product.stock <= 0 ? <div className="sold_product_out_of_stock">
                    Out Of Stock
                  </div> : null}
                    
                </div>

              )

          })}


      </div>
    </>
    : 
    
    <p className='sell_products_no_product' >{sell_products_datas.no_data}</p>
    }


    {/* delete product  */}
    {sell_products_datas.delete_product_id ? 
    <div className="global_grey_screen">
      <div className="sell_product_delete_window">
        <p>are you sure about to delete this product ? </p>
        <div className="sell_product_delete_window_button">
          <button onClick={()=>save_sell_products_datas("delete_product_id", false)} >No</button>
          <button onClick={()=>sell_product_delete_product()} >Yes</button>
        </div>
      </div>
    </div>
    : null}

    </>
  )
}
