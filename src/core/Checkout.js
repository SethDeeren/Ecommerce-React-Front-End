import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {emptyCart} from './cartHelpers';
import {getBraintreeClientToken, processPayment, createOrder } from './apiCore';
import {isAuthenticated} from '../auth';
import DropIn from 'braintree-web-drop-in-react';




const Checkout = ({products, setRun = f => f, run = undefined}) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    })

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if(data.error){
                console.log("error getting token for braintree")
                setData({...data, error: data.error})
            } else {
                console.log("braintree token =============>>>>>>>>>>>>>>>", data.clientToken)
                setData({clientToken: data.clientToken})
            }
        })
    }

    useEffect(()=>{
        getToken(userId, token)
    },[])

    

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0)
    }

    const handleAdress = event => {
        setData({...data, address: event.target.value})
    }

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        )
    }

    let deliveryAddress = data.address;

    const buy = () => {
        setData({loading: true})
        // send nonce to your sever
        // nonce = data.instance.requestPaymentMethod()

        let nonce;
        //console.log("============>>>>>>>>>>>> ", data.instance)
        let getNonce = data.instance
        .requestPaymentMethod()
        .then(data => {
            console.log(data);
            nonce = data.nonce;
            // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
            // and also total to be charged
            //console.log('send nonce and total to process: ', nonce, getTotal(products)) 
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getTotal(products)
            }
            console.log("token is ", token)
            console.log("the payment data is ", paymentData)

            processPayment(userId, token, paymentData)
            .then(response => {
                console.log(response);

                // create order
                const createOrderData = {
                    products: products,
                    transaction_id: response.transaction.id,
                    amount: response.transaction.amount,
                    address: deliveryAddress
                }

                createOrder(userId, token, createOrderData);



                setData({...data, success: response.success});
                // empty cart
                emptyCart(() => {
                    setRun(!run);
                    console.log('payment success and empty cart')
                    setData({
                        loading: false,
                        success: true
                    
                    })
                })
                
            })
            .catch(error => {
                console.log(error); 
                setData({loading: false})
            })

        })
        .catch(error => {
           // console.log("drop in error: ", error)
            setData({...data, error: error.message})
        })
    }

    const showLoading =(loading) => (
        loading && <h2>Loading...</h2>
    )

    const showError = error => (
        <div className="alert alert-danger" style={{display: error ? '': 'none'}}>
            {error}
        </div>
    )

    const showSuccess = success => (
        <div className="alert alert-info" style={{display: success ? '': 'none'}}>
            Your payment was successful. Thank you!
        </div>
    )

    const showDropIn = () => (
        <div onBlur={() => setData({...data, error: ''})}>
            {data.clientToken !== null && products.length > 0 ? (
             <div>
                <div className="gorm-group mb-3">
                    <label classNAme ="text-muted">Delivery address:</label>
                    <textarea
                        onChange={handleAdress}
                        className="form-control"
                        value={data.address}
                        placeholder="Type your deliver address here..."
                    />
                </div>
                <div>
                    <DropIn 
                        options={
                            {
                                authorization: data.clientToken,
                                paypal: {
                                    flow: 'vault'
                                }
                            }
                        } 
                        onInstance={instance => data.instance = instance} 
                        />
                    <button onClick={buy} className="btn btn-success btn-block">Submit Payment</button>
                </div>
             </div>
            ) : null}
        </div>
        
    )

    return <div>
            <h3>Total: ${getTotal()}</h3>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
}

export default Checkout;