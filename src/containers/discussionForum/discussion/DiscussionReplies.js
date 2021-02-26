import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ProfileIcon from '../../../components/icon/ProfileIcon';

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
  },
  replyCommentDiv: {
    width: '30%',
    display: 'inline-block',
    overflow: 'hidden',
    '@media (max-width: 600px)': {
      width: '100%!important',
    },
  },
  replyCommentSpan: {
    width: '70%',
    '@media (max-width: 600px)': {
      width: '100%!important',
      marginLeft: '10px',
    },
    display: 'inline-block',
    borderBottom: '1px solid #CECECE',
  },
  replyComment: {
    display: 'inline-block',
    width: '80%',
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
    width: '20%',
    color: '#042955',
    float: 'right',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
    lineHeight: '24px',
  },
});

export default function DiscussionRepliesComponent(props) {
  const classes = useStyles({});
  // console.log(props.commentRow);
  const { commentRow } = props;
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  return (
    <Grid container className={classes.replyCommentBox}>
      <Grid item xs={12}>
        <div className={classes.replyCommentDiv}>
          <span className={classes.replyByText}>reply by</span>
          <ProfileIcon
            firstname={commentRow.first_name}
            lastname={commentRow.last_name}
            bgColor='#14B800'
          />
          <span className={classes.replyUsername}>
            {`${commentRow.first_name} ${commentRow.last_name
              .charAt(0)
              .toUpperCase()}. /`}
          </span>
        </div>

        <div className={classes.replyCommentSpan}>
          <div className={classes.replyComment}>
            <span dangerouslySetInnerHTML={{ __html: commentRow.answer }} />
          </div>
          <div className={classes.commentsCount}>
            {`+${commentRow ? commentRow.replay_count : 0} ${
              !isMobile ? 'comments' : ''
            }`}
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export const DiscussionReplies = React.memo(DiscussionRepliesComponent);
