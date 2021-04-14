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
  console.log('CommentBlock');

  const [commentsList, setCommentsList] = React.useState([]);

  React.useEffect(() => {
    if(props.replayCount >= 1) {
      axiosInstance
      .get(`${endpoints.discussionForum.commentList}?comment=${props.id}`)
      .then((res) => {
        setCommentsList(res.data.result.results);
      })
      .catch((error) => console.log(error));
    }
  }, [props.rowData]);

  return (
    <>
      <Comments
        firstname={props.firstname}
        lastname={props.lastname}
        commnet={props.commnet}
        likes={props.likes}
        isLikes={props.isLikes}
        id={props.id}
      />
      {props.replayCount && props.replayCount >= 1 && (
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
            />
          ))}
        </div>
      )}
    </>
  );
}

export const CommentBlock = React.memo(CommentBlockComponent);
