import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import CommentBlock from './CommentBlock';
import Comments from './Comments';

const useStyles = makeStyles({
  childComment: {
    marginLeft: '15px',
    marginTop: '10px',
  },
});

export default function PostCommentsComponent(props) {
  const classes = useStyles({});
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
      {props.replies !== undefined && props.replies !== null && props.replies.length > 0 && (
        <div className={classes.childComment}>
          {props.replies.map((rowData, id) => (
            <CommentBlock
              key={id}
              firstname={rowData.firstname}
              lastname={rowData.lastname}
              commnet={rowData.commnet}
              likes={rowData.likes}
              replies={rowData.commnet_reply}
            />
          ))}
        </div>
      )}
    </>
  );
}

export const PostComments = React.memo(PostCommentsComponent);
