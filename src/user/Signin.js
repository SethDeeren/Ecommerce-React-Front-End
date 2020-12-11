import React, {useState} from 'react';
import { Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import {signin, authenticate, isAuthenticated} from '../auth';

const Signin = () => {
    
        const [values, setValues] = useState({
            email: '',
            password: '',
            error: '',
            loading: false,
            redirectToReferrer: false,
        })
        
        const { email, password,error, loading, redirectToReferrer} = values;
        const {user} = isAuthenticated();

        const handleChange = name => event => {
            // name could name, password, email depending on which input calls it
            setValues({...values, error: false, [name]: event.target.value})
        }
        
        
        
        const clickSubmit = (event) => {
            event.preventDefault();
            setValues({ ...values, error: false, loading: true });
            signin({email, password})
            .then(data => {
                if(data.error){
                    setValues({...values, error: data.error, loading: false})
                }else{
                    authenticate(
                        data,
                        () => setValues({
                            ...values,
                          redirectToReferrer: true
                        })
                        
                    )
                }
            })
        }
        // useing () instead of {} returns the whole function
        const showError = () => (

            (<div className="alert alert-danger" style={{display: error ? '': 'none'}}>
                {error}
            </div>)
        )

        const showLoading = () => (
            
            loading && (<div className="alert alert-info"><h2>loading...</h2></div>)
        )

        const redirectUser = () => {
            if(redirectToReferrer){
               if(user && user.role === 1){
                   return <Redirect to="/admin/dashboard" />
               
               } else {
                   return <Redirect to="/user/dashboard"/>
               }
            }
            if(isAuthenticated()){
                return <Redirect to="/" />
            }   
        }
    
        const signUpForm = () => (
            
            <form>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
                </div>
                <button onClick={clickSubmit}  className="btn btn-primary">Submit</button>
            </form>
        )

         return (
             
             <Layout title="Signin Page" description="Node React E-commerce Signup Page" className="container col-md-8 offset-md-2">
                 {showError()}
                 {showLoading()}
                {signUpForm()}
                {redirectUser()}
            </Layout>
        )
}

export default Signin;