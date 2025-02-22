import axios from "axios"

import React from 'react'

export const logout = () => {

    const logout = async()=>{
        try{
          loading(true)

          var res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {withCredentials : true})
    
          // if successful
          if (res.data.success){
            set_user_info((info)=>(
              {...info, "is_logined" : false}
            ))
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
        
    </>
  )
}
