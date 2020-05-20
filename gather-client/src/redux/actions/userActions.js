import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED, LOADING_USER } from '../types';
import axios from 'axios';

// Login handling
export const loginUser = (userData, history) => (dispatch) => {

    // send LOADING_UI to the reducer
    dispatch({ type: LOADING_UI });
    axios
        .post('/login', userData)   // API registration request
        .then(res => {  // if we get a response...
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');   // push the state and URL of the home page ('/') for redirect
        })
        .catch(err => {
            dispatch({   
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};



export const logoutUser = () => (dispatch) => {
    // clear out the user state
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
};



// Registration handling
export const registerUser = (newUserData, history) => (dispatch) => {

    // send LOADING_UI to the reducer
    dispatch({ type: LOADING_UI });
    axios
        .post('/register', newUserData)   // API registration request
        .then(res => {  // if we get a response...
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS }); 
            history.push('/');   // push the state and URL of the home page ('/') for redirect
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};



export const getUserData = () => (dispatch) => {
    console.log("In getUserData");
    dispatch({ type: LOADING_USER });
    axios
        .get('/user')
        .then((res) => {
            dispatch({
                type: SET_USER,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
};



export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER })

    console.log(...formData);
    axios.post('/user/image', formData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.log("Error uploading image or getting user data\n" + err));
};


const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;   // Authorization Type: "Bearer [token]"
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
};