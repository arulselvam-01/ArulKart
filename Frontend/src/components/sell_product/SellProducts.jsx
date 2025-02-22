import React, { useState } from 'react'
import "../../styles/sell_product/desktop/sell_products.css"
import "../../styles/sell_product/mobile/sell_products_mobile.css"
import { Sell_product_add } from './Sell_product_add'
import { Sell_products_dashboard } from './Sell_products_dashboard'
import { Sell_product_edit } from './Sell_product_edit'
import { Sell_product_view_orders } from './Sell_product_view_orders'
import axios from 'axios'
import { decrypt, encrypt } from '../utills/utills'

export const SellProducts = (props) => {

  const {message_window, loading} = props.utills


  // sell products datas
  const [sell_products_datas, set_sell_products_data] = useState({
    // css classes
    "sell_new_product_button" : "sell_new_product_button",

    // add product image preview
    "add_product_image_preview" : false,

    // add and product imput datas
    "product_name" : "",
    "product_description" : "",
    "product_prize" : "",
    "product_stock" : "",
    "product_category" : "tech",
    "product_image" : "",

    // add product input error
    product_image_err : false,
    product_name_err : false,
    product_description_err : false,
    product_prize_err : false,
    product_stock_err : false,

    // seller prdducts
    "my_selled_products" : false,
    "fetch_sell_product" : false,

    // edit product
    "edit_product" : false,
    "is_product_image_edited" : false,

    // delete product
    "delete_product_id" : false,

    // view order
    "view_orders" : false,

    // dashboard
    total_orders : 0,
    total_orders_prize : 0,
    total_out_of_stock : 0,

    // no products
    no_data : ""
    
  })

  // reset input fields
  const reset_sell_product_input_fields = ()=>{
    // inputs
    save_sell_products_datas("product_name", "")
    save_sell_products_datas("product_description", "")
    save_sell_products_datas("product_prize", "")
    save_sell_products_datas("product_stock", "")
    save_sell_products_datas("product_category", "tech")
    save_sell_products_datas("product_image", "")
    save_sell_products_datas("is_product_image_edited", false)

    // errors
    save_sell_products_datas("product_image_err", false)
    save_sell_products_datas("product_name_err", false)
    save_sell_products_datas("product_description_err", false)
    save_sell_products_datas("product_prize_err", false)
    save_sell_products_datas("product_stock_err", false)

    // preview
    save_sell_products_datas("add_product_image_preview", false)
  }

  // save sell products data dynamically func
    const save_sell_products_datas = (key, value)=>{
      set_sell_products_data((old)=>(
        {...old, [key] : value}
      ))
    }

  // sell_product button handler
  const on_click_sell_product_button = ()=>{

    save_sell_products_datas("edit_product", false)
    // reset all inputs
    reset_sell_product_input_fields()

    sell_products_datas.sell_new_product_button === "sell_new_product_button"
    ? save_sell_products_datas("sell_new_product_button", "sell_new_product_button close_sell_new_product_button" )
    : save_sell_products_datas("sell_new_product_button", "sell_new_product_button")
  }


  // get single product orders
  const get_product_orders = async (pid) => {
    try {
      save_sell_products_datas("no_data", "")
      loading(true)

      const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/product_orders`,{"pid" : pid},{withCredentials: true}
      );

      if (res.data.success) {
        // no products
        if(decrypt(res.data.my_sold_product) && decrypt(res.data.my_sold_product).length < 1){
          save_sell_products_datas("no_data", "no orders found : (")
        }

          save_sell_products_datas("my_sold_product", decrypt(res.data.my_sold_product))
      }

    } catch (err) {
      save_sell_products_datas("no_data", "no orders found : (")
      // if server cannot start
      if (err.code === "ERR_NETWORK"){
        message_window("Connection refused !", "bad")
      }

    }
    loading(false)
}

  return (
    <>
      <div onClick={()=>on_click_sell_product_button()} className={sell_products_datas.sell_new_product_button}>
        +
      </div>

        <div className="sell_products_canvas">
          {/* dashboard heading */}
          <h1 className='sell_product_dashboard_heading' >Dashboard</h1>

          {/* my selling products dashboard*/}
          <Sell_products_dashboard utills = {{"sell_products_datas" : sell_products_datas, "save_sell_products_datas" : save_sell_products_datas, "message_window" : message_window, "reset_sell_product_input_fields" : reset_sell_product_input_fields, "get_product_orders" : get_product_orders, "loading" : loading}} />
  

        </div>


      {/* add new product window */}
        {sell_products_datas.sell_new_product_button === "sell_new_product_button" ? null : <>
            <Sell_product_add utills = {{"sell_products_datas" : sell_products_datas, "save_sell_products_datas" : save_sell_products_datas, "message_window" : message_window, "loading" : loading}} />
          </>}

      
      {/* edit procuct */}
      {sell_products_datas.edit_product ? <>
            <Sell_product_edit utills = {{"sell_products_datas" : sell_products_datas, "save_sell_products_datas" : save_sell_products_datas, "message_window" : message_window, "loading" : loading}} />
          </> : null}


      {/* show orders */}
      {sell_products_datas.view_orders ? <>
            <Sell_product_view_orders utills = {{"sell_products_datas" : sell_products_datas, "save_sell_products_datas" : save_sell_products_datas, "message_window" : message_window, "loading" : loading}} />
          </> : null}



    </>
  )
}
