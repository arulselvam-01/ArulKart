import React from 'react'
import "../../styles/home/desktop/home_searchbar.css"
import "../../styles/home/mobile/home_searchbar_mobile.css"

export const Home_searchbar = (props) => {

    const {home_datas, save_home_datas, message_window, user_info, set_user_info, save_user_info, get_product_api} = props.utills

    // on press enter button in search bar
    const search_enter_button = (event)=>{
        if(event.key==="Enter" || event === "search"){
            get_product_api(`?keyword=${home_datas.search_input_data}`)
        }
    }

  return (
    <>
        <div className="search_containner">
          <input
          onChange={(e)=>save_home_datas("search_input_data", e.target.value)}
          value={home_datas.search_input_data}
          onKeyDown={search_enter_button}
          placeholder='Search Products...'
          className='search_bar'
          type="text" />
          <div onClick={()=>search_enter_button("search")} className="search_image">
            <img src="./images/search.svg" alt="" /> 
          </div>

      </div>
    </>
  )
}
