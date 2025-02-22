import React, {  useState } from 'react'
import "../../styles/profile/desktop/profile_address.css"
import "../../styles/profile/mobile/profile_address_mobile.css"
import { Input_error } from '..//utills/Input_error'
import axios from 'axios'
import { decrypt, encrypt } from '../utills/utills'

export const Profile_address = (props) => {

    const {my_profile_data, save_profile_data, user_info, message_window, set_user_info, loading} = props.utills

    var address_field_err = false
  
    // camcel address edit func
    const cancel_address_edit = ()=>{
      save_profile_data("address_edit", false)

      save_profile_data("err_new_phno", false)
      save_profile_data("err_new_pincode", false)
      save_profile_data("err_new_state", false)
      save_profile_data("err_new_district", false)
      save_profile_data("err_new_landmark", false)
      save_profile_data("err_new_address", false)
    }

    // save address
    const save_address = async()=>{
        try{
          loading(true)
            const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/change_address`, {
                new_phno : encrypt(my_profile_data.new_phno),
                new_pincode : encrypt(my_profile_data.new_pincode),
                new_state : encrypt(my_profile_data.new_state),
                new_district : encrypt(my_profile_data.new_district),
                new_landmark : encrypt(my_profile_data.new_landmark),
                new_address : encrypt(my_profile_data.new_address),
            }, {withCredentials : true})
      
            if(res.data.success){
              set_user_info((old)=>({...old, ["delivery_address"] : decrypt(res.data.new_delivery_address)}))
              save_profile_data("address_edit", false)
              message_window(res.data.message, "good")
            }

            
          }catch(err){
            const err_message = err.response ? err.response.data  : null
      
            // if server cannot start
            if (err.code === "ERR_NETWORK"){
              message_window("Connection refused !", "bad")
            }
      
            if (err_message){
              if (err_message.message){
                message_window(err_message.message, "bad")

              }
            }
      
          }
          loading(false)
    }

    const validate_address_fields = (op)=>{
      
      if(op==="edit"){
          // initailize to input for edit
          save_profile_data("new_phno", user_info.delivery_address.phno)
          save_profile_data("new_pincode", user_info.delivery_address.pincode)
          save_profile_data("new_state", user_info.delivery_address.state)
          save_profile_data("new_district", user_info.delivery_address.district)
          save_profile_data("new_landmark", user_info.delivery_address.landmark)
          save_profile_data("new_address", user_info.delivery_address.address)
            return save_profile_data("address_edit", my_profile_data.address_edit ? false : true)
        }

        // validate the address input fields

        // validate phone no
        if (my_profile_data.new_phno === "" || my_profile_data.new_phno == undefined){
            save_profile_data("err_new_phno", "enter phone no")
            address_field_err = true
        }
        
        // validate pincode
        if (my_profile_data.new_pincode === "" || my_profile_data.new_pincode == undefined){
            save_profile_data("err_new_pincode", "enter pincode no")
            address_field_err = true
        }

        // validate state
        if (my_profile_data.new_state === ""){
            save_profile_data("err_new_state", "enter state name")
            address_field_err = true
        }else{
            save_profile_data("err_new_state", false)
        }

        // validate district
        if (my_profile_data.new_district === ""){
            save_profile_data("err_new_district", "enter distric name")
            address_field_err = true
        }else{
            save_profile_data("err_new_district", false)
        }

        // validate landmark
        if (my_profile_data.new_landmark === ""){
            save_profile_data("err_new_landmark", "enter landmark place")
            address_field_err = true
        }else{
            save_profile_data("err_new_landmark", false)
        }

        // validate address
        if (my_profile_data.new_address === ""){
            save_profile_data("err_new_address", "enter address")
            address_field_err = true
        }else{
            save_profile_data("err_new_address", false)
        }

        // validate phno less than 10
        if(my_profile_data.new_phno !== ""){
            if (my_profile_data.new_phno.length !== 10){
                save_profile_data("err_new_phno", "enter valid phone no")
                address_field_err = true
            }else{
                save_profile_data("err_new_phno", false)
            }
        }

        // validate pincode less than 6
        if (my_profile_data.new_pincode !== ""){
            if (my_profile_data.new_pincode.length !== 6){
                save_profile_data("err_new_pincode", "enter valid pincode")
                address_field_err = true
            }else{
                save_profile_data("err_new_pincode", false)
            }
        }

        // allow for save address
        if (!address_field_err){
            address_field_err = false
            save_address()

        }
        



    }

    // enter button click on input handle
    const enter_button_handle = (event)=>{
      if(event.key === "Enter"){
        validate_address_fields()
      }
    }



  return (
    <>
        {/* address containner */}
        <div className="profile_address_con">
          <div className="profile_address_heading">
            Address
            <div className="address_save_and_cancel_buttons">
              {my_profile_data.address_edit ? <button className='profile_cancel_address_edit' onClick={()=>cancel_address_edit()} >Cancel</button>: null}
              <button
              className={my_profile_data.address_edit ? "" : "address_edit_mode_button"}
              onClick={()=>{my_profile_data.address_edit ? validate_address_fields("save") : validate_address_fields("edit")}} >{my_profile_data.address_edit ? "Save Address" : "Edit Address"} </button>

            </div>
          </div>

          {/* phone number */}
          <label htmlFor='profile_ph_no' className="profile_ph_no_con">
            Phone No
            <input
            onKeyDown={enter_button_handle}
            placeholder='Enter Phone no'
            onChange={(e)=>save_profile_data("new_phno", e.target.value)}
            value={my_profile_data.address_edit ? my_profile_data.new_phno : user_info.delivery_address.phno}
            readOnly={!my_profile_data.address_edit}
            className={my_profile_data.address_edit ? "profile_input_freeze" : ""}
            type="text" id="profile_ph_no" />
            <Input_error error={my_profile_data.err_new_phno} />

          </label>
          
          {/* pincode and state containner */}
          <div className="pincode_state_con">
            {/* pincode */}
            <label className='profile_pincode_con' htmlFor="pincode">
              Pincode
              <input
              onKeyDown={enter_button_handle}
              placeholder='Enter Pincode'
              onChange={(e)=>save_profile_data("new_pincode", e.target.value)}
              value={my_profile_data.address_edit ? my_profile_data.new_pincode : user_info.delivery_address.pincode}
              readOnly={!my_profile_data.address_edit}
              className={my_profile_data.address_edit ? "profile_input_freeze" : ""}
              id='pincode' type="text" />

            <Input_error error={my_profile_data.err_new_pincode} />

            </label>
            {/* state */}
            <label className='profile_state_con' htmlFor="state">
              State
              <input
              onKeyDown={enter_button_handle}
              placeholder='Enter State'
              onChange={(e)=>save_profile_data("new_state", e.target.value)}
              value={my_profile_data.address_edit ? my_profile_data.new_state : user_info.delivery_address.state}
              readOnly={!my_profile_data.address_edit}
              className={my_profile_data.address_edit ? "profile_input_freeze" : ""} id='state'
              type="text" />

            <Input_error error={my_profile_data.err_new_state} />

            </label>
          </div>
          
          {/* district and landnark containner */}
          <div className="district_landmark_con">
            {/* district */}
            <label className='profile_district_con' htmlFor="district">
              District
              <input
              onKeyDown={enter_button_handle}
              placeholder='Enter District'
              onChange={(e)=>save_profile_data("new_district", e.target.value)}
              value={my_profile_data.address_edit ? my_profile_data.new_district : user_info.delivery_address.district}
              readOnly={!my_profile_data.address_edit}
              className={my_profile_data.address_edit ? "profile_input_freeze" : ""} id='district'
              type="text" />

            <Input_error error={my_profile_data.err_new_district} />

            </label>
            {/* landmark */}
            <label className='profile_landmark_con' htmlFor="landmark">
              Landmark
              <input
              onKeyDown={enter_button_handle}
              placeholder='Enter Landmark'
              onChange={(e)=>save_profile_data("new_landmark", e.target.value)}
              value={my_profile_data.address_edit ? my_profile_data.new_landmark : user_info.delivery_address.landmark}
              readOnly={!my_profile_data.address_edit}
              className={my_profile_data.address_edit ? "profile_input_freeze" : ""} id='landmark'
              type="text" />
            
            <Input_error error={my_profile_data.err_new_landmark} />

            </label>
          </div>

          {/* address */}
          <label className='profile_address_box_con' htmlFor="address">
            Address
            <textarea
            onKeyDown={enter_button_handle}
            placeholder='Enter your Address'
            onChange={(e)=>save_profile_data("new_address", e.target.value)}
            value={my_profile_data.address_edit ? my_profile_data.new_address : user_info.delivery_address.address}
            readOnly={!my_profile_data.address_edit}
            className={my_profile_data.address_edit ? "profile_input_freeze" : ""} id="address"></textarea>

            <Input_error error={my_profile_data.err_new_address} />

          </label>

        </div>
    </>
  )
}
