import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {getCategories, getFilteredProducts} from './apiCore';
import CheckBox from './CheckBox';
import RadioBox from './RadioBox';
import {prices} from './fixedPrices';
import Card from './Card';

const Shop = () => {
    const [myFilters, setMyFilters] = useState({
        filters: {category : [], price: []}
    })
    const [categories, setCategories] = useState([]);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [error, setError] = useState(false);
    const [filteredResults, setFilteredResults] = useState([])

    const init = () => {
        getCategories().then(data => {
            if(data.error) {
                setError(data.error)
            } else {
                setCategories(data)
            }
        })
    }

    const loadFilteredResults = (newFilters) => {
        //console.log(newFilters);
        getFilteredProducts(skip, limit, newFilters)
        .then(data => {
            if(data.error){
                setError(data.error);
            } else {
                setFilteredResults(data.data)
                setSize(data.size)
                setSkip(0)
            }
        })
        
    }

    const loadMore = () => {
        let toSkip = skip + limit;
        //console.log(newFilters);
        getFilteredProducts(toSkip, limit, myFilters.filters)
        .then(data => {
            if(data.error){
                setError(data.error);
            } else {
                setFilteredResults([...filteredResults, ...data.data])
                setSize(data.size)
                setSkip(toSkip)
            }
        })
        
    }

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        )
    }

    useEffect(() => {
        init();
        loadFilteredResults(skip, limit, myFilters.filters)
    }, [])

    /*
    *   filterBy will be either category or price
    *   using newFilters.filters[filterBy] either gets you
    *   newFilters.category or newFilters.price
    */
    const handleFilters = (filters, filterBy) => {
       const newFilters = {...myFilters}
       newFilters.filters[filterBy] = filters;

       if(filterBy === "price"){
           let priceValues = handlePrice(filters)
           newFilters.filters[filterBy] = priceValues;
       }
       loadFilteredResults(myFilters.filters);
       setMyFilters(newFilters)
    }

    const handlePrice = value => {
        const data = prices;
        let array = [];

        for(let key in data){
            if(data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }

        return array
    }

    


    return (
        <Layout title="Shop Page" description="Search and find books of your choice" className="container-fluid">
            
           <div className="row">

               <div className="col-4">
                   <h4>Filter by categories</h4>
                  <ul>
                    {/* CheckBox's handleFilters method will activate Shop's handleFilters method
                    CheckBox will pass and array of catgory id's to it's handleFilter method prop
                    which inturn calls Shop's handleFilter method */}
                    <CheckBox categories={categories} handleFilters={filters => 
                        (handleFilters(filters, 'category'))}/>
                  </ul>
                  {/* similar thing to CheckBox happens with RadioBox */}
                  <h4>Filter by price</h4>
                  <div>
                    <RadioBox prices={prices} handleFilters={filters => 
                        (handleFilters(filters, 'price'))}/>
                  </div>
               </div>

               <div className="col-8">
                   <h2 className="mb-4">Products</h2>
                   <div className="row">
                       {filteredResults.map((p, i) => (
                            
                            <div className="col-4 mb-3">
                                <Card key={i} product={p} />
                            </div>
                            
                            )
                        )}
                   </div>
                   <hr/>
               {loadMoreButton()}
               </div>
               
           </div>
            
        </Layout>
    )
}

export default Shop;