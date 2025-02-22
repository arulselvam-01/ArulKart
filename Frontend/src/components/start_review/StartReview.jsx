import React, { useState } from 'react'
import "./star_review.css"

export const StartReview = (props) => {

  const {star_data, save_star_data} = props.utills


  // star handle
  const star_handle = (action, star_no)=>{
    // change star on click
    if(action==="click"){
      save_star_data("change_star", false)
      save_star_data("star_no", star_no)
    }

    // chage star on hover
    if (star_data.change_star && action === "hover"){
      save_star_data("star_no", star_no)
    }

  }

  return (
    <>
        <div onMouseLeave={()=>star_handle("hover", 0)} className="star_containner">
            <img className='stars' src={`./images/star/star${star_data.star_no}.png`} alt="no start" />

            <div
              onClick={()=>star_handle("click", 1)}
              onMouseOver={()=>star_handle("hover", 1)}
              className="star_box_1">  
            </div>

            <div 
              onClick={()=>star_handle("click", 2)}
              onMouseOver={()=>star_handle("hover", 2)}
              className="star_box_2">
            </div>

            <div
              onClick={()=>star_handle("click", 3)}
              onMouseOver={()=>star_handle("hover", 3)} 
              className="star_box_3">
            </div>

            <div
              onClick={()=>star_handle("click", 4)}
              onMouseOver={()=>star_handle("hover", 4)} 
              className="star_box_4">
            </div>

            <div
              onClick={()=>star_handle("click", 5)}
              onMouseOver={()=>star_handle("hover", 5)} 
              className="star_box_5">
            </div>
        </div>
    </>
  )
}
