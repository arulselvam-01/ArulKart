import React, { useEffect, useState } from 'react'
import "./styles/arulKart.css"
import "./styles/global.css"
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import { Header } from './components/header/Header'
import { Footer } from './components/footer/Footer'
import { Cart } from './components/cart/Cart'
import { Home } from './components/home/Home'
import { Profile } from './components/my_profile/Profile'
import { Orders } from './components/orders/Orders'
import { SellProducts } from './components/sell_product/SellProducts'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import axios from 'axios'
import { Product } from './components/product/Product'
import { PageNotFound404 } from './PageNotFound404'
import { OrderSummary } from './components/order_summary/OrderSummary'
import { OrderPlaced } from './components/orders/OrderPlaced'
import { decrypt } from './components/utills/utills'

export const ArulKart = () => {

  const [user_info, set_user_info] = useState({is_logined : false})

  // loading useState
  const [loader, loading] = useState(true)

  function get_date (daysToAdd) {
    // Get today's date
    const today = new Date();
    
    // Add the specified number of days to today's date
    today.setDate(today.getDate() + daysToAdd);
    
    // Define the options for formatting the date
    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    
    // Format the date as "Wed 21 Jan"
    const formattedDate = today.toLocaleDateString('en-GB', options);
    
    return formattedDate;
}

  // message window
  const [ack_message, set_ack_message] = useState("")


  const [css_classes_names, set_css_classes] = useState({
    "message_window" : "message_window"
    
  })

  // message side
  const message_window = (msg, type)=>{
    const msg_type = type==="good" ? "good_message" : "bad_message"
    set_ack_message(msg)
    toggle_css_classes("message_window", "message_window "+ msg_type)
    setTimeout(() => {
      toggle_css_classes("message_window", "message_window")
      set_ack_message("")
    }, 3000);
  }

    // toggle css classes
    const toggle_css_classes = (css_class_name, new_class_name)=>{
      set_css_classes((css_classes)=>(
      {...css_classes, [css_class_name] : new_class_name}
      
      ))
    }

  // user_cred saver func
  const save_user_info = (key, value)=>{
    set_user_info((old)=>(
      {...old, [key] : value}
    ))
  }


  // auto login while open browser
  useEffect(() => {
    const controller = new AbortController(); // Create an AbortController
    const signal = controller.signal;

    const fetchProfile = async () => {
      try {
        loading(true)

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/profile`, {withCredentials: true, signal}
        );

        if (res.data.success) {
          const logged_user = decrypt(res.data.user)
          logged_user.is_logined = true;
          logged_user.profile_image = `${logged_user.avatar}`;
          set_user_info(logged_user);
        }

      } catch (err) {
        // if server cannot start
        if (err.code === "ERR_NETWORK"){
          message_window("Connection refused !", "bad")
        }

      }
      window.location.pathname !== "/" && loading(false)
    };

    fetchProfile();

    return () => {
      controller.abort()
    }
  }, [])

  const component_utills = {
    "user_info" : user_info,
    "set_user_info" : set_user_info,
    "message_window" : message_window,
    "save_user_info" : save_user_info,
    "loading" : loading,

    // date info
    "get_date" : get_date
  }
  



  return (
    <>


    {/* routers */}
      <BrowserRouter>
        {/* header conponent */}
        <Header utills = {component_utills} />


          <Routes>

        {/* with login */}
        {user_info.name && (
          <>
              {/* cart route */}
              <Route path='/cart' element={<Cart utills = {component_utills} />}/>

              {/* profile route */}
              <Route
                path='/profile'
                element={<Profile
                utills = {component_utills} />}
              />

              {/* order route */}
              <Route path='/orders' element={<Orders utills = {component_utills}  />}/>
              
              {/* sell product route */}
              <Route
                path='/sell'
                element={<SellProducts 
                utills = {component_utills} />}
              />

              {/* order summary */}
              <Route
                path = "/order-summary"
                element = {<OrderSummary utills = {component_utills} />}
              />

              {/* order placed */}
              <Route path='/order-placed' element={<OrderPlaced utills = {component_utills} />}/>

            </>
          )}

          {/* without login */}
              <Route path='/login' element={<Login 
              utills = {component_utills} />}/>

              {/* signup route*/}
              <Route path='/signup' element={<Signup 
              utills = {component_utills} />}/>

              {/* home route */}
              <Route path='/' element={<Home utills = {component_utills} />}/>
              
              {/* display single product  */}
              <Route path='/product' element={<Product utills = {component_utills} />}/>
              
          
          {/* 404 route */}
          <Route path="/*" element={<PageNotFound404 />} />

          </Routes>

      
      </BrowserRouter>
      
      {/* message ack */}
      <pre className={css_classes_names.message_window}>
        {ack_message}

      </pre>

      {/* loader */}
      {loader && 
      <div className="loading_con">
        <div className="loading"></div>
      </div>
      }

    </>
    
    
  )
}
