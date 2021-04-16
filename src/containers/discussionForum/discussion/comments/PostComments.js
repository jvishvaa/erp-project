import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import CommentBlock from './CommentBlock';
import Comments from './Comments';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';

const useStyles = makeStyles({
  childComment: {
    marginLeft: '15px',
    marginTop: '10px',
  },
});

export default function PostCommentsComponent(props) {
  const classes = useStyles({});
  const [commentsList, setCommentsList] = React.useState([]);
  const [replayCount, setReplayCount] = React.useState(props.replayCount? props.replayCount : 0);

  const handleNewReply = () =>{
    setReplayCount(replayCount + 1);
  }
  React.useEffect(() => {
    if(replayCount >= 1) {
      axiosInstance
      .get(`${endpoints.discussionForum.commentList}?comment=${props.id}`)
      .then((res) => {
        setCommentsList(res.data.result.results);
      })
      .catch((error) => console.log(error));
    }
  }, [props.rowData, replayCount]);

  return (
    <>
      <Comments
        firstname={props.firstname}
        lastname={props.lastname}
        commnet={props.commnet}
        likes={props.likes}
        isLikes={props.isLikes}
        id={props.id}
        commentAt={props.commentAt}
        handleNewReply={handleNewReply}
      />
      {/* {props.replies !== undefined && props.replies !== null && props.replies.length > 0 && (
        <div className={classes.childComment}>
          {props.replies.map((rowData, id) => (
            <CommentBlock
              key={id}
              id={rowData.id}
              firstname={rowData.firstname}
              lastname={rowData.lastname}
              commnet={rowData.commnet}
              likes={rowData.likes}
              isLikes={rowData.isLikes}
              replies={rowData.commnet_reply}
            />
          ))}
        </div>
      )} */}
      {replayCount >= 1 && (
        <div className={classes.childComment}>
          {commentsList.length > 0 && commentsList.map((rowData, id) => (
            <CommentBlock
              key={id}
              id={rowData.id}
              firstname={rowData.first_name}
              lastname={rowData.last_name}
              commnet={rowData.answer}
              likes={rowData.like_count}
              isLikes={rowData.is_like}
              replies={rowData.commnet_reply}
              replayCount={rowData.replay_count ? rowData.replay_count : 0}
              commentAt={rowData.comment_at ? rowData.comment_at : 0}
            />
          ))}
        </div>
      )}
    </>
  );
}

export const PostComments = React.memo(PostCommentsComponent);
