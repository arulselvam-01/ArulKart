import React from 'react'
import "../../styles/sell_product/desktop/sell_products_add.css"
import "../../styles/sell_product/mobile/sell_products_add_mobile.css"
import { Input_error } from '../utills/Input_error'
import axios from 'axios'
import { encrypt } from '../utills/utills'


export const Sell_product_add = (props) => {

  const {sell_products_datas, save_sell_products_datas, message_window, loading} = props.utills

  var sell_product_input_error = false


  // form for store data
  var add_product_datas = new FormData()

  // product image preview 
  const add_product_image_preview = (event)=>{
    const file = event.target.files[0]

    // check the selected image is required file format
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
      save_sell_products_datas("product_image_err", false)
      // read and store image file
      const reader = new FileReader();
      reader.onload = (e) => {
      save_sell_products_datas("add_product_image_preview", e.target.result)
      };
      reader.readAsDataURL(file);

      // append to usestate
      save_sell_products_datas("product_image", file)



      event.target.value = ""


    }else{
      message_window('Please select a valid image file (JPG, JPEG, or PNG only)', "bad")
    }
  }

  // add new product
  const add_new_product = async()=>{

    // append all data to form
    add_product_datas.append("product_name", sell_products_datas.product_name)
    add_product_datas.append("product_des", sell_products_datas.product_description)
    add_product_datas.append("product_prize", sell_products_datas.product_prize)
    add_product_datas.append("product_category", sell_products_datas.product_category)
    add_product_datas.append("product_stock", sell_products_datas.product_stock)
    add_product_datas.append("image", sell_products_datas.product_image)


    // send to server
    try {
      loading(true)

      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add_product`, add_product_datas, {withCredentials : true})

      message_window(res.data.message, "good")
      save_sell_products_datas("sell_new_product_button", "sell_new_product_button")
      save_sell_products_datas("fetch_sell_product", Date.now())

  }catch(err){
    const err_message = err.response ? err.response.data : null

    // if server cannot start
    if (err.code === "ERR_NETWORK"){
      message_window("Connection refused !", "bad")
    }

    if (err_message){
      // error on u
      message_window(err_message.message, "bad")
    }

  }
  loading(false)

  }

  // add product input validation
  const add_product_validattion = ()=>{

    // images validation error
    if (sell_products_datas.add_product_image_preview === false){
      save_sell_products_datas("product_image_err", "please select product image")
      sell_product_input_error = true
    }else{
      save_sell_products_datas("product_image_err", false)
      sell_product_input_error = false
    }
    
    // name validation error
    if (sell_products_datas.product_name === ""){
      save_sell_products_datas("product_name_err", "please enter product name")
      sell_product_input_error = true
    }else{
      save_sell_products_datas("product_name_err", false)
      sell_product_input_error = false
    }
    
    // des validation error
    if (sell_products_datas.product_description === ""){
      save_sell_products_datas("product_description_err", "please enter product description")
      sell_product_input_error = true
    }else{
      save_sell_products_datas("product_description_err", false)
      sell_product_input_error = false
    }

    // prize validation error
    if (sell_products_datas.product_prize === ""){
      save_sell_products_datas("product_prize_err", "enter prize")
      sell_product_input_error = true
    }else{
      save_sell_products_datas("product_prize_err", false)
      sell_product_input_error = false
    }

    // stock validation error
    if (sell_products_datas.product_stock === ""){
      save_sell_products_datas("product_stock_err", "enter stock")
      sell_product_input_error = true
    }else{
      save_sell_products_datas("product_stock_err", false)
      sell_product_input_error=false
    }


    // allow for add product
    if (!sell_product_input_error){
      add_new_product()
    }

  }

  // enter button click on input handle
  const enter_button_handle = (event)=>{
    if(event.key === "Enter"){
      add_product_validattion()
    }
  }


  return (
    <>

      {/* add product image containner */}
      <div className="global_grey_screen">
        <div className="add_product_containner">
          {/* image containner */}
          <div
          className={sell_products_datas.product_image_err ? "sell_product_image_upload_con bad_input" : "sell_product_image_upload_con"} 
          onClick={()=>document.getElementById("sell_product_image_input").click()} >
            {/* select product image hidden file dialog */}
            <input
              type="file"
              id="sell_product_image_input"
              style={{ display: 'none' }}
              accept="image/jpeg, image/jpg, image/png"
              onChange={(event)=>{add_product_image_preview(event)}}
            />
            {sell_products_datas.add_product_image_preview ? (
              <img src={sell_products_datas.add_product_image_preview} alt="" />
            ) : (
              <p>click to upload product image</p>

            )}
          </div>
          <Input_error error={sell_products_datas.product_image_err} />

          {/* prodcut name */}
          <label htmlFor='sell_product_name_input' className="sell_product_name_label">
            Enter product name
            <textarea
            onKeyDown={enter_button_handle}
            className={sell_products_datas.product_name_err ? "bad_input" : "good_input"} 
            value={sell_products_datas.product_name}
            onChange={(e)=>save_sell_products_datas("product_name", e.target.value)}
            placeholder='Enter Product Name'  id="sell_product_name_input"></textarea>
            <Input_error error={sell_products_datas.product_name_err} />
          </label>

          {/* prodcut description */}
          <label htmlFor='sell_product_description_input' className="sell_product_description_label">
            Enter product description
            <textarea
            onKeyDown={enter_button_handle}
            className={sell_products_datas.product_description_err ? "bad_input" : "good_input"} 
            value={sell_products_datas.product_description}
            onChange={(e)=>save_sell_products_datas("product_description", e.target.value)}
            placeholder='Enter Product Description' id="sell_product_description_input"></textarea>
            <Input_error error={sell_products_datas.product_description_err} />
          </label>
          
          {/* product prize */}
          <div className="prize_category_stock_contaninner">
            <label htmlFor="sell_product_prize_input" className='sell_product_prize_label'>
            product prize ₹
              <input
              onKeyDown={enter_button_handle}
              className={sell_products_datas.product_prize_err ? "bad_input" : "good_input"} 
              value={sell_products_datas.product_prize}
              onChange={(e)=>save_sell_products_datas("product_prize", e.target.value)}
              placeholder='Product Prize'
              type="number"
              id='sell_product_prize_input'
              min={0}/>
              <Input_error error={sell_products_datas.product_prize_err} />
            </label>

            {/* product category */}
            <label htmlFor="sell_product_category_input" className='sell_product_category_label'>
              select category
              <select
              value={sell_products_datas.product_category}
              onChange={(e)=>save_sell_products_datas("product_category", e.target.value)}
              id="sell_product_category_input">
                <option value="tech">tech</option>
                <option value="electronics">electronics</option>
                <option value="mobile">mobile</option>
                <option value="laptops">laptops</option>
                <option value="accessories">accessories</option>
                <option value="headphones">headphones</option>
                <option value="food">food</option>
                <option value="books">books</option>
                <option value="clothes">clothes</option>
                <option value="shoes">shoes</option>
                <option value="beauty">beauty</option>
                <option value="health">health</option>
                <option value="sports">sports</option>
                <option value="outdoor">outdoor</option>
                <option value="home">home</option>
              </select>
            </label>

            {/* product stock */}
            <label htmlFor="sell_product_stock_input" className='sell_product_stock_label'>
            product stock
              <input
              onKeyDown={enter_button_handle}
              className={sell_products_datas.product_stock_err ? "bad_input" : "good_input"} 
              value={sell_products_datas.product_stock}
              onChange={(e)=>save_sell_products_datas("product_stock", e.target.value)}
              placeholder='Product stock'
              type="number" id='sell_product_stock_input'
              min={0} />
              <Input_error error={sell_products_datas.product_stock_err} />
            </label>


          </div>

          {/* cancel button and sell product button */}
          <div className="sell_product_cancel_and_add_button_con">
            <button onClick={()=>save_sell_products_datas("sell_new_product_button", "sell_new_product_button")} className='sell_product_cancel_button' >cancel</button>
            <button onClick={()=>add_product_validattion()} className='sell_product_add_button' >sell product</button>

          </div>
        </div>

      </div>

    </>
  )
}
