import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import classnames from 'classnames';
import award from "./award.svg";
import likebutton from "./likebutton.svg";
import CardComments from './CardComments';
import LazyLoad from 'react-lazy-load';
import { repeat } from "lodash";
import { display } from '@material-ui/system';
import endpoints from '../../config/Endpoint';
import apiRequest from '../../config/apiRequest';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(0deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  blogCard: {
    height: '28px',
    width: 98,
    backgroundColor: '#FF7F58',
    borderRadius: '19px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: 600,
  },
  discussionCard: {
    height: '28px',
    width: 128,
    backgroundColor: '#FFE26F',
    borderRadius: '19px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#014B7E',
    fontWeight: 1000,
  },

  blogActions: { display: "flex", justifyContent: "space-evenly" },
  discussionActions: { display: "flex", justifyContent: "space-evenly" },
  blogRecords: { display: "flex", justifyContent: "space-between" },
  discussionRecords: { display: "flex", justifyContent: "space-between" },
  // card: { item: "xs={12} sm={12} md={6}", margin: 10, },
  card: {
    ['@media only screen and (max-width: 600px)']: { // eslint-disable-line no-useless-computed-key
      width: '320px'
    },
    ['@media only screen and (min-width: 600px && max-width: 1024px)']: { // eslint-disable-line no-useless-computed-key
      width: '600px'
    },
    ['@media only screen and (min-width: 1024px)']: { // eslint-disable-line no-useless-computed-key
      width: '375px'
    },
    ['@media only screen and (min-width: 1900px)']: { // eslint-disable-line no-useless-computed-key
      width: '500px'
    },
    ['@media only screen and (min-width: 2750px)']: { // eslint-disable-line no-useless-computed-key
      width: '500px'
    }, margin: 10,
  },
  // text: { display: "grid", gap: '1em', gridTemplateColumns: repeat('3', '1fr'), gridTemplateRows: 'masonary', },
  blogtitlesty: { backgroundColor: "#349CEB", color: "#ffffff", display: "flex", justifyContent: "center", padding: '8px', textTransform: 'capitalize' },
  headingsstyle: { color: "#014B7E", },
  Likecss: { fontSize: "16px" },
  Commentcss: { fontSize: "16px" },
  Awardcss: { fontSize: "16px" },
  // datacss: { display: "flex" },
  likebuttoncss: { height: "20px" },
  awardbuttoncss: { height: "20px" },
}));


export default function Blog(props) {
  const [expanded, setExpanded] = React.useState(false);
  const [likeBlogChange, setLikeBlogChange] = React.useState(false);
  const [likedStatus, setLikedStatus] = React.useState(props.likestatus);
  const [commentCount, setCommentCount] = useState(props?.comments);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const classes = useStyles();
  function changeEvent(e, props) {
    if (likeBlogChange) {
      setLikeBlogChange(false);
      setLikedStatus(props.likestatus)
    }
    else {
      setLikeBlogChange(true);
      setLikedStatus(!props.likestatus)
    }
    props.c_like(props?.postId, props?.type);
  }

  console.log("abcd", props.isEnabled)
  return (
    // <LazyLoad>
    <Card className={classes.card} id="mainCard">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {props?.user?.charAt(0)}
          </Avatar>
        }
        action={
          <div className={classnames({ [classes.blogCard]: props?.type === 'Blog', [classes.discussionCard]: props?.type === 'Discussion' })}>
            {props?.type === "Blog" ? 'Blog' : 'Discussion'}
          </div>
        }
        title={<h5 className={classes.headingsstyle}>{props?.user}</h5>}
        subheader={
          <Typography className={classes.headingsstyle}>
            <small style={{ display: 'block', fontSize: 'small' }}>{props?.role_branch}</small>
            <small style={{ display: 'block', fontSize: '10px' }}>{props?.time}</small>
          </Typography>
        }
      />
      <CardContent style={{ padding: "0px 10px" }}>
        <Typography
          // variant="body2"
          style={{
            color: "#014B7E",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            height: '20px'
          }}
        >
          <h6>{props?.data}</h6>
        </Typography>
      </CardContent>
      {props?.type === 'Blog' &&
        <CardMedia
          component="img"
          height="194"
          width="300"
          image={`${endpoints.s3.Userstories}${props.img}`}
          alt="Somthing went wrong while loading the image."
        />
      }
      <Typography variant="body2" color="text.secondary" className={classes.blogtitlesty}>
        <h5><b>{props?.blogtitle}</b></h5>
      </Typography>
      <CardContent style={{ padding: "0px 10px", marginTop: "10px" }}>
        <Typography style={{ display: "flex", justifyContent: "space-between", margin: '0% 10% 0% 10%', fontWeight: 'bold' }}
          variant="body2" className={classnames({ [classes.blogRecords]: props?.type === 'blog', [classes.discussionRecords]: props?.type === 'discussion' })}
          color="text.secondary" bgColor="#ffffff"
        >
          {likeBlogChange && props.likestatus ?
            <span style={{ fontSize: 'small' }}>{props?.likes - 1}</span>
            : likeBlogChange && !props.likestatus ?
              <span style={{ fontSize: 'small' }}>{props?.likes + 1}</span>
              :
              <span style={{ fontSize: 'small' }}>{props?.likes}</span>
          }
          <span style={{ fontSize: 'small' }}>{commentCount}</span>
          {/* {props.type === 'Discussion' && <span style={{ fontSize: 'small' }}>{props.award}</span>} */}
        </Typography>
      </CardContent>
      {props.isEnabled ? (
        <CardActions style={{ display: "flex", justifyContent: "space-between", padding: '0px' }} className={classnames({ [classes.blogActions]: props.type === 'blog', [classes.discussionActions]: props.type === 'discussion' })}>
          <IconButton aria-label="add to favorites" onClick={(e) => changeEvent(e, props)} style={{ paddingTop: '0px' }}>
            <div>
              {
                //(likeBlogChange || props.likestatus) ?
                (likedStatus) ?
                  <img className={classes.likebuttoncss} src={likebutton} alt='like' />
                  :
                  <FavoriteBorderIcon style={{ color: 'red' }} className={classes.likebuttoncss} />
              }


            </div>
            <span className={classes.Likecss}> Like </span>
          </IconButton>
          <IconButton style={{ paddingTop: '0px' }}
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <span className={classes.Commentcss}>Comment</span>
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>) : ''}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <CardComments postId={props?.postId} commentCount={commentCount} setCommentCount={setCommentCount} />
        </CardContent>
      </Collapse>
    </Card>
    //   </Masonry>
    // </LazyLoad>
  );
}