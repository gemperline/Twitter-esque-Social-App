import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MuiButton from '../util/MuiButton';
import '../App.css';

// Material UI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

// Icons
import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';
import AddCommentIcon from '@material-ui/icons/AddComment';
import MapIcon from '@material-ui/icons/Map';

export class Navbar extends Component {
    render() {
        const { authenticated } = this.props
        return (
            <AppBar>
                <Toolbar className="nav-container">
                {authenticated ? (
                    // if authenticated, show these navbar buttons
                    <Fragment>
                        <MuiButton tip="New Post">
                            <AddCommentIcon/>
                        </MuiButton>

                        <Link to="/">
                            <MuiButton tip="Home">
                                <HomeIcon id="HomeIcon"/>
                            </MuiButton>

                            <MuiButton tip="Notifications">
                                <Notifications/>
                            </MuiButton>
                        </Link>
                        <MuiButton tip="Map View">
                            <MapIcon id="MapIcon"/>
                        </MuiButton>
                    </Fragment>
                ) : (
                    // if not authenticated, show these buttons
                    <Fragment>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </Fragment>
                )}
                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProp = state => ({
    authenticated: state.user.authenticated
})


export default connect(mapStateToProp)(Navbar);
