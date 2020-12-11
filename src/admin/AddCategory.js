import React, {useState} from 'react';
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import {createCategory} from './apiAdmin';
import {Link} from 'react-router-dom';

const AddCategory = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    // destructure user and token from localstorage
    const {user, token} = isAuthenticated();

    const handleChange = (e) => {
        setError('');
        setName(e.target.value);

    }

    const clickSubmit = (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        // make request to api to create category
        createCategory(user._id, token, {name})
        .then(data => {
            if(data.error){
                setError(true);
            }else{
                setError('');
                setSuccess(true);
            }
        })


    }


    const newCategoryForm = () => {
        return (
            <form onSubmit={clickSubmit}>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input type='text' 
                    className="form-control" 
                    onChange={handleChange} 
                    autoFocus
                    required
                    />
                    
                </div>
                <button className="btn btn-outline-primary">
                        Create Category
                    </button>
            </form>
        )
    }

    const showSuccess = ()=> {
        if(success){
        return <h3 className="text-success">{name} category created</h3>
        }
    }

    const showError = () => {
        if(error) {
            return <h3 className="text-danger">failed to create category {name}. It may already exist</h3>
        }
    }

    const goBack = () => (
        <div className="mt-5">

            <Link to="/admin/dashboard" className="text-warning">
                back to Dashboard
            </Link>

        </div>
    )

    return (
        <Layout title='Add a new Category' description={`G'day ${user.name}, ready to add a new category`} className="container">

           <div className="row">
             
               <div className="col-8 offset-md-2">
                   {showSuccess()}
                   {showError()}
                   {newCategoryForm()}
                   {goBack()}
                   
               </div>
           </div>
        </Layout>
    )

}

export default AddCategory;