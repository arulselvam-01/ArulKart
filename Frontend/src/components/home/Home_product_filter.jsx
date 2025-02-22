import React, { useState } from 'react'
import "../../styles/home/desktop/home_product_filter.css"
import "../../styles/home/mobile/home_product_filter_mobile.css"

export const Home_product_filter = (props) => {

    const {home_datas, save_home_datas, message_window, user_info, set_user_info, save_user_info, get_product_api, loading} = props.utills

    const [filter_data, set_filter_data] = useState({
    filter : "",
    category : "",
    prize_filter_min : "",
    prize_filter_max : ""

    })



// save datas dynamically
  const save_filter_data = (key, value)=>{
    set_filter_data((old)=>(
      {...old, [key] : value}
    ))
  }

    const filter_it = ()=>{
        save_home_datas("no_data", "")
        loading(true)


        var is_filtered = false

        var filtered_products = home_datas.backup_all_products

        // filter 
        if (filter_data.filter){
            is_filtered = true
            // exclude out of stock
            if (filter_data.filter == "exclude_ofs"){
                filtered_products = filtered_products.filter(product => product.stock > 0);

            }

            if (filter_data.filter.slice(1) === "star"){
                filtered_products = filtered_products.filter(product => product.ratings == filter_data.filter[0]); //start 1,2,3,4,5
            }

            // prize low to high
            if (filter_data.filter == "prize_low2high"){
                filtered_products = filtered_products.slice().sort((a, b) => a.prize - b.prize);

            }
            
            // prize high to low
            if (filter_data.filter == "prize_high2low"){
                filtered_products = filtered_products.slice().sort((a, b) => b.prize - a.prize);

            }

            // ratings low to high
            if (filter_data.filter == "ratings_low2high"){
                filtered_products = filtered_products.slice().sort((a, b) => Number(a.ratings) - Number(b.ratings));

            }
            
            // ratings high to low
            if (filter_data.filter == "ratings_high2low"){
                filtered_products = filtered_products.slice().sort((a, b) => Number(b.ratings) - Number(a.ratings));

            }

        }


        // category filter
        if (filter_data.category){
            is_filtered = true
            filtered_products = filtered_products.filter(product => product.category === filter_data.category);

        }

        // min prize filter
        if (filter_data.prize_filter_min && !filter_data.prize_filter_max){
            is_filtered = true
            filtered_products = filtered_products.filter(product => 
                parseFloat(product.prize) >= filter_data.prize_filter_min);
            
        }

        // max prize filter
        if (!filter_data.prize_filter_min && filter_data.prize_filter_max){
            is_filtered = true
            filtered_products = filtered_products.filter(product => 
                parseFloat(product.prize) <= filter_data.prize_filter_max);
            
        }

        // prize filter minand max
        if (filter_data.prize_filter_min && filter_data.prize_filter_max){
            is_filtered = true
            filtered_products = filtered_products.filter(product => 
                parseFloat(product.prize) >= filter_data.prize_filter_min && parseFloat(product.prize) <= filter_data.prize_filter_max);
            
        }

        // if no filter applied 
        if (!is_filtered){
            save_home_datas("no_data", "")
            // get_product_api()
            save_home_datas("all_products", home_datas.backup_all_products)
        }


        // if no proudct in filtered
        if (filtered_products.length < 1){
            save_home_datas("no_data", "product not found : (")
            save_home_datas("all_products", filtered_products)
        }
        
        // if filter applied
        if(is_filtered && filtered_products.length > 0){
            // save the filtered product
            save_home_datas("all_products", filtered_products)
        }

        loading(false)

    }

    const filter_reset_button = ()=>{
        save_filter_data("filter", "")
        save_filter_data("category", "")
        save_filter_data("prize_filter_min", "")
        save_filter_data("prize_filter_max", "")

        // reset all product filter
        // get_product_api()
        save_home_datas("all_products", home_datas.backup_all_products)
    }

  return (
    <>
        <div className="filter_sorting_canvas_containner">
             
            <div className="filter_and_category_con">
                {/* filter containner */}
                <label htmlFor="home_product_filter_input_label" className='home_product_filter_label'>
                Filter
                    <select
                    value={filter_data.filter}
                    onChange={(e)=>save_filter_data("filter", e.target.value)}
                    id="home_product_filter_input">
                        <option value="">Select Filter</option>
                        <option value="exclude_ofs">Exclude Out of Stock</option>
                        <option value="prize_low2high">Prize Low to High</option>
                        <option value="prize_high2low">Prize High to Low</option>
                        <option value="ratings_low2high">Ratings Low to High</option>
                        <option value="ratings_high2low">Ratings High to Low</option>
                        <option value="1star">1 Star</option>
                        <option value="2star">2 Star</option>
                        <option value="3star">3 Star</option>
                        <option value="4star">4 Star</option>
                        <option value="5star">5 Star</option>
                    </select>
                </label>



            {/* category fiter */}
                <label
                htmlFor="home_product_category_filter" className='home_product_category_filter_label'>
                    Select Category
                    <select
                    onChange={(e)=>save_filter_data("category", e.target.value)}
                    value={filter_data.category}
                    id="home_product_category_filter">
                        <option value="">Select Category</option>
                        <option value="tech">tech</option>
                        <option value="electronics">electronics</option>
                        <option value="mobile">mobile</option>
                        <option value="laptops">laptops</option>
                        <option value="accessories">accessories</option>
                        <option value="headphones">headphones</option>
                        <option value="food">food</option>
                        <option value="books">books</option>
                        <option value="clothes">clothes</option>
                        <option value="shoes">shoes</option>
                        <option value="beauty">beauty</option>
                        <option value="health">health</option>
                        <option value="sports">sports</option>
                        <option value="outdoor">outdoor</option>
                        <option value="home">home</option>
                    </select>
                </label>

            </div>

        <div className="prize_and_go_reset">

            {/* prize filter */}
            <label className='home_product_prize_filter' htmlFor="">
                Prize Filter

                <div className="prize_filter_min_max_con">
                    {/* min prize input */}
                    <input
                        onChange={(e)=>save_filter_data("prize_filter_min", e.target.value)}
                        value={filter_data.prize_filter_min}
                        placeholder='Min Prize'
                        min={0}
                        type="number"
                    />
                
                    {/* max prize input */}
                    <input
                        onChange={(e)=>save_filter_data("prize_filter_max", e.target.value)}
                        value={filter_data.prize_filter_max}
                        placeholder='Max Prize'
                        min={0} type="number"
                    />

                </div>
            </label>

            <div className="go_and_reset_button">
                <button onClick={filter_it} className='filter_go_button' >GO</button>
                <button onClick={filter_reset_button} className='filter_reset_button' >Reset</button>

            </div>

        </div>



    </div>


    </>
  )
}
