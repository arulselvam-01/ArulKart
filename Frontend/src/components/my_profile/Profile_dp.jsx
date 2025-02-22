import axios from 'axios'
import React, { useState } from 'react'
import "../../styles/profile/desktop/profile_dp.css"
import { decrypt, encrypt } from '../utills/utills'

export const Profile_dp = (props) => {

  const {my_profile_data, save_profile_data, user_info, message_window, set_user_info, loading} = props.utills

  var input_error = false


  // user_cred saver func
  const save_user_info = (key, value)=>{
    set_user_info((old)=>(
      {...old, [key] : value}
    ))
  }




    // change username
  const change_username = async()=>{

    if (my_profile_data.profile_user_name === ""){
      return message_window("please Enter username", "bad")
    }
    try{
      loading(true)
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/change_username`, {new_username : encrypt(my_profile_data.profile_user_name)}, {withCredentials : true})

      if(res.data.success){
        message_window(res.data.message, "good")
        save_profile_data("profile_user_name_edit", false)
        set_user_info((old)=>({...old, ["name"] : decrypt(res.data.new_username)}))
      }

      
    }catch(err){
      const err_message = err.response ? err.response.data  : null

      // if server cannot start
      if (err.code === "ERR_NETWORK"){
        message_window("Connection refused !", "bad")
      }

      if (err_message){
        const err_message = err.response ? err.response.data  : null
        
        if (err_message.message === "Old password is incorrect !"){
          message_window(err_message.message, "bad")
          save_profile_data("error_old_password", err_message.message)
        }

      }

    }
    loading(false)
  }


  // change profile picture
  const change_profile_picture = async(event)=>{

    // get file
    const file = event.target.files[0];
    
    // profile file upload
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {

      // create form submit 
      const profile_image_file = new FormData()
      profile_image_file.append("image", file)

      // send to server
        try {
          loading(true)

            const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/change_profile`, profile_image_file, {withCredentials : true})

            save_user_info("profile_image", `${decrypt(res.data.new_avatar)}`)
            message_window("Profile changed successfully", "good")


        }catch(err){
          const err_message = err.response ? err.response.data : null
  
          // if server cannot start
          if (err.code === "ERR_NETWORK"){
            message_window("Connection refused !", "bad")
          }
          
          // max file size
          if (err_message.message){
            message_window(err_message.message, "bad")
          }
  
  
        }
        loading(false)


    } else {
      message_window("Please select a valid image file (JPG, JPEG, or PNG) only !", "bad")
    }

    // clear the input to upload again
    event.target.value = ""

  }

  // validate username input
  const validate_username = ()=>{
    // validate username
    if(my_profile_data.profile_user_name === ""){
      message_window("Please enter username !", "bad")
      input_error = true
    }else{
      input_error = false
    }

    // approve for change username
    if(!input_error)
      change_username()

  }
  
      // enter button click on input handle
      const enter_button_handle = (event)=>{
        if(event.key === "Enter"){
          validate_username()
        }
      }

  return (
    <>
        {/* top profile containner */}
        <div className="profile_containner">
          <div className="profile">
            <img

            src={user_info.profile_image}
            alt=""
            onError={()=>{save_user_info("profile_image", "/images/profile.svg")}}
             />
            <div
            onClick={()=>document.getElementById("profile_image_input").click()}
            className="select_prfoile_pic_button">+</div>
          </div>
          <div className={my_profile_data.profile_user_name_edit ? "edit_profile_changle_username_con" : "profile_changle_username_con"}>

            <input
            disabled={!my_profile_data.profile_user_name_edit}
            onKeyDown={enter_button_handle}
            onChange={(e)=>save_profile_data("profile_user_name", e.target.value)}
            value={my_profile_data.profile_user_name_edit ? my_profile_data.profile_user_name : user_info.name}
            className={my_profile_data.profile_user_name_edit ? "edit_profile_user_name" : "profile_user_name"}
            type="text" />

            {/* save and calcel button */}
            {my_profile_data.profile_user_name_edit ? (
              <>
                <button onClick={()=>validate_username()} className='save_profile_name_button' >save</button>
                <button onClick={()=>{save_profile_data("profile_user_name_edit", false); save_profile_data("profile_user_name", user_info.name);}} className='calcel_profile_name_button' >cancel</button>
              </>

            ) : (
              <img onClick={()=>{save_profile_data("profile_user_name_edit", true); save_profile_data("old_user_name", my_profile_data.profile_user_name);}} src="../images/pencil.svg" alt="" />
              
            )}
            
          </div>
        </div>

        {/* select file with  hidden */}
        <input
          type="file"
          id="profile_image_input"
          style={{ display: 'none' }}
          accept="image/jpeg, image/jpg, image/png"
          onChange={(event)=>{change_profile_picture(event)}}
        />

    </>
  )
}
