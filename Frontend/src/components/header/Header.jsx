import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../../styles/header/desktop/Header.css"
import "../../styles/header/mobile/header_mobile.css"
import axios from 'axios'


export const Header = (props) => {

  const {user_info, set_user_info, save_user_info, message_window, loading} = props.utills


  const navigate = useNavigate()

  const [css_classes_names, set_css_classes] = useState({

    "nav_containner" : "nav_containner",
    "grey_screen" : "grey_screen"
  })


// toggle css classes
  const toggle_css_classes = (css_class_name, new_class_name)=>{
    set_css_classes((css_classes)=>(
    {...css_classes, [css_class_name] : new_class_name}
    
    ))
  }

  // nav_links class toggle
  const show_nav_containner = ()=>{
    toggle_css_classes("grey_screen", css_classes_names.grey_screen === "grey_screen" ? "grey_screen show_grey_screen" : "grey_screen")

    toggle_css_classes("nav_containner", css_classes_names.nav_containner === "nav_containner" ? "nav_containner show_nav_containner" : "nav_containner")
  }

  const close_nav_containner = ()=>{
    toggle_css_classes("nav_containner", css_classes_names.nav_containner === "nav_containner" ? "nav_containner show_nav_containner" : "nav_containner")

    toggle_css_classes("grey_screen", css_classes_names.grey_screen === "grey_screen" ? "grey_screen show_grey_screen" : "grey_screen")
  }

  // pages navigator
  const page_router = (page)=>{

    // profile navigation
    if (page === "/profile"){
      user_info.name ? navigate("/profile") : navigate("/login")
    }

    // order navigation
    if (page === "/orders"){
      user_info.name ? navigate("/orders") : navigate("/login")
    }

    // sel product navigation
    if (page === "/sell"){
      user_info.name ? navigate("/sell") : navigate("/login")
    }

    close_nav_containner()
  }


  // logout user
  const logout = async()=>{

    try{
      loading(true)
      var res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {withCredentials : true})

      // if successful
      if (res.data.success){
        set_user_info("")
        message_window("Logged out successfully", "good")
        navigate("/")
        
      }

    }
    catch(err){
      // if server cannot start
      if (err.code === "ERR_NETWORK"){
        message_window("Connection refused !", "bad")
      }

    }
    loading(false)

}

  return (
    <>
        <header>

          {/* left header */}
          <div className="left_header">
              {/* menu bar */}
              <div onClick={()=>show_nav_containner()} className="menu_bar pointer">
                <img onClick={()=>show_nav_containner()} className="menu_bar" src="/images/menu_bar.svg" alt="" />
              </div>

              {/* logo */}
              <div onClick={()=>navigate("/")} className="logo pointer">
                <p>ARUL KART</p>
              </div>

          </div>


          <div className="right_header">
            {/* check if logged in */}
            {user_info.is_logined ? (
              // Profile detail
              <div className="my_profile">
                <div
                onClick={()=>{navigate("/profile")}}className="profile_photo pointer">
                  <img
                  src={user_info.profile_image}
                  alt=""
                  onError={()=>{save_user_info("profile_image", "images/profile.svg")}}
                   />
                </div>
                <Link to={"/profile"} className="user_name">Hi, {user_info.name.length>=8 ? user_info.name.slice(0,8)+"..." : user_info.name}</Link>
                {/* Cart */}
                <div onClick={()=>navigate("/cart")} className="cart pointer">
                  <img src="/images/cart.svg" alt="cart" />
                  <div className="cart_products_count">{user_info.cart.length}</div>
                </div>
              </div>
            ) : (
              // Login and signup buttons
              <div className="login_and_signup_button">
                <button onClick={()=>{navigate("/login")}} className="login_button hover_color">Login</button>
                <button onClick={()=>navigate("/signup")} className="signup_button hover_color">Signup</button>
              </div>
            )}
          </div>

        </header>



        {/* navigation window */}
        {/* grey window */}
        <div onClick={()=>close_nav_containner()} className={css_classes_names.grey_screen}>
        </div>

        <div className={css_classes_names.nav_containner}>
            <div onClick={()=>close_nav_containner()} className="close_button pointer">
              <img src="/images/close_button.svg" alt="" />
            </div>

            {/* nav_profile and login buuton */}
            {user_info.is_logined ? (
              <div className="nav_profile">
                <div onClick={()=>{navigate("/profile"); close_nav_containner()}} className="profile_dp pointer">
                  <img
                  src={user_info.profile_image}
                  alt=""
                  onError={()=>{save_user_info("profile_image", "/images/profile.svg")}}
                  />
                </div>
                <div onClick={()=>{navigate("/profile"); close_nav_containner()}} className="u_name pointer">
                Hi, {user_info.name.length>=8 ? user_info.name.slice(0,8)+"..." : user_info.name}
                </div>
              </div>

            ) : (
              <div className="nav_login_signup_button">
                <button onClick={()=>{navigate("/login"); close_nav_containner()}} className="nav_login_button hover_color">Login</button>
                
                <button onClick={()=>{navigate("/signup"); close_nav_containner()}} className="nav_signup_button hover_color">Signup</button>
              </div>

            )}


            <ul className='nav_links' >

              {/* home */}
              <li>
                <img src="/images/home.svg" alt="" />
                <Link onClick={()=>close_nav_containner()}
                to={"/"} >Home</Link>
              </li>
              
              {/* profile */}
              <li onClick={()=>page_router("/profile")} >
                <img src="/images/my_profile.svg" alt="" />
                <Link>
                My Profile
                </Link>
              </li>
              
              {/* order */}
              <li onClick={()=>page_router("/orders")} >
                <img src="/images/order.svg" alt="" />
                <Link>
                Orders</Link>
              </li>

              {/* sell products */}
              <li onClick={()=>page_router("/sell")} >
                <img src="/images/sell.svg" alt="" />
                <Link>
                Sell Products</Link>
              </li>

              {/* about */}
              <li>
                <img src="/images/about.svg" alt="" />
                <Link onClick={()=>close_nav_containner()}
                to={"/about"} >About Me</Link>
              </li>
              
              {user_info.is_logined ? (
                <li className='logout_red_border' >
                  <img src="/images/logout.svg" alt="" />
                  <Link className='logout' onClick={()=>{logout(); close_nav_containner()}} to={"/"} >Log Out</Link>
                </li>
              ) : (
                <></>
              )}
              
            </ul>
          </div>

    </>
  )
}
