import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/login_signup/desktop//login_signup.css"
import axios from 'axios'
import validator from "validator"
import { Input_error } from './utills/Input_error'
import { decrypt, encrypt } from './utills/utills'

export const Signup = (props) => {

  const {message_window, set_user_info, save_user_info, loading} = props.utills

  var form_error = false

    // store user cred
    const [user_cred, set_user_cred] = useState({
        name : "",
        email : "",
        password : "",
        confirm_password : "",
        show_password : "password",
        error_name : false,
        error_email : false,
        error_password : false,
        error_confirm_password : false,
      })
      
      // user_cred saver func
      const save_cred = (key, value)=>{
        set_user_cred((old)=>(
          {...old, [key] : value}
        ))
      }

    
      // check box func show password
      const show_pass = ()=>{
        user_cred.show_password==="password" ? save_cred("show_password", "text") : save_cred("show_password", "password")
      }


    // check validator
    const form_validator = ()=>{

      // name 
      if (user_cred.name === ""){
        save_cred("error_name", "Please provide name")
        form_error = true
      }
      else{
        save_cred("error_name", false)
      }

      // email 
      if (!validator.isEmail(user_cred.email)){
        save_cred("error_email", "Please provide valid email")
        form_error = true
      }else{
        save_cred("error_email", false)
      }

      
      // null confirm password 
      if (user_cred.confirm_password === ""){
        save_cred("error_confirm_password", "Please provide confirm password")
        form_error = true
      }else{
        save_cred("error_confirm_password", false)
      }
      
      // passowrd does not match
      if (user_cred.password !== user_cred.confirm_password || user_cred.password===""){
        save_cred("error_password", "password does not match")
        save_cred("error_confirm_password", "password does not match")
        form_error = true
      }else{
        save_cred("error_password", false)
        save_cred("error_confirm_password", false)
      }
      
      
      if (!form_error){
        // finnal report error
        form_error = false
          signup_user()

      }
    }

    const navigate = useNavigate()

    // signup button
    const signup_user = async()=>{
      try{
        loading(true)

        var res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, {
          name : encrypt(user_cred.name), 
          email : encrypt(user_cred.email), 
          password : encrypt(user_cred.password), 
          confirm_password : encrypt(user_cred.confirm_password)
        }, {withCredentials : true})

        // if registered
        if (res.data.success){
          const logined_user = decrypt(res.data.user)
          logined_user.is_logined= true
          set_user_info(logined_user)
          save_user_info("profile_image", `${logined_user.avatar}`)
          message_window("Welcome, "+logined_user.name + " !", "good")
          navigate("/profile")
          
        }


      }catch(err){
        const err_message = err.response ? err.response.data  : null
        // if server cannot start
        if (err.code === "ERR_NETWORK"){
          message_window("Connection refused !", "bad")
        }

        // if error on u
        if (err_message){
          if (err_message.message === "User already exist"){
            save_cred("error_email", err_message.message)
            message_window(err_message.message, "bad")
  
          }else{
            message_window(err_message.message, "bad")
          }

        }


      }
      loading(false)

    }

  // handle login button while press enter
  const handle_login_button = (event)=>{
    if(event.key === "Enter"){
      form_validator()
    }
  }

  return (
    <>
      
      <div className={"login_containner"}>
        <div className="welcome">
          Hi, {user_cred.name.length>=20 ? user_cred.name.slice(0,20)+"..." : user_cred.name}
        </div>

        {/* name */}
        <label htmlFor="name">
          Enter Your Name
          <input onKeyDown={handle_login_button} className={user_cred.error_name ? "bad_input" : "good_input"} onChange={(e)=>{save_cred("name", e.target.value)}} value={user_cred.name} placeholder='Enter Name' name='name' type="text" id='name' />
        </label>
        <Input_error error={user_cred.error_name} />
        
        {/* email */}
        <label htmlFor="email">
          Enter Your Email
          <input onKeyDown={handle_login_button}  className={user_cred.error_email ? "bad_input" : "good_input"}  onChange={(e)=>{save_cred("email", e.target.value.trim())}} value={user_cred.email} placeholder='Enter Email' name='email' type="email" id='email' />
        </label>
        <Input_error error={user_cred.error_email} />
        
        {/* password */}
        <label htmlFor="password">
          Enter Your Password
          <input onKeyDown={handle_login_button}  className={user_cred.error_password ? "bad_input" : "good_input"}  onChange={(e)=>save_cred("password", e.target.value.trim())} value={user_cred.password} placeholder='Enter Password' name='password' type={user_cred.show_password} id='password' />
        </label>
        <Input_error error={user_cred.error_password} />
        
        {/* confirm pasword */}
        <label htmlFor="confirm_password">
          Confirm Password
          <input onKeyDown={handle_login_button}  className={user_cred.error_confirm_password ? "bad_input" : "good_input"}  onChange={(e)=>save_cred("confirm_password", e.target.value.trim())} value={user_cred.confirm_password} placeholder='Enter Confirm Password' name='confirm_password' type={user_cred.show_password} id='confirm_password' />
        </label>
        <Input_error error={user_cred.error_confirm_password} />

        {/* show password checkbox */}
        <label className='show_password sp' htmlFor="show_password">
          Show Password
          <input onClick={show_pass} type="checkbox" />
        </label>

        {/* signup button */}
        <button onClick={()=>form_validator()} className='form_signup_button hover_color' >Signup</button>

        {/* login navigation text */}
        <div onClick={()=>navigate("/login")} className="login_page pointer">
          Already Have an Account
        </div>
      </div>


    </>
  )
}
