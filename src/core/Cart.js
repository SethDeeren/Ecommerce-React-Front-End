import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Layout from './Layout';
import {getCart} from './cartHelpers';
import Card from './Card';
import Checkout from './Checkout';



const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    useEffect(() => {
        setItems(getCart())
    }, [run])

    const showItems = items => {
        return (
            <div>
                <h2>Your cart has {`${items.length}`} items </h2>
                <hr />
                {items.map((product, i) => (
                        <Card key={i}
                        product={product} 
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                        setRun={setRun}
                        run={run}
                        />
                    )
                )}
            </div>
        )
    }

    const noItemsMessage = () => (
        <h2>Your cart is empty. <br/> <Link to="/shop">continue shoping</Link></h2>
    )

    return (
        <Layout title="Shoping Cart" description="Manage your cart items add remove checkout or continue shoping" className="container-fluid">
            <div className="row">
                <div className="col-6">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </div>
                <div className="col-6">
                    <h2>Your Cart Summary</h2>
                    <hr />
                    <Checkout products={items} setRun={setRun} run={run}/>
                </div>
            </div>
            
        </Layout>
    )

}

export default Cart;