import React from 'react'
import { makeStyles, Avatar, withStyles, InputBase, Button } from '@material-ui/core';
import { red } from "@material-ui/core/colors";
import endpoints from '../../config/Endpoint';
import apiRequest from './../../config/apiRequest';
import CommentReplies from './CommentReplies';

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
    comments: {
        display: 'flex',
        marginTop: '5px'
    },
    commentReplies: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    avatar: {
        marginRight: '10px'
    },
    reply: {
        display: 'flex',
        justifyContent: 'end',
        cursor: 'pointer',
    },
    commentData: {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '10px',
        padding: '7px'
    },
    commentsContainer: {
        width: '100%',
    }
}))

const Comment = (props) => {
    const classes = useStyles()
    const [newComment, setNewComment] = React.useState('');
    const handleChange = (e) => {
        setNewComment(e.target.value)
    }
    const postCommentReply = () => {
        const params = {
            answer: newComment,
            replay: props.comment.id
        }
        apiRequest('post', endpoints.dashboard.student.replyToAnswer, params)
            .then((res) => {
                console.log(res);
                setNewComment('');
                props.setShouldRerender(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const [showCommentReply, setShowCommentReply] = React.useState(false);
    const toggleReply = () => {
        setShowCommentReply(!showCommentReply)
    }
    return <div className={classes.comments}>
        <Avatar sx={{ bgcolor: red[500] }} className={classes.avatar}>
            RD
        </Avatar>
        <div className={classes.commentsContainer}>
            <div className={classes.commentData}>
                <h4>{`${props.comment.first_name} ${props.comment.last_name}`}</h4>
                <p>{props.comment.answer}</p>
                <h5 className={classes.reply} onClick={toggleReply}>Reply</h5>
            </div>
            {showCommentReply &&
                <div>
                    <StyledInput
                        placeholder="POST A REPLY"
                        value={newComment}
                        onChange={handleChange}
                        fullWidth
                    />
                    <StyledButton
                        color="primary"
                        variant="contained"
                        onClick={postCommentReply}
                    >
                        Post
                    </StyledButton>
                </div>}
            <div className={classes.commentReplies}>
                {/* {(props.comment.replay_count > 0 || reloadChild) && <CommentReplies id={props.comment.id} reloadChild={reloadChild} setReloadChild={setReloadChild} />} */}
                {props.comment.replay_count > 0 && <CommentReplies replayCount={props.comment.replay_count} id={props.comment.id} />}
            </div>
        </div>
    </div>
}

export default Comment;