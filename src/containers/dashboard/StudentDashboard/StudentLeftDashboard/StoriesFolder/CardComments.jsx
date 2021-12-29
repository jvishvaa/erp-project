import React, { useEffect } from 'react';
import endpoints from '../../config/Endpoint';
import apiRequest from './../../config/apiRequest';
import { withStyles, InputBase, Button, makeStyles } from '@material-ui/core';
import Comment from './Comment';

const StyledInput = withStyles({
    root: {
        height: '45px',
        width: '100%',
        padding: '5px 20px',
        border: '1px solid #349CEB',
        borderRadius: '10px',
        //marginBottom: '10px',
        marginTop: '5px',
    },
})(InputBase);

const StyledButton = withStyles((theme) => ({
    root: {
        color: '#FFFFFF',
        height: '42px',
        borderRadius: '10px',
        marginTop: '10px',
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        },
        '@media (min-width: 600px)': {
            marginTop: '0px!important',
        }
    },
    startIcon: {
        fill: '#FFFFFF',
        stroke: '#FFFFFF',
    },
}))(Button);

const useStyles = makeStyles((theme) => ({
    containComments: {
        height: '300px',
        overflow: 'auto'
    }
}))

const CardComments = (props) => {
    const classes = useStyles()
    const [comments, setComments] = React.useState([]);
    const [newComment, setNewComment] = React.useState([]);
    const handleChange = (e) => {
        setNewComment(e.target.value);
    };
    const [shouldReRender, setShouldRerender] = React.useState(false);
    const postComment = () => {
        const params = {
            answer: newComment,
            post: props.postId
        }
        apiRequest('post', endpoints.dashboard.student.replyToAnswer, params)
            .then((res) => {
                console.log(res);
                setNewComment('');
                props.setCommentCount(props.commentCount + 1)
                setShouldRerender(true);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    useEffect(() => {
        apiRequest(
            'get',
            `${endpoints.dashboard.student.commentData}?post=${props.postId}&type=2`
        )
            .then((result) => {
                console.log('Data Recieved: ', result.data.result.results);
                if (result.data.status_code === 200) {
                    setComments(result?.data?.result?.results);
                    // setAlert('success', result.data.message)
                }
            })
            .catch((error) => {
                console.log('error');
                // setAlert('error', 'Failed to mark attendance');
            });
    }, []);
    useEffect(() => {
        if (shouldReRender) {
            apiRequest(
                'get',
                `${endpoints.dashboard.student.commentData}?post=${props.postId}&type=2`
            )
                .then((result) => {
                    console.log('Data Recieved: ', result.data.result.results);
                    if (result.data.status_code === 200) {
                        console.log("Data from API", result?.data?.result?.results)
                        setComments(result?.data?.result?.results);
                        // setAlert('success', result.data.message)
                    }
                    setShouldRerender(false)
                })
                .catch((error) => {
                    console.log('error');
                    // setAlert('error', 'Failed to mark attendance');
                });
        }
    }, [shouldReRender]);
    return (
        <>
            {/* <h3>{props.postId}</h3> */}
            <div className={classes.containComments}>
                {comments.length > 0 ? (
                    comments.map((comment, index) => <Comment key={index} comment={comment} setShouldRerender={setShouldRerender} />)
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
            <div>
                <StyledInput
                    placeholder='POST A COMMENT'
                    value={newComment}
                    onChange={handleChange}
                    fullWidth
                />
                <StyledButton color='primary' variant='contained' onClick={postComment}>
                    Post
                </StyledButton>
            </div>
        </>
    );
};

export default CardComments;