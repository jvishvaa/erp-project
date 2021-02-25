import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import LikeIcon from '../icon/LikeIcon';
import axiosInstance from '../../config/axios';

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    cursor: 'pointer',
  },
  likeCount: {
    display: 'inline-block',
    marginLeft: '5px',
    verticalAlign: 'super',
    fontSize: '20px',
  },
});

const LikeButton = (props) => {
  const classes = useStyles({});
  const [isLike, setIsLike] = React.useState(props.isLike);
  const [likeCount, setLikeCount] = React.useState(props.likeCounts);
  const [isComment] = React.useState(!!props.isComment);

  const handleLikeButton = () => {
    if (!isLike && !isComment) {
      axiosInstance
        .put(`/academic/${props.id}/post-like/`)
        .then((res) => {
          console.log(res);
          setLikeCount(likeCount + 1);
          setIsLike(true);
        })
        .catch((error) => console.log(error));
    }
    if (isComment && !isLike) {
      axiosInstance
        .put(`/academic/${props.id}/comment-like/`)
        .then((res) => {
          console.log(res);
          setLikeCount(likeCount + 1);
          setIsLike(true);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className={classes.root} onClick={(e) => handleLikeButton()}>
      <LikeIcon />
      <Typography className={classes.likeCount}>{likeCount}</Typography>
    </div>
  );
};

export default LikeButton;
