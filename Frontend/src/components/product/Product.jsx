import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Product_display } from './Product_display';

export const Product = (props) => {

const {message_window, user_info, set_user_info, save_user_info, get_date, loading} = props.utills

const navigate = useNavigate()

const { search } = useLocation();
const queryParams = new URLSearchParams(search);

const pid = queryParams.get('pid');

// if product id is undefined
useEffect(() => {
  if (!pid) {
    navigate("/");
  }
}, [pid, navigate]);

  return (
    <>
      <Product_display utills={{"user_info" : user_info, "set_user_info" : set_user_info, "message_window" : message_window, "save_user_info" : save_user_info,"get_date" : get_date, "pid" : pid, "loading" : loading}} />


    </>
  )
}
