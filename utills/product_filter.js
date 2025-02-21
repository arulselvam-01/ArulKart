

exports.products_filters = (url_query)=>{

    var data_base_query = {}

    // filter matched keyword
    if (url_query.keyword){
        var search_filter = {name : {$regex : url_query.keyword, $options : "i"}}

        data_base_query = search_filter
    }

    // search category
    if (url_query.category){

        var category_filter = {...data_base_query, "category" : url_query.category}
        
        data_base_query = category_filter
    }

    // prize filter
    if (url_query.prize){
        const prize_fil_args = url_query.prize.split(",")
        const prize = {}

        prize_fil_args.forEach((args)=>{
            const split_priz = args.split(":")
            prize[split_priz[0]] = split_priz[1]
        })

        var prize_filter = {...data_base_query, "prize" : prize}

        data_base_query = prize_filter

    }

    


    return data_base_query
}
