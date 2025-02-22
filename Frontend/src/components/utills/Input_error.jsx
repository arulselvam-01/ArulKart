import React from 'react'

export const Input_error = (props) => {

  return (
    <>

        <div style={{fontSize : "15px", color : "rgb(252, 132, 132)", marginTop : "3px", textTransform : "capitalize"}} className="input_error">
            {props.error}
        </div>
        

    </>
  )
}
