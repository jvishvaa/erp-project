import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import Comments from './Comments';

const useStyles = makeStyles({
  childComment: {
    marginLeft: '15px',
    marginTop: '10px',
  },
});

export default function CommentBlockComponent(props) {
  const classes = useStyles({});
  console.log('CommentBlock');
  return (
    <>
      <Comments
        firstname={props.firstname}
        lastname={props.lastname}
        commnet={props.commnet}
        likes={props.likes}
      />
      {props.replies !== undefined && (
        <div className={classes.childComment}>
          {props.replies.map((rowData, id) => (
            <Comments
              key={id}
              firstname={rowData.firstname}
              lastname={rowData.lastname}
              commnet={rowData.commnet}
              likes={rowData.likes}
            />
          ))}
        </div>
      )}
    </>
  );
}

export const CommentBlock = React.memo(CommentBlockComponent);
