import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Layout from '../core/Layout';
import {signup} from '../auth';

const Signup = () => {
    
        const [values, setValues] = useState({
            name: '',
            email: '',
            password: '',
            error: '',
            success: false
        })
        
        const {name, email, password,error, success} = values;
        
        const handleChange = name => event => {
            // name could name, password, email depending on which input calls it
            setValues({...values, error: false, [name]: event.target.value})
        }
        
        
        
        const clickSubmit = (event) => {
            event.preventDefault();
            setValues({ ...values, error: false });
            signup({name, email, password})
            .then(data => {
                if(data.error){
                    setValues({...values, error: data.error, success: false})
                }else{
                    setValues({
                        ...values,
                        name: '',
                        email: '',
                        password: '',
                        error: '',
                        success: true
                    })
                }
            })
        }
        // useing () instead of {} returns the whole function
        const showError = () => (

            (<div className="alert alert-danger" style={{display: error ? '': 'none'}}>
                {error}
            </div>)
        )

        const showSuccess = () => (
            
            <div className="alert alert-info" style={{display: success ? '': 'none'}}>
                New account is created please <Link to="/signin">Signin</Link>.
            </div>
        )
    
        const signUpForm = () => (
            
            <form>
            
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
                </div>
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
             
             <Layout title="Signup Page" description="Node React E-commerce Signup Page" className="container col-md-8 offset-md-2">
                 {showError()}
                 {showSuccess()}
                {signUpForm()}
               
            </Layout>
        )
}

export default Signup;