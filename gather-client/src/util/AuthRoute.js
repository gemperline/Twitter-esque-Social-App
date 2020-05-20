import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route 
        {...rest}
        render={(props) =>  // take props and check authenticated value
            authenticated === true ? <Redirect to="/" /> : <Component {...props} />  // if true, redirect to home page, else spread the props
    }   
    />
);

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});

AuthRoute.propTypes = {
    user: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(AuthRoute);