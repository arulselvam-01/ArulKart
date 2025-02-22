import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../../styles/product/desktop/product_review.css"
import "../../styles/product/mobile/product_review_mobile.css"
import { StartReview } from '../start_review/StartReview'
import axios from 'axios'
import { encrypt } from '../utills/utills'

export const Product_review = (props) => {

const {pid, message_window, user_info, set_user_info, save_user_info, product, star_data, save_star_data, set_product, loading} = props.utills

const navigate = useNavigate()


const star_info_names = {1 : "very bad", 2 : "bad", 3 : "good", 4 : "very good", 5 : "excellent"}

// review api
const review_api = async()=>{
    try {
        loading(true)

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/add_review?pid=${pid}`, {star_no : star_data.star_no, comment : star_data.comment}, {withCredentials: true}
        )

        if (res.data.success) {
          set_product(res.data.product)
          save_star_data("show_comment", false)

        }


    }catch (err) {
        // if server cannot start
        if (err.code === "ERR_NETWORK"){
            message_window("Connection refused !", "bad")
        }

    }
    loading(false)
}


//handle rate button 
const handle_rate_button = ()=>{
    // if user not login
    if (!user_info.name){
        return navigate("/login")
    }
    
    if (!star_data.show_comment){
        return save_star_data("show_comment", true)
    }
    
    // call review api
    if (star_data.comment && !star_data.star_no <= 0){
        review_api()
    }else{
        message_window("Please Select star !", "bad")
    }

}

// on press enter button while comment
const handle_enter_button = (event)=>{
    if (event.key === "Enter"){
        handle_rate_button()
    }
}

useState(()=>{
    if (product.reviews.length > 0){
        for(const review of product.reviews){
            if (review.user_id == user_info._id){
            save_star_data("comment", review.comment)
            save_star_data("star_no", Number(review.ratings))
            save_star_data("change_star", false)
            }
        }
    }

}, [product.reviews, user_info._id])




  return (
    <>
        <div className="single_product_review_containner">
            <div className="ratings_heading">
                Reviews & Ratings
            </div>

            <div className="review_containner">

                <div className="star_hover_comment_name_button">

                    <div style={{opacity : star_data.show_comment ? "100" : "0"}} className="star_hover_and_comment">
                        <div className="star_hover">
                            <StartReview utills = {{"star_data" : star_data, "save_star_data" : save_star_data}}/>

                            {/* star name */}
                            <div className="star_info">{star_info_names[star_data.star_no]}</div>
                        </div>

                        <input
                        onKeyDown={handle_enter_button}
                        value={star_data.comment}
                        onChange={(e)=>save_star_data("comment", e.target.value)}
                        placeholder='Comment Your Opinion'
                        id='review_input'
                        type="text"
                        />
                    </div>

                    {/* rate button */}
                    <button
                    onClick={()=>handle_rate_button()}
                    className='rate_button' >
                        {star_data.show_comment ? "Save" : "Rate"}
                    </button>
                </div>

            </div>

        {/* display reviewer */}

        <div className="reviewed_user_containner">

            {product.reviews.length > 0 && product.reviews.map((review, index)=>{

            return (
            <div key={review.user_id || index} className="reviewed_user">
                
                {/* reviewer image */}
                <div className="reviewer_image">
                    <img src={`${review.user_image}`}
                    onError={(e)=>{
                    if(!e.target.dataset.fallback){
                        e.target.dataset.fallback = "true"
                        e.target.src = "/images/profile.svg";
                    }
                        }}
                        alt="no image" />
                </div>

                {/* reviwer info */}
                <div className="reviewer_info">

                    {/* reviewer name */}
                    <div className="reviewer_name">
                        {review.user_name}
                    </div>
                    
                    {/* reviewer name */}
                    <div className="reviewer_rating">
                        <img src={`/images/star/star${review.ratings}.png`} alt="" />
                    </div>
                    
                    {/* reviewer comment */}
                    <div className="reviewer_comment">
                        {review.comment}
                    </div>
                </div>

            </div>
            )

            })}

        </div>

        </div>
    </>
  )
}
