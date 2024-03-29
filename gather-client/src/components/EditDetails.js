import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiButton from '../util/MuiButton';

// Redux imports
import { connect } from 'react-redux';
import { editUserDetails } from '../redux/actions/userActions'; 

// Material UI imports 
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Icon imports
import EditIcon from '@material-ui/icons/Edit';

// Profile card styling
const styles = (theme) => ({
    paper: {
        padding: 20
      },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            },
            '& a': {
                color: theme.palette.primary.main
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        }
        },
        buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    }, 
    button: {
        float: 'right',
        padding: 12
    }
});  

class EditDetails extends Component {
    // details of dialog box for editing profile info
    state = {
        bio: '',
        website: '',
        location: '',
        open: false        // the dialog is closed by default
    };
    mapUserDetailsToState = (credentials) => {
        this.setState({ 
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : ''
        });
    };
    handleOpen = () => {
        this.setState({ open: true });
        this.mapUserDetailsToState(this.props.credentials);
    };
    handleClose = () => {
        this.setState({ open: false });
    };
    componentDidMount() {
        const { credentials } = this.props;
        this.mapUserDetailsToState(credentials);
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    };

    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <MuiButton tip="Edit Details" onClick={this.handleOpen} btnClassName={classes.button}>
                    <EditIcon color="primary"/>
                </MuiButton>
                <Dialog
                open={this.state.open}
                onClose={this.handleCLose}
                fullWidth
                maxWidth="sm">
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                            name="bio"
                            type="text"
                            label="Bio"
                            multiline
                            rows="3"
                            placeolder="A short bio about yourself"
                            className={classes.textfield}
                            value={this.state.bio}
                            onChange={this.handleChange}
                            fullWidth
                            />                              
                            <TextField
                            name="website"
                            type="text"
                            label="Website"
                            placeholder="Your website"
                            className={classes.textfield}
                            value={this.state.website}
                            onChange={this.handleChange}
                            fullWidth
                            />   
                            <TextField
                            name="location"
                            type="text"
                            label="Location"
                            placeholder="Your location"
                            className={classes.textfield}
                            value={this.state.location}
                            onChange={this.handleChange}
                            fullWidth
                            />    
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            CANCEL
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            SAVE
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}



const mapStateToProps = (state) => ({
    credentials: state.user.credentials
}) 

export default connect(mapStateToProps, { editUserDetails })(withStyles(styles)(EditDetails));

