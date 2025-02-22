import React from 'react'
import "../../styles/home/desktop/home_pagination.css"
import "../../styles/home/mobile/home_pagination_mobile.css"

export const Home_pagenation = (props) => {

    const {home_datas, save_home_datas, message_window, user_info, set_user_info, save_user_info, get_product_api} = props.utills

    const products_per_page = 15
    var total_pages = Math.ceil((home_datas.total_products_count / products_per_page))
    // generate pages
    const generatePages = (n) => Array.from({ length: n }, (_, i) => i + 1);


    // handle get the page 
    const handle_get_page = (page)=>{
        // if page is less than 1
        if (page < 1){return null}

        // maximum page reached
        if (total_pages < page){
            return null
        }

        // if user press same page again
        if (home_datas.current_page == page){
            return null
        }

        get_product_api(`?page=${page}`)
        
    }

  return (
    <>

    <div className="home_paging_containner">
        {total_pages > 1 ? (
        <>
            {/* previous page */}
            <div
            onClick={()=>handle_get_page(Number(home_datas.current_page) - 1)}
            className="previous_page">
                Pre
            </div>

            {/* paging boxes */}
            {generatePages(total_pages).map((page_no)=>(
                <div
                key={page_no}
                className={home_datas.current_page == page_no ? "page_box current_page_box" : "page_box"}
                onClick={()=>handle_get_page(page_no)}>
                    {page_no}
                </div>
            ))}

            {/* next page */}
            <div
            onClick={()=>handle_get_page(Number(home_datas.current_page) + 1)}
            className="next_page">
                Next
            </div>

        </>
        ) : null}
    </div>


    </>
  )
}
