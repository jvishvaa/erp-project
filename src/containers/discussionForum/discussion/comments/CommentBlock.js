import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import Comments from './Comments';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';

const useStyles = makeStyles({
  childComment: {
    marginLeft: '15px',
    marginTop: '10px',
  },
});

export default function CommentBlockComponent(props) {
  const classes = useStyles({});
  const [replayCount, setReplayCount] = React.useState(props.replayCount? props.replayCount : 0);
  const [commentsList, setCommentsList] = React.useState([]);

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
      {replayCount >= 1 && (
        <div className={classes.childComment}>
          {commentsList.length > 0 &&  commentsList.map((rowData, id) => (
            <Comments
              key={id}
              id={rowData.id}
              firstname={rowData.first_name}
              lastname={rowData.last_name}
              commnet={rowData.answer}
              likes={rowData.like_count}
              isLikes={rowData.is_like}
              isChildReply={true}
              commentAt={rowData.comment_at ? rowData.comment_at : 0}
              handleNewReply={handleNewReply}
            />
          ))}
        </div>
      )}
    </>
  );
}

export const CommentBlock = React.memo(CommentBlockComponent);
