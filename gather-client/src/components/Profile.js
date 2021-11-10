// import React, { Component, Fragment } from 'react'
// import PropTypes from 'prop-types';
// import withStyles from '@material-ui/core/styles/withStyles';
// import { Link } from 'react-router-dom';
// import dayjs from 'dayjs';

// // MUI imports
// import Button from '@material-ui/core/Button';
// import MuiLink from '@material-ui/core/Link';
// import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
// import IconButton from '@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';

// // Icons
// import LocationOn from '@material-ui/icons/LocationOn';
// import LinkIcon from '@material-ui/icons/Link';
// import CalendarToday from '@material-ui/icons/CalendarToday';
// import EditIcon from '@material-ui/icons/Edit'; 

// // Redux imports
// import { connect } from 'react-redux';
// import { logoutUser, uploadImage } from '../redux/actions/userActions';


// // Profile card styling
// const styles = (theme) => ({
//     paper: {
//         padding: 20
//       },
//       profile: {
//         '& .image-wrapper': {
//           textAlign: 'center',
//           position: 'relative',
//           '& button': {
//             position: 'absolute',
//             top: '80%',
//             left: '70%'
//           }
//         },
//         '& .profile-image': {
//           width: 200,
//           height: 200,
//           objectFit: 'cover',
//           maxWidth: '100%',
//           borderRadius: '50%'
//         },
//         '& .profile-details': {
//           textAlign: 'center',
//           '& span, svg': {
//             verticalAlign: 'middle'
//           },
//           '& a': {
//             color: '#00bcd4'
//           }
//         },
//         '& hr': {
//           border: 'none',
//           margin: '0 0 10px 0'
//         },
//         '& svg.button': {
//           '&:hover': {
//             cursor: 'pointer'
//           }
//         }
//       },
//       buttons: {
//         textAlign: 'center',
//         '& a': {
//           margin: '20px 10px'
//         }
//       }
// });  

// class Profile extends Component {
//     handleImageChange = (event) => {
//         const image = event.target.files[0];    // 'files' is an array so limit upload to 1 by using the first element
//         const formData = new FormData();
//         formData.append('image', image, image.name);
//         this.props.uploadImage(formData);
//     };
//     handleEditPicture = () => {
//         // function for our custom 'Edit Picture' button to click the hidden imageInput button
//         const fileInput = document.getElementById('imageInput');
//         fileInput.click();
//     };

//     render() {
//         const { classes, user: { 
//             credentials: { handle, createdAt, imageUrl, bio, website, location }, 
//             loading,
//             authenticated
//         }
//     } = this.props;

//     // this is the beginning of a large ternary comparison for rendering the Profile paper/card
//     let profileMarkup = !loading ? (authenticated ? (
        
//         // if not loading and user is authenticated, show profile details
//         <Paper className={classes.paper}>
//             <div className={classes.profile}>
//                 <div className="image-wrapper">
//                     <img src={imageUrl} alt="profile" className="profile-image" />
//                     <input type="file" id="imageInput" hidden="hidden" onChange={this.handleImageChange} />
//                     <Tooltip title="Edit picture" placement="top">
//                         <IconButton onClick={this.handleEditPicture} className="button">
//                             <EditIcon color="primary"/>
//                         </IconButton>
//                     </Tooltip>
//                 </div>
//                 <hr />
//                 <div className="profile-details">
//                     <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
//                         @{handle}
//                     </MuiLink>
//                     <hr/>
//                     {bio && <Typography variant="body2">{bio}</Typography>}
//                     <hr/> 
//                     {location && (
//                         <Fragment>
//                             <LocationOn color="primary"/> <span>{location}</span>
//                             <hr/> 
//                         </Fragment>
//                     )}
//                     {website && (
//                         <Fragment>
//                             <LinkIcon color="primary" />
//                             <a href={website} target="_blank" rel="noopener noreferrer">
//                                 {' '}{website}
//                             </a>
//                             <hr/> 
//                         </Fragment>
//                     )}
//                     <CalendarToday color="primary"/>{' '}
//                     <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
//                 </div>
//             </div>
//         </Paper>
//     ) : (
//         // if not loading and user is NOT authenticated, show Login and Register buttons on profile paper
//         <Paper className={classes.paper}>
//             <Typography variant="body2" align="center">
//                 No profile found, please try logging in again</Typography>
//                 <div className={classes.buttons}>
//                     <Button variant="contained" color="primary" component={Link} to="/login">
//                         Login
//                     </Button>
//                     <Button variant="contained" color="secondary" component={Link} to="/register">
//                         Register
//                     </Button>
//                 </div>
//         </Paper>
//     )) : (<p>loading...</p>)   // else, display "loading..."
//         return profileMarkup;
//     }
// }

