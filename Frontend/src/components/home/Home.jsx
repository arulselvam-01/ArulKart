import React, { useEffect, useState } from 'react'
import "../../styles/home/desktop/home.css"
import "../../styles/home/mobile/home_mobile.css"
import { Home_display_products } from './Home_display_products'
import axios from 'axios'
import { Home_pagenation } from './Home_pagenation'
import { Home_searchbar } from './Home_searchbar'
import { Home_product_filter } from './Home_product_filter'
import TypingEffect from '../utills/TypingEffects'

export const Home = (props) => {
  const {message_window, user_info, set_user_info, save_user_info, get_date, loading} = props.utills

  const [home_datas, set_home_datas] = useState({
    // products datas
    all_products : [],
    backup_all_products : [],
    product_image : "",
    total_products_count : 0,
    current_page : 1,
    no_data : "",

    // search imput data
    search_input_data : "",

    // reload page
    reload : null
  })

  // save datas dynamically
  const save_home_datas = (key, value)=>{
      set_home_datas((old)=>(
        {...old, [key] : value}
      ))
    }
  
  // get product api
  const get_product_api = async(filters)=>{

    const api_signal = axios.CancelToken.source()

    // fetch all product
    const fetch_products = async(filters)=>{
      try{
        save_home_datas("no_data", "")
        loading(true)
          const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get_products${filters}`, {cancelToken : api_signal.token})


          if(res.data.success){
            // if no data in product
            if(res.data.products && res.data.products.length < 1){
              save_home_datas("no_data", "Product not found : (")
            }

              save_home_datas("all_products", res.data.products)
              save_home_datas("backup_all_products", res.data.products)
              save_home_datas("total_products_count", res.data.total_products_count || 0)
              save_home_datas("current_page", res.data.current_page)
          }


      }
      catch(err){
          save_home_datas("no_data", "Product not found : (")
          const err_message = err.response ? err.response.data : null

          // if server cannot start
          if (err.code === "ERR_NETWORK"){
              message_window("Connection refused !", "bad")
              }
      }
      loading(false)
    }

    fetch_products(filters || "")

    // clean up the request
    return ()=>{api_signal.cancel("fetch all proucts")}

    }

    // get all product
    useEffect(()=>{

      // get the products
      get_product_api("?page=1")
      
  }, [])

  return (
    <>
    <div className="home_canvas">

    {/* search bar */}
      <Home_searchbar
      utills={{"home_datas" : home_datas, "save_home_datas" : save_home_datas, "user_info" : user_info, "set_user_info" : set_user_info, "message_window" : message_window, "save_user_info" : save_user_info, "get_product_api" : get_product_api, "loading" : loading}}
      />

    {/* latest prodcut heading */}
    <div className="home_typing_effect">
        Welcome to ArulKart, Buy <TypingEffect/>
    </div>
    
          {/* product filter containner */}
          <Home_product_filter 
            utills={{"home_datas" : home_datas, "save_home_datas" : save_home_datas, "user_info" : user_info, "set_user_info" : set_user_info, "message_window" : message_window, "save_user_info" : save_user_info, "get_product_api" : get_product_api, "loading" : loading}}
          />

        {home_datas.all_products.length < 1 ? (<>
          <div className="no_product_found">{home_datas.no_data}</div>
        </>)
        
        : <>
        
          <div className="product_filter_and_display_product">


            {/* diplay all product */}
            <Home_display_products
              utills={{"home_datas" : home_datas, "save_home_datas" : save_home_datas, "user_info" : user_info, "set_user_info" : set_user_info, "message_window" : message_window, "save_user_info" : save_user_info, "get_product_api" : get_product_api, "get_date" : get_date, "loading" : loading}}
            />

            {/* home product pagenation */}
            <Home_pagenation
              utills={{"home_datas" : home_datas, "save_home_datas" : save_home_datas, "user_info" : user_info, "set_user_info" : set_user_info, "message_window" : message_window, "save_user_info" : save_user_info, "get_product_api" : get_product_api, "loading" : loading}}
              />

            </div>

        </>}


      



    </div>
      
    </>
  )
}
