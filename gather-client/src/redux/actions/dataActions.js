// import { SET_POSTS, LOADING_DATA, LIKE_POST, UNLIKE_POST } from '../types';
// import axios from 'axios';


// // Get all posts
// export const getPosts = () => dispatch => {
//     dispatch({ type: LOADING_DATA });
//     axios.get('/posts')
//         .then((res) => {
//             dispatch({
//                 type: SET_POSTS,
//                 payload: res.data
//             })
//         })
//         .catch(err => {
//             dispatch({
//                 type: SET_POSTS,
//                 payload: []
//             })
//             console.log(err);
//         })
// };


// // Like a post
// export const likePost = (postID) => (dispatch) => {
//     axios.get(`/post/${postID}/like`)
//         .then((res) => {
//             dispatch({
//                 type: LIKE_POST,
//                 payload: res.data
//             });
//             console.log(res.data);
//         })
//         .catch(err => console.log(err));
// };

// // Unike a post
// export const unlikePost = (postID) => (dispatch) => {
//     axios.get(`/post/${postID}/unlike`)
//         .then((res) => {
//             dispatch({
//                 type: UNLIKE_POST,
//                 payload: res.data
//             });
//             console.log(res.data);
//         })
//         .catch(err => console.log(err));
// };



import {
  SET_POSTS,
  LOADING_DATA,
  LIKE_POST,
  UNLIKE_POST,
  DELETE_POST,
  SET_ERRORS,
  CREATE_POST,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_POST,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from '../types';
import axios from 'axios';

// Get all posts
export const getPosts = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get('/posts')
        .then((res) => {
            dispatch({
                type: SET_POSTS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_POSTS,
                payload: []
            })
            console.log(err);
        })
};
export const getPost = (postID) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/post/${postID}`)
    .then((res) => {
      dispatch({
        type: SET_POST,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};
// Post a post
export const createPost = (newPost) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/post', newPost)
    .then((res) => {
      dispatch({
        type:CREATE_POST,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
// Like a post
export const likePost = (postID) => (dispatch) => {
  axios
    .get(`/post/${postID}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_POST,
        payload: res.data
      })
    })
    .catch(err => console.log(err));
};
// Unlike a post
export const unlikePost = (postID) => (dispatch) => {
  axios
    .get(`/post/${postID}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_POST,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};
// Submit a comment
export const submitComment = (postID, commentData) => (dispatch) => {
  axios
    .post(`/post/${postID}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
export const deletePost = (postID) => (dispatch) => {
  axios
    .delete(`/post/${postID}`)
    .then(() => {
      dispatch({ type: DELETE_POST, payload: postID });
    })
    .catch((err) => console.log(err));
};

export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({
        type: SET_POSTS,
        payload: res.data.posts
      });
    })
    .catch(() => {
      dispatch({
        type: SET_POSTS,
        payload: null
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};