// const mapStateToProps = (state) => ({
//     user: state.user
// });

// const mapActionsToProps = { logoutUser, uploadImage };

// Profile.propTypes = {
//     logoutUser: PropTypes.func.isRequired,
//     uploadImage: PropTypes.func.isRequired,
//     user: PropTypes.object.isRequired,
//     classes: PropTypes.object.isRequired
// }

// export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile))


import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';

// MUI imports
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MuiButton from '../util/MuiButton';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit'; 
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

// Redux imports
import { connect } from 'react-redux';
import { logoutUser, uploadImage } from '../redux/actions/userActions';


// Profile card styling
const styles = (theme) => ({
    paper: {
        padding: 20
      },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
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
        },
        '& svg.button': {
            '&:hover': {
            cursor: 'pointer'
            }
        }
        },
        buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    }
});  

class Profile extends Component {

    // Profile handlers
    handleImageChange = (event) => {
        const image = event.target.files[0];    // 'files' is an array so limit upload to 1 by using the first element
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    };
    handleEditPicture = () => {
        // function for our custom 'Edit Picture' button to click the hidden imageInput button
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };
    handleLogout = () => {
        this.props.logoutUser();
    }

    render() {
        const { 
            classes, 
            user: { 
                credentials: { handle, createdAt, imageUrl, bio, website, location }, 
                loading,
                authenticated
             }
        } = this.props;

        // this is the beginning of a large ternary comparison for rendering the Profile paper/card
        let profileMarkup = !loading ? (authenticated ? (
            
            // if not loading and user is authenticated, show profile details
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="profile" className="profile-image" />
                        <input type="file" id="imageInput" hidden="hidden" onChange={this.handleImageChange} />

                        <MuiButton tip="Edit picture" onClick={this.handleEditPicture} btnClassName="button">
                            <EditIcon color="primary"/>
                        </MuiButton>

                    </div>
                    <hr />
                    <div className="profile-details">
                        <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
                            @{handle}
                        </MuiLink>
                        <hr/>
                        {bio && <Typography variant="body2">{bio}</Typography>}
                        <hr/> 
                        {location && (
                            <Fragment>
                                <LocationOn color="primary"/> <span>{location}</span>
                                <hr/> 
                            </Fragment>
                        )}
                        {website && (
                            <Fragment>
                                <LinkIcon color="primary" />
                                <a href={website} target="_blank" rel="noopener noreferrer">
                                    {' '}{website}
                                </a>
                                <hr/> 
                            </Fragment>
                        )}
                        <CalendarToday color="primary"/>{' '}
                        <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    </div>
                    <MuiButton tip="Logout" onClick={this.handleLogout}>
                        <KeyboardReturn color="primary"/>
                    </MuiButton>
                    <EditDetails/>
                </div>
            </Paper>
        ) : (
            // if not loading and user is NOT authenticated, show Login and Register buttons on profile paper
            <Paper className={classes.paper}>
                <Typography variant="body2" align="center">
                    No profile found, please try logging in again</Typography>
                    <div className={classes.buttons}>
                        <Button variant="contained" color="primary" component={Link} to="/login">
                            Login
                        </Button>
                        <Button variant="contained" color="secondary" component={Link} to="/register">
                            Register
                        </Button>
                    </div>
            </Paper>
        )) : (<p>Loading...</p>)   // else, display "loading..."
        
        return profileMarkup;
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile))
