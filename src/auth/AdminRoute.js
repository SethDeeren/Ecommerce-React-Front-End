//const { Component } = require("react");
import React from 'react';
//const { Route, Redirect } = require("react-router-dom");
import {Route, Redirect} from 'react-router-dom';
//const { isAuthenticated } = require(".");
import {isAuthenticated} from './index';


const AdminRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => isAuthenticated() && isAuthenticated().user.role === 1 ? (
        <Component {...props} />
    ) : (
        <Redirect to={{pathname : "/signin", state : {from: props.location}}}/>
    )} />
)
 

export default AdminRoute;
