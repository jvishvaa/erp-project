import React, { useContext } from 'react';
import { Grid, makeStyles, withStyles, Button, InputBase } from '@material-ui/core';
import LikeIcon from '../../../../components/icon/LikeIcon';
import ProfileIcon from '../../../../components/icon/ProfileIcon';
import LikeButton from '../../../../components/like-button/index';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import dayjs from "dayjs";
var relativeTime = require('dayjs/plugin/relativeTime');
// import Avatar from '@material-ui/core/Avatar';
// import OutlinedButton from '../../core_themes/buttons/OutlinedButton';

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
    // marginLeft: '10px',
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
    marginTop: '5px',
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
    // marginLeft: '10px',
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
  timeAgo: {
    marginLeft: '5px',
    color: '#9A9A9A',
    fontSize: '15px',
    fontWeight: 'lighter',
    lineHeight: '20px',
  },
});

const StyledOutlinedButton = withStyles({
  root: {
    height: '45px',
    color: '#FE6B6B',
    border: '1px solid #FF6B6B',
    borderRadius: '10px',
    // marginLeft: '20px',
    marginTop: '10px',
    backgroundColor: 'transparent',
    // float: 'right',
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
  dayjs.extend(relativeTime);
  // const commentRow = props.commentRow;

  const [reply, setReply] = React.useState('');
  const [isReply, setIsReply] = React.useState(false);
  const [isChildReply ] = React.useState(props.isChildReply ? props.isChildReply : false);
  const { setAlert } = useContext(AlertNotificationContext);

  const handleChange = (e) => {
    setReply(e.target.value);
  };
  const handleOnClick = () => {
    setIsReply(true);
  };

  const handleReplyToAnswer = () => {
    //replyToAnswer
    const params = {
      answer: reply,
      replay : props.id
    }
    axiosInstance.post(endpoints.discussionForum.replyToAnswer, params)
    .then((res) => {
      console.log(res);
      setReply('');
      props.handleNewReply(1);
      setAlert('success', res.data.message);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} className={classes.replyCommentBox}>
        <div style={{marginTop: '10px'}}>
          <span className={classes.replyByText}>reply by</span>
          <ProfileIcon
            firstname={props.firstname}
            lastname={props.lastname}
            bgColor='#3E9CF7'
          />
          <span className={classes.replyUsername}>
            {`${props.firstname} ${props.lastname}`} /
          </span>
          <span className={classes.timeAgo}>{dayjs(props.commentAt).fromNow()}</span>
        </div>

        <div className={classes.replyCommentDiv}>
          <LikeButton
            id={props.id}
            isLike={props.is_like ? props.is_like : false}
            likeCounts={props.likes ? props.likes : 0}
            isComment
          />
          {/*
                    <LikeIcon/>
                    <span className={classes.commntLikes}>{props.likes ? props.likes : 0}</span>
                    */}
          <div className={classes.replyCommentSpan}>
            <span className={classes.replyComment}>
              <span dangerouslySetInnerHTML={{ __html: props.commnet }} />
            </span>
            {!isChildReply && !isReply && (
              <span onClick={handleOnClick} className={classes.commentsCount}>
                Reply to this user
              </span>
            )}
          </div>
        </div>
      </Grid>
      {!isChildReply && isReply && (
        <Grid item xs={10}>
          <StyledInput
            placeholder='Have your say'
            value={reply}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      )}
      {!isChildReply && isReply && (
        <Grid item xs={2}>
          <StyledOutlinedButton fullWidth onClick={handleReplyToAnswer}>Reply</StyledOutlinedButton>
        </Grid>
      )}
    </Grid>
  );
}

export const Comments = React.memo(CommentsComponent);
