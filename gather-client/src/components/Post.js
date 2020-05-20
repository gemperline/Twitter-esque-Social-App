import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Material UI imports
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};


// A post's content
class Post extends Component {
    render() {

        // pass the relative time to display the dayjs fromNow() functionality below
        dayjs.extend(relativeTime);

        const { classes, post : { body, createdAt, userImage, username, postID, likeCount, commentCount } } = this.props;
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

                </CardContent>
            </Card>
        )
    }
};

export default withStyles(styles)(Post);
