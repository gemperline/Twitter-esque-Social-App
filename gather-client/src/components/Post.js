import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MuiButton from '../util/MuiButton';

// Material UI imports
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Icons
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

// Redux
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../redux/actions/dataActions';

const styles = {
    card: {
      position: 'relative',
      display: 'flex',
      marginBottom: 20
    },
    image: {
      minWidth: 200
    },
    content: {
      padding: 25,
      objectFit: 'cover'
    }
  };


// A post's content
class Post extends Component {

    // check if the user has already liked the post
    likedPost = () => {
        if(this.props.user.likes && this.props.user.likes.find((like) => like.postID === this.props.post.postID))
        {
            console.log("Post liked? true");
            return true;
        }
        else
        {
            console.log("Post liked? false");
            return false;
        }
    };
    likePost = () => {
        this.props.likePost(this.props.post.postID);
    };
    unlikePost = () => {
        this.props.unlikePost(this.props.post.postID);
    };

    render() {
        // pass the relative time to display the dayjs fromNow() functionality below
        dayjs.extend(relativeTime);

        const { classes, 
                post: { body, createdAt, userImage, username, postID, likeCount, commentCount },
                user: { authenticated } 
        } = this.props;

        const likeButton = !authenticated ? (
            <MuiButton tip="Like">
                <Link to="/login">
                    <FavoriteBorder color="primary"/>
                </Link>
            </MuiButton>
        ) :  
            this.likedPost() ? (
            <MuiButton tip="Unlike" onClick={this.unlikePost}>
                <FavoriteIcon color="primary"/>
            </MuiButton>
        ) : (
            <MuiButton tip="Like" onClick={this.likePost}>
                <FavoriteBorder color="primary"/>
            </MuiButton>
        );

        return (
            <Card className={classes.card}>
                <CardMedia image={userImage} title="Profile Image" className={classes.image} />
                <CardContent className={classes.content}>
                    
                    <Typography variant="h5" component={Link} to={`/users/${username}`} color='primary'>
                            {username} 
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary">  
                        {dayjs(createdAt).fromNow()}    
                    </Typography>   

                    <Typography variant="body1">{body}</Typography>
                    {likeButton}
                    <span>{likeCount} Likes</span>
                    <MuiButton tip="Comments">
                        <ChatIcon color="primary"/>
                    </MuiButton>
                    <span>{commentCount} Comments</span>
                </CardContent>
            </Card>
        )
    }
};

Post.propTypes = {
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    likePost,
    unlikePost
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Post));
