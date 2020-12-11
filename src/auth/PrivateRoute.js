const { Component } = require("react");
const { Route, Redirect } = require("react-router-dom");
const { isAuthenticated } = require(".");


const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => isAuthenticated() ? (
        <Component {...props} />
    ) : (
        <Redirect to={{pathname : "/signin", state : {from: props.location}}}/>
    )} />
)

export default PrivateRoute;
