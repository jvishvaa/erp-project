import React from 'react';
import { Grid, makeStyles, withStyles, Button, InputBase } from '@material-ui/core';
import LikeIcon from '../../../../components/icon/LikeIcon';
import ProfileIcon from '../../../../components/icon/ProfileIcon';
//import Avatar from '@material-ui/core/Avatar';
//import OutlinedButton from '../../core_themes/buttons/OutlinedButton';

const useStyles = makeStyles({
    replyCommentBox: {
        padding: '15px',
        borderLeft: '1px solid #FE6B6B',
    },
    replyByText: {
        color: '#042955',
        fontSize: '18px',
        fontWeight: 'lighter',
        fontFamily: 'Open Sans',
        lineHeight: '20px',
        marginTop: '10px',
        //marginLeft: '10px',
    },
    replyUsername: {
        color: '#042955',
        fontSize: '20px',
        fontFamily: 'Open Sans',
        fontWeight: 'normal',
        lineHeight: '27px',
    },
    replyCommentDiv: {
        marginLeft: '10px',
    },
    replyCommentSpan: {
        width: '90%',
        display: 'inline-block',
        marginLeft: '18px',
        borderBottom: '1px solid #CECECE',
    },
    replyComment: {
        fontSize: '18px',
        color: '#042955',
        fontFamily: 'Open Sans',
        fontWeight: 'normal',
        lineHeight: '24px',
        //marginLeft: '10px',
        overflow: 'hidden',
    },
    commentsCount: {
        color: '#042955',
        float: 'right',
        fontSize: '18px',
        fontWeight: 'bold',
        fontFamily: 'Open Sans',
        lineHeight: '24px',
    },
    commntLikes: {
        color: '#042955',
        fontSize: '25px',
        fontFamily: 'Open Sans',
        marginLeft: '8.47px',
    },
})

const StyledOutlinedButton = withStyles({
    root: {
        height: '45px',
        width: '120px',
        color: '#FE6B6B',
        border: '1px solid #FF6B6B',
        borderRadius: '10px',
        marginLeft: '20px',
        marginTop: '10px',
        //float: 'right',
    },
})(Button);

const StyledInput = withStyles({
    root: {
        height: '45px',
        width: '100%',
        padding: '12px 15px',
        border: '1px solid #DBDBDB',
        borderRadius: '10px',
        marginBottom: '20px',
        marginTop: '10px',
    },
})(InputBase);

export default function CommentsComponent(props) {
    const classes = useStyles({});
    //const commentRow = props.commentRow;

    const [ reply, setReply ] = React.useState('');
    const [ isReply, setIsReply ] = React.useState(false);
    const handleChange = (e) => {
        setReply(e.target.value);
    }
    const handleOnClick = () => {
        setIsReply(true);
    }

    return (
        <Grid container>
            <Grid item xs={12} className={classes.replyCommentBox}>
                <div>
                    <span className={classes.replyByText}>reply by</span>
                    <ProfileIcon
                        firstname={props.firstname}
                        lastname={props.lastname}
                        bgColor='#3E9CF7'
                    />
                    <span className={classes.replyUsername}>
                        {`${props.firstname} ${props.lastname}`}
                    </span>
                </div>
                
                <div className={classes.replyCommentDiv}>
                    <LikeIcon/>
                    <span className={classes.commntLikes}>{props.likes ? props.likes : 0}</span>
                    <div className={classes.replyCommentSpan}>
                        <span className={classes.replyComment}>
                            {props.commnet}
                        </span>
                        {!isReply && (
                            <span onClick={handleOnClick} className={classes.commentsCount}>
                                / reply to this user
                            </span>
                        )}
                    </div>
                </div>
            </Grid>
            {isReply && (
                <Grid item xs={10}>
                    <StyledInput
                        placeholder="Have your say"
                        value={reply}
                        onChange={handleChange}
                        fullWidth={true}
                    />
                </Grid>
            )}
            {isReply && (
                <Grid item xs={2}>
                    <StyledOutlinedButton>Reply</StyledOutlinedButton>
                </Grid>
            )}
        </Grid>
    )
}

export const Comments = React.memo(CommentsComponent);