import React, { useState } from 'react'
import "../styles/login_signup/desktop/login_signup.css"
import "../styles/login_signup/mobile/login_signup_mobile.css"
import { useNavigate } from 'react-router-dom'
import validator from "validator"
import { Input_error } from './utills/Input_error'
import axios from 'axios'
import { Test } from './test'
import { decrypt, encrypt } from './utills/utills'


export const Login = (props) => {

  const {message_window, user_info, set_user_info, save_user_info, loading} = props.utills

  const [user_cred, set_user_cred] = useState({
    email : "",
    password : "",
    show_password : "password",
    error_email : false,
    error_password : false,
  })

  const save_cred = (key, value)=>{
    set_user_cred((old)=>(
      {...old, [key] : value}
    ))
  }

  const show_pass = ()=>{
    user_cred.show_password==="password" ? save_cred("show_password", "text") : save_cred("show_password", "password")
  }

  const navigate = useNavigate()

  // check validator
  const form_validator = ()=>{
    var form_error = false

    // email 
    if (!validator.isEmail(user_cred.email)){
      save_cred("error_email", "Please provide valid email")
      form_error = true
    }else{
      save_cred("error_email", false)
    }

    // passowrd 
    if (user_cred.password===""){
      save_cred("error_password", "Please provide password")
      form_error = true
    }else{
      save_cred("error_password", false)
    }

    // final report 
    if (!form_error){
      // final report error
      login()

    }

  }

    // login button
    const login = async()=>{
      try{
        loading(true)

        var res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
          email : encrypt(user_cred.email), 
          password : encrypt(user_cred.password,) 
        },{withCredentials : true})
      

        // if successful
        if (res.data.success){
          const logined_user = decrypt(res.data.user)
          logined_user.is_logined= true
          set_user_info(logined_user)
          save_user_info("profile_image", `${logined_user.avatar}`)
          message_window("Welcome Again , "+logined_user.name + " !", "good")
          navigate("/")
          
        }
      

      }catch(err){
        const err_message = err.response ? err.response.data : null

        // if server cannot start
        if (err.code === "ERR_NETWORK"){
          message_window("Connection refused !", "bad")
        }

        if (err_message){
          // error on u
          if (err_message.message === "user does not found !"){
            message_window("Email does not exist", "bad")
            save_cred("error_email", err_message.message)
          }else if(err_message.message === "Invalid password !"){
            message_window("invalid password !", "bad")
            save_cred("error_password", err_message.message)
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
      
      <div className="login_containner">
        <div className="welcome">
          Welcome Again...
        </div>

        <label htmlFor="email">
          Enter Your Email
          <input onKeyDown={handle_login_button} className={user_cred.error_email ? "bad_input" : "good_input"}  onChange={(e)=>{save_cred("email", e.target.value)}} value={user_cred.email} placeholder='Enter Email' name='email' type="email" id='email' />
        </label>
        <Input_error error={user_cred.error_email} />
        
        <label htmlFor="password">
          Enter Your Password
          <input onKeyDown={handle_login_button} className={user_cred.error_password ? "bad_input" : "good_input"}  onChange={(e)=>save_cred("password", e.target.value)} value={user_cred.password} placeholder='Enter Password' name='password' type={user_cred.show_password} id='password' />
        </label>
        <Input_error error={user_cred.error_password} />

        <label className='show_password sp' htmlFor="show_password">
          Show Password
          <input onClick={show_pass} type="checkbox" />
        </label>

        <button onClick={()=>form_validator()} className='form_login_button hover_color' >Login</button>

        <div onClick={()=>navigate("/signup")} className="signup_page pointer">
          Create new Account
        </div>
      </div>

    </>
  )
}
