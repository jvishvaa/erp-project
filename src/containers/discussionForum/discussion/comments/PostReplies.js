import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import ProfileIcon from '../../core_themes/icon/ProfileIcon';

const useStyles = makeStyles({
  replyCommentBox: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  replyByText: {
    color: '#042955',
    fontSize: '18px',
    fontWeight: 'lighter',
    fontFamily: 'Open Sans',
    lineHeight: '20px',
    marginLeft: '10px',
  },
  usernameIcon: {
    color: '#FFFFFF',
    height: '31px',
    width: '31px',
    padding: '4px',
    fontSize: '15px',
    lineHeight: '20px',
    backgroundColor: '#14B800',
    borderRadius: '50%',
    marginLeft: '5px',
  },
  replyUsername: {
    color: '#042955',
    fontSize: '20px',
    fontFamily: 'Open Sans',
    fontWeight: 'normal',
    lineHeight: '27px',
    marginLeft: '5px',
  },
  replyCommentDiv: {
    width: '24%',
    display: 'inline-block',
  },
  replyCommentSpan: {
    width: '76%',
    display: 'inline-block',
    borderBottom: '1px solid #CECECE',
  },
  replyComment: {
    display: 'inline-block',
    width: '85%',
    height: '24px',
    fontSize: '18px',
    color: '#042955',
    fontFamily: 'Open Sans',
    fontWeight: 'normal',
    lineHeight: '24px',
    overflow: 'hidden',
  },
  commentsCount: {
    display: 'inline-block',
    width: '15%',
    color: '#042955',
    float: 'right',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
    lineHeight: '24px',
  },
});

export default function PostRepliesComponent(props) {
  const classes = useStyles({});
  console.log('commentRow');
  const { commentRow } = props;
  return (
    <Grid container className={classes.replyCommentBox}>
      <Grid item xs={12}>
        <div className={classes.replyCommentDiv}>
          <span className={classes.replyByText}>reply by</span>
          <span className={classes.usernameIcon}>SM</span>
          <ProfileIcon
            firstname={commentRow.firstname}
            lastname={commentRow.lastname}
            bgColor='#3E9CF7'
          />
          <span className={classes.replyUsername}>
            {`${commentRow.firstname} ${commentRow.lastname} /`}
          </span>
        </div>

        <div className={classes.replyCommentSpan}>
          <div className={classes.replyComment}>{commentRow.commnet}</div>
          <div className={classes.commentsCount}>
            +{commentRow.commnet_count ? commentRow.commnet_count : 0} comments
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export const PostReplies = React.memo(PostRepliesComponent);
