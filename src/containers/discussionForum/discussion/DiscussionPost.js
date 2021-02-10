import React from 'react';
import { Paper, Divider } from '@material-ui/core';
import { Grid, Box, Typography, makeStyles, Button, withStyles, InputBase, Tooltip} from '@material-ui/core';
import PostComments from './comments/PostComments';
import LikeIcon from '../../../components/icon/LikeIcon';
import ChatIcon from '../../../components/icon/ChatIcon';
import StarAwardIcon from '../../../components/icon/StarAwardIcon';
import AttachmentIcon from '../../../components/icon/AttachmentIcon';
import ProfileIcon from '../../../components/icon/ProfileIcon';
import Zoom from '@material-ui/core/Zoom';
//import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles({
    paperStyels: {
        padding: '15px',
    },
    discussionContainer: {
        marginTop: '10px',
        marginBottom: '20px',
        border: '1px solid #CECECE',
        borderRadius: '10px',
    },
    discussionTitleBox: {
        backgroundColor: '#D5FAFF',
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
        color: '#FF6B6B',
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: 'Open Sans',
        lineHeight: '33px',
        marginRight: '8.5px',
    },
    backslash: {
        marginLeft: '5px',
        color: '#042955',
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
    },
    attachmentsDiv: {
        display: 'inline-block',
        marginTop: '10px',
        marginRight: '10px',
        height: '150px',
        borderRadius: '10px',
        border: '1px solid #FF6B6B',
    },
    discussionDivider: {
        marginTop: '15px',
    },
    answersText: {
        color: '#042955',
        fontSize: '16px',
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        lineHeight: '22px',
        marginTop: '9px',
    },
    commentReplyBox: {},
    bottomButton: {
        float: 'right',
        marginBottom: '26px',
        marginRight: '32px',
    },
})

const StyledOutlinedButton = withStyles({
    root: {
        height: '45px',
        color: '#FE6B6B',
        border: '1px solid #FF6B6B',
        borderRadius: '10px',
        padding: '0 30px',
        marginTop: '15px',
    },
})(Button);

const StyledCancelButton = withStyles({
    root: {
        height: '44px',
        color: '#D85806',
        border: '1px solid #FF6B6B',
        borderRadius: '10px',
        padding: '0 18px',
    },
})(Button);

const StyledButton = withStyles({
    root: {
        backgroundColor: '#FF6B6B',
        color: '#FFFFFF',
        height: '44px',
        borderRadius: '10px',
        padding: '0 25px',
        marginLeft: '15px',
        "&:hover": {
            backgroundColor: "#FF6B6B"
        },
    }
  })(Button);

const StyledInput = withStyles({
    root: {
        height: '45px',
        width: '100%',
        padding: '5px 20px',
        border: '1px solid #DBDBDB',
        borderRadius: '10px',
        marginTop: '13px',
        marginBottom: '10px',
    },
})(InputBase);

export default function DiscussionPostComponent(props) {
    const classes = useStyles({});

    const [ reply, setReply ] = React.useState('');
    const handleChange = (e) => {
        setReply(e.target.value);
    }
    const handleReplie = () => {
        alert(reply);
        setReply('');
    }

    return (
        <Paper className={classes.paperStyels}>
            <div>
                <span className={classes.discussionTitle}>
                    {props.rowData.category}
                    <span className={classes.backslash}>/</span>
                </span>
                <span className={classes.discussionTitle}>
                    {props.rowData.sub_category}
                    <span className={classes.backslash}>/</span>
                </span>
                <span className={classes.discussionTitle}>
                    {props.rowData.sub_sub_category}
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
                        <Tooltip TransitionComponent={Zoom} title="Add" arrow>
                            <StarAwardIcon/>
                        </Tooltip>
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
                </span>
            </div>
            <Grid container className={classes.discussionContainer}>
                <Grid item xs={12}>
                    <div className={classes.discussionTitleBox}>
                        <span>
                            <span className={classes.postByText}>post by</span>
                            <ProfileIcon
                                firstname={props.rowData.firstname}
                                lastname={props.rowData.lastname}
                                bgColor='#3E9CF7'
                            />
                            <span className={classes.username}>
                                {props.rowData.firstname+' '+props.rowData.lastname} /
                            </span>
                            <span className={classes.discussionTime}>{props.rowData.time} /</span>
                            <span className={classes.discussionTime}>{props.rowData.date}</span>
                        </span>
                    </div>
                    <Box className={classes.discussionDetailsBox}>
                        {/*
                        <Typography className={classes.discussionTitle}>
                            {props.rowData.title}
                        </Typography>
                        */}
                        <Typography className={classes.discussionParagraph}>
                            {props.rowData.paragraph}    
                        </Typography>
                        <Grid container spacing={1}>
                        {[1,2].map((data, id) => (
                            <Grid item sm={3} xs={6} key={id} className={classes.attachmentsDiv}
                                style={{  
                                        backgroundImage: `url(https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350)`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                            </Grid>
                        ))}
                        </Grid>
                        <Divider className={classes.discussionDivider}/>
                        <Grid container spacing={2}>
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
                                    onClick={handleReplie}
                                >
                                    Reply
                                </StyledOutlinedButton>
                            </Grid>
                            <Grid item xs={12}>
                                {props.rowData.replies !== undefined && props.rowData.replies !== null && (
                                    <Box className={classes.commentReplyBox}>
                                        { props.rowData.replies.map((commentRow, id) => (
                                            <PostComments
                                                key={id}
                                                firstname={commentRow.firstname}
                                                lastname={commentRow.lastname}
                                                commnet={commentRow.commnet}
                                                likes={commentRow.likes}
                                                replies={commentRow.commnet_reply}
                                                commentRow={commentRow}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <span className={classes.bottomButton}>
                        <StyledCancelButton>
                            CANCEL
                        </StyledCancelButton>
                        <StyledButton>
                            Back to posts
                        </StyledButton>
                    </span>
                </Grid>
            </Grid>
        </Paper>
    )
}

export const DiscussionPost = React.memo(DiscussionPostComponent);