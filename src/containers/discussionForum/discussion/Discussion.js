import React from 'react';
import { Grid, Box, Typography, makeStyles, Button, withStyles, InputBase} from '@material-ui/core';
import DiscussionReplies from './DiscussionReplies';
//import PostReplies from './comments/PostReplies';
import LikeIcon from '../../../components/icon/LikeIcon';
import ChatIcon from '../../../components/icon/ChatIcon';
import StarAwardIcon from '../../../components/icon/StarAwardIcon';
import AttachmentIcon from '../../../components/icon/AttachmentIcon';
import ProfileIcon from '../../../components/icon/ProfileIcon';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import MoreVertIcon from '@material-ui/icons/MoreVert';
//import { MyButton } from './StyledButton';

const useStyles = makeStyles({
    discussionContainer: {
        marginTop: '10px',
        marginBottom: '20px',
        border: '1px solid #CECECE',
        borderRadius: '10px',
    },
    discussionTitleBox: {
        backgroundColor: '#EFFFB2',
        padding: '13px 20px',
        borderRadius: '10px 10px 0px 0px',
    },
    discussionCategoryTitle: {
        color: '#042955',
        fontSize: '20px',
        fontFamily: 'Open Sans',
        lineHeight: '27px',
    },
    discussionDetailsBox: {
        padding: '7px 22px 19px',
    },
    discussionTitle: {
        color: '#042955',
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: 'Open Sans',
        lineHeight: '33px',
        marginRight: '8.5px',
    },
    dotSeparator: {
        height: '12px',
        width: '12px',
        fill: '#FF6B6B',
        marginRight: '10px',
    },
    postByText: {
        color: '#042955',
        fontSize: '18px',
        fontWeight: 'lighter',
        fontFamily: 'Open Sans',
    },
    username: {
        color: '#042955',
        fontSize: '20px',
        fontFamily: 'Open Sans',
        lineHeight: '27px',
    },
    discussionTime: {
        marginLeft: '6px',
        color: '#042955',
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'Open Sans',
        lineHeight: '27px',
    },
    discussionIconRow: {
        float: 'right',
    },
    discussionIcon: {
        color: '#042955',
        fontSize: '20px',
        fontWeight: 300,
        fontFamily: 'Open Sans',
        marginLeft: '8px',
        marginRight: '20px',
        verticalAlign: 'super',
    },
    discussionDotIcon: {
        fill: '#FF6B6B',
    },
    discussionParagraph: {
        color: '#042955',
        fontSize: '18px',
        fontFamily: 'Open Sans',
        lineHeight: '24px',
        height: '48px',
        overflow: 'hidden',
    },
    answersText: {
        color: '#042955',
        fontSize: '16px',
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        lineHeight: '22px',
        marginTop: '9px',
    },
    commentReplyBox: {
        borderLeft: '1px solid #FE6B6B',
    },
})

const StyledOutlinedButton = withStyles({
    root: {
        height: '45px',
        width: '120px',
        color: '#FE6B6B',
        border: '1px solid #FF6B6B',
        borderRadius: '10px',
    },
})(Button);

const StyledButton = withStyles({
    root: {
        height: '45px',
        width: '120px',
        backgroundColor: '#FE6B6B',
        color: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 0 0 0',
    },
})(Button);

const StyledInput = withStyles({
    root: {
        height: '45px',
        width: '100%',
        padding: '5px 20px',
        border: '1px solid #DBDBDB',
        borderRadius: '10px',
        marginBottom: '10px',
    },
})(InputBase);

export default function DiscussionComponent(props) {
    const classes = useStyles({});

    const [ reply, setReply ] = React.useState('');
    const handleChange = (e) => {
        setReply(e.target.value);
    }
    const handleReply = () => {
        alert(reply);
        setReply('');
    }
    const handlePost = () => {
        console.log('Post');
    }

    return (
        <Grid container className={classes.discussionContainer}>
            <Grid item xs={12}>
                <div className={classes.discussionTitleBox}>
                    <span className={classes.discussionTitle}>
                        {props.rowData && props.rowData.category} /
                    </span>
                    <span className={classes.discussionTitle}>
                        {props.rowData && props.rowData.sub_category} / 
                    </span>
                    <span className={classes.discussionTitle}>
                        {props.rowData && props.rowData.sub_sub_category}
                    </span>
                    <span>
                        <FiberManualRecordIcon className={classes.dotSeparator}/>
                        <span className={classes.postByText}>post by</span>
                        <ProfileIcon
                            firstname={props.rowData.firstname}
                            lastname={props.rowData.lastname}
                            bgColor='#14B800'
                        />
                        <span className={classes.username}>{props.rowData.firstname+' '+props.rowData.lastname} /</span>
                        <span className={classes.discussionTime}>{props.rowData.time} /</span>
                        <span className={classes.discussionTime}>{props.rowData.date}</span>
                    </span>
                    

                    <span className={classes.discussionIconRow}>
                        <span>
                            <LikeIcon/>
                            <span className={classes.discussionIcon}>
                                {props.rowData.likes}
                            </span>
                        </span>
                        <span>
                            <ChatIcon/>
                            <span className={classes.discussionIcon}>
                                {props.rowData.ans}
                            </span>
                        </span>
                        <span>
                            <StarAwardIcon/>
                            <span className={classes.discussionIcon}>
                                {props.rowData.awards}
                            </span>
                        </span>
                        {props.rowData.attachments !== undefined && props.rowData.attachments !== 0 && (
                            <span>
                                <AttachmentIcon/>
                                <span className={classes.discussionIcon}>
                                    {props.rowData.attachments}
                                </span>
                            </span>
                        )}
                        <MoreVertIcon className={classes.discussionDotIcon}/>
                    </span>
                </div>
                <Box className={classes.discussionDetailsBox}>
                    <Typography className={classes.discussionTitle}>
                        {props.rowData.title}
                    </Typography>
                    <Typography className={classes.discussionParagraph}>
                        {props.rowData.paragraph}    
                    </Typography>
                    
                    <Typography className={classes.answersText}>
                        Top answers
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={10}>
                            {props.rowData.replies !== undefined && props.rowData.replies !== null && (
                                <Box className={classes.commentReplyBox}>
                                    { props.rowData.replies.slice(0,2).map((commentRow, id) => (
                                        <DiscussionReplies commentRow={commentRow}/>
                                    ))}
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={2}>
                            <StyledButton
                                color="secondary"
                                variant="contained"
                                onClick={handlePost}
                            >
                                Read post
                            </StyledButton>
                        </Grid>
                        <Grid item xs={10}>
                            <StyledInput
                                placeholder="Have your say"
                                value={reply}
                                onChange={handleChange}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <StyledOutlinedButton
                                onClick={handleReply}
                            >
                                Reply
                            </StyledOutlinedButton>
                        </Grid>
                    </Grid>
                    {/*
                        <Box>
                            <StyledInput
                                placeholder="Have your say"
                                value=''
                                fullWidth={true}
                            />
                            
                        </Box>
                    */}
                    
                </Box>
            </Grid>
        </Grid>
    )
}

export const Discussion = React.memo(DiscussionComponent);