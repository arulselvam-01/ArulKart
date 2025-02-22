import React, { useState } from 'react'
import "../../styles/profile/desktop/profile.css"
import "../../styles/profile/mobile/profile_mobile.css"
import { Input_error } from '../utills/Input_error'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'
import { Profile_address } from './Profile_address'
import { Profile_dp } from './Profile_dp'
import { encrypt } from '../utills/utills'

export const Profile = (props) => {


  const {message_window, user_info, set_user_info, loading} = props.utills

  const navigate = useNavigate()

  var form_error = false

  const [my_profile_data, set_my_profile_data] = useState({
    change_password : false,
    show_password : "password",
    profile_user_name_err : false,
    profile_user_name_edit : false,
    old_user_name : "",
    old_password : "",
    new_password : "",
    confirm_password : "",
    error_old_password : false,
    error_new_password : false,
    error_confirm_password : false,

    show_delete_ack_window : false,
    address_edit : false,

    new_phno : user_info.delivery_address.phno || "",
    new_pincode : user_info.delivery_address.pincode || "",
    new_state : user_info.delivery_address.state || "",
    new_district : user_info.delivery_address.district || "",
    new_landmark : user_info.delivery_address.landmark || "",
    new_address : user_info.delivery_address.address || "",
    
    err_new_phno : "",
    err_new_pincode : "",
    err_new_state : "",
    err_new_district : "",
    err_new_landmark : "",
    err_new_address : "",


  })

  // alert(my_profile_data.profile_user_name)

  // user_cred saver func
  const save_profile_data = (key, value)=>{
    set_my_profile_data((old)=>(
      {...old, [key] : value}
    ))
  }

  // check box func show password
  const show_pass = ()=>{
    my_profile_data.show_password==="password" ? save_profile_data("show_password", "text") : save_profile_data("show_password", "password")
  }

  // save password
  const save_password = async()=>{

    try{
      loading(true)

      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/change_password`, {
        old_password : encrypt(my_profile_data.old_password),
        new_password : encrypt(my_profile_data.new_password),
        confirm_password : encrypt(my_profile_data.confirm_password)
      }, {withCredentials : true})

      if(res.data.success){
        message_window("password changed successfully", "good")
        save_profile_data("change_password", false)
      }

      
    }catch(err){
      const err_message = err.response ? err.response.data  : null

      // if server cannot start
      if (err.code === "ERR_NETWORK"){
        message_window("Connection refused !", "bad")
      }

      if (err_message){

        if (err_message.message === "Old password is incorrect !"){
          message_window(err_message.message, "bad")
          save_profile_data("error_old_password", err_message.message)

        }

      }

    }
    loading(false)


  }

  // delete account
  const delete_account = async(op)=>{

    if(!op){
      set_my_profile_data("show_delete_ack_window", false)
    }

    if(op){
      try{
        loading(true)

        const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/delete_account`, {withCredentials : true})

        if(res.data.success){
          message_window(res.data.message, "good")
          set_user_info("is_logined", false)
          navigate("/")
        }


      }catch(err){
        // if server cannot start
        if (err.code === "ERR_NETWORK"){
          message_window("Connection refused !", "bad")
        }
      }
      
      loading(false)

    }



  }

  // password validate
  const validate_password = ()=>{
    // if old password input is null
    if (my_profile_data.old_password === ""){
      save_profile_data("error_old_password", "Please enter old password")
      form_error = true
    }else{
      save_profile_data("error_old_password", false)
    }

    // if new password input is null
    if (my_profile_data.new_password === ""){
      save_profile_data("error_new_password", "please enter new password")
      form_error = true
    }else{
      save_profile_data("error_new_password", false)
    }

    // if confirm password input is null
    if (my_profile_data.confirm_password === ""){
      save_profile_data("error_confirm_password", "please enter confirm password")
      form_error = true
    }else{
      save_profile_data("error_confirm_password", false)
    }
    
    if (my_profile_data.new_password !== "" && my_profile_data.confirm_password !== ""){
      if (my_profile_data.new_password !== my_profile_data.confirm_password){
        form_error = true
        save_profile_data("error_new_password", "password does not match")
        save_profile_data("error_confirm_password", "password does not match")
      }else{
        save_profile_data("error_new_password", false)
        save_profile_data("error_confirm_password", false)

      }
    }

    // if there is not input error
    if (!form_error){
      form_error = false
      save_profile_data("error_old_password", false)
      save_profile_data("error_new_password", false)
      save_profile_data("error_confirm_password", false)
      save_password()
    }



  }

  // enter button click on input handle
  const enter_button_handle = (event)=>{
    if(event.key === "Enter"){
      validate_password()
    }
  }



  return (
    <>
    <div className="canvas">
      <div className="myinfo_containner">

        <div className="profile_heading">My Profile</div>

        <Profile_dp utills = {{"my_profile_data" : my_profile_data, "save_profile_data" : save_profile_data, "user_info" : user_info, "message_window" : message_window, "set_user_info" : set_user_info, "loading" : loading}} />

        {/* user info containner */}
        <div className="profile_info_containner">
          {/* email */}
          <div className="profile_email_con">
            <div className="email_label">Email</div>
            <div className="email_content">{user_info.email}</div>
          </div>

          {/* show password */}
          {my_profile_data.change_password ? (
          <>
          {/* old password */}
            <label htmlFor='profile_old_password' className="profile_old_password_con">
              Old Password
              <input
              onKeyDown={enter_button_handle}
              className={my_profile_data.error_old_password ? "bad_input" : "good_input"}
              onChange={(e)=>save_profile_data("old_password", e.target.value)}
              value={my_profile_data.old_password}
              placeholder='Enter old pasword'
              type={my_profile_data.show_password}
              id='profile_old_password' />

              <Input_error error={my_profile_data.error_old_password} />
            </label>

          {/* new password */}
            <label htmlFor='profile_new_password' className="profile_new_password_con">
            New Password
              <input
              onKeyDown={enter_button_handle}
              className={my_profile_data.error_new_password ? "bad_input" : "good_input"}
              onChange={(e)=>save_profile_data("new_password", e.target.value)}
              value={my_profile_data.new_password}
              placeholder='Enter New password'
              type={my_profile_data.show_password}
              id='profile_new_password' />

              <Input_error error={my_profile_data.error_new_password} />
            </label>

          {/* confirm password */}
            <label htmlFor='profile_confirm_password' className="profile_confirm_password_con">
            Confirm Password
              <input
              onKeyDown={enter_button_handle}
              className={my_profile_data.error_confirm_password ? "bad_input" : "good_input"}
              onChange={(e)=>save_profile_data("confirm_password", e.target.value)} value={my_profile_data.confirm_password}
              placeholder='Enter Confirm password'
              type={my_profile_data.show_password}
              id='profile_confirm_password' />

              <Input_error error={my_profile_data.error_confirm_password} />
            </label>

          {/* show password checkbox */}
          <label onClick={show_pass} className='show_password psp' htmlFor="show_password">
            Show Password
            <input onClick={show_pass} id='show_password' type="checkbox" />
          </label>

          {/* cancel passwrod change button */}
          <button onClick={()=>save_profile_data("change_password", false)} className='profile_password_cancel_button'>Cancel</button>
          
          {/* Update password button */}
          <button onClick={()=>{validate_password()}} className='profile_password_update_button' >Update</button>

          </>
          ) : (
            <>
              {/* show password */}
              <div className="profile_password_con">
                <div className="password_label">Password</div>
                <div className="password_content">******************</div>
              </div>

              {/* change password button */}
              <button onClick={()=>save_profile_data("change_password", true)}  className='profile_change_password' >Change Password</button>
            </>

          )}

          {/* address */}
          <Profile_address utills = {{"my_profile_data" : my_profile_data, "save_profile_data" : save_profile_data, "user_info" : user_info, "message_window" : message_window, "set_user_info" : set_user_info, "loading" : loading}} />



        </div>
        {!my_profile_data.address_edit ? 
        <button onClick={()=>save_profile_data("show_delete_ack_window", true)} className='profile_delete_user' >Delete Account</button>
        : null
        }


      </div>

    </div>
    
      <div className={my_profile_data.show_delete_ack_window ? "delete_account_ack show_delete_account_ack" : "delete_account_ack"}>
        <p>Are you sure About to delete this account !</p>
        <div className="del_buttons">
          <button onClick={()=>delete_account(false)} >no</button>
          <button onClick={()=>delete_account(true)} >yes</button>

        </div>
      </div>

        

    </>
  )
}
