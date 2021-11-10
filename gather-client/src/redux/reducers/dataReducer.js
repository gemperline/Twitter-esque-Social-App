import { SET_POSTS, LIKE_POST, UNLIKE_POST, LOADING_DATA } from '../types';

const initialState = {
    posts: [],
    post: {},
    loading: false
};

export default function(state = initialState, action){
    let index;
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true 
            };
        case SET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            };
        case LIKE_POST:
            console.log("Like");
            console.log("LikeDoc: " + action.payload.likeDoc);
            index = state.posts.findIndex((post) => post.postID === action.payload.likeDoc);
            console.log("Post ID: " + state.posts[index].postID);
            state.posts[index] = action.payload;
            return {
                ...state
            };
        case UNLIKE_POST:
            console.log("Unlike");
            console.log("LikeDoc: " + action.payload.likeDoc);
            index = state.posts.findIndex((post) => post.postID === action.payload.likeDoc);
            console.log("Post ID: " + state.posts[index].postID);
            state.posts[index] = action.payload;
            return {
                ...state
            };
        default:
            return state;
    }
};