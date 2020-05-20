import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import appIcon from '../images/g-icon.svg';
import { Link } from 'react-router-dom';    // react app domain routes
//import Url from '@material-ui/core/Link';  // link styles

// MUI imports
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux imports
import { connect } from 'react-redux';
import { registerUser } from '../redux/actions/userActions';

const styles = {
    form: {
        textAlign: 'center'
    },
    image: {
        margin: '20px auto 20px auto',
        maxWidth: 100,
        maxHeight: 100
    },
    pageTitle: {
        margin: '10px auto 10px auto',
    },
    textField: {
        margin: '10px auto 10px auto',
    },
    button: {
        marginTop: 30,
        width: 300,
        marginBottom: 20,
        position: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    smallText: {
        paddingTop: 200,
        fontSize: '0.8rem',
        marginTop: 20,
    },
    linkAtts: {
        fontWeight: 'bold'
    },
    progressSpinner: {
        position: 'absolute'
    }
};



class register extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            errors: {}
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors)
            this.setState({ errors: nextProps.UI.errors });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true 
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        };
        this.props.registerUser(newUserData, this.props.history);
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {

        // destructuring 
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        //var regButtonContent = "Register";

        return (
            <Grid container className={classes.form}>
                <Grid item sm />
                <Grid item sm>
                    <img src={appIcon} alt="g-icon" className={classes.image} />
                    <Typography variant="h2" className={classes.pageTitle}>
                        Register
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>

                        <TextField              // Email
                            id = "email" 
                            name="email" 
                            type="email" 
                            label="Email" 
                            className={classes.textField}
                            helperText={errors.email}
                            error={errors.email ?  true : false} // ternary comparison to check if error(s) exists 
                            value={this.state.email} 
                            onChange={this.handleChange} 
                            fullWidth 
                        />
                        
                        <TextField              // Password 
                            id = "password" 
                            name="password"
                            type="password"
                            label="Password" 
                            className={classes.textField}
                            helperText={errors.password}
                            error={errors.password ?  true : false} // ternary comparison to check if error(s) exists 
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth 
                        />

                        <TextField              // Confirm Password 
                            id = "confirmPassword" 
                            name="confirmPassword"
                            type="password"
                            label="Confirm Password" 
                            className={classes.textField}
                            helperText={errors.confirmPassword}
                            error={errors.confirmPassword ?  true : false} // ternary comparison to check if error(s) exists 
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                            fullWidth 
                        />

                        <TextField              // Password 
                            id = "handle" 
                            name="handle"
                            type="text"
                            label="Handle" 
                            className={classes.textField}
                            helperText={errors.handle}
                            error={errors.handle ?  true : false} // ternary comparison to check if error(s) exists 
                            value={this.state.handle}
                            onChange={this.handleChange}
                            fullWidth 
                        />
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}                     
                        <Button type="submit" variant="contained" color="secondary" className={classes.button} disabled={loading}>
                            REGISTER
                            {loading && (
                                <CircularProgress size={20} className={classes.progressSpinner} />
                            )}
                        </Button>
                        <br />
                        <small className={classes.smallText}>Already have an account?&nbsp;
                            <Link to="/login" variant="body2" className={classes.linkAtts}>Login here</Link>
                        </small>
                    </form>
                </Grid>
                <Grid item sm />
            </Grid>
        );
    }
};

register.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    registerUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

export default connect(mapStateToProps, { registerUser })(withStyles(styles)(register));

