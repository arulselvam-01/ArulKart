import axios from 'axios'
import React from 'react'

export const Test = () => {

    const test_func = async()=>{
        try{
            var res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cook`, {
                withCredentials : true
            })
        }catch{
        }
    }

  return (
    <>
        <button
            onClick={()=>test_func()}
            style={{margin : "10px 20px", padding : "10px 20px"}}
        
        >test cookie</button>
    </>
  )
}
