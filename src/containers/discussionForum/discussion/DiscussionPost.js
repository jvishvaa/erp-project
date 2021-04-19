import React, { useContext } from 'react';
import { Paper, Divider } from '@material-ui/core';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import {
  Grid,
  Box,
  Typography,
  makeStyles,
  Button,
  withStyles,
  InputBase,
  Tooltip,
  Popover,
} from '@material-ui/core';
import PostComments from './comments/PostComments';
import LikeIcon from '../../../components/icon/LikeIcon';
import ChatIcon from '../../../components/icon/ChatIcon';
import StarAwardIcon from '../../../components/icon/StarAwardIcon';
import AttachmentIcon from '../../../components/icon/AttachmentIcon';
import ProfileIcon from '../../../components/icon/ProfileIcon';
import LikeButton from '../../../components/like-button/index';
import Zoom from '@material-ui/core/Zoom';
import Layout from '../../Layout/index';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import GoldAwards from '../../../assets/images/Gold.svg';
import SilverAwards from '../../../assets/images/Silver.svg';
import BronzeAwards from '../../../assets/images/Bronze.svg';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import GiveAwardDialog from './GiveAwardDialog';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles({
  paperStyels: {
    padding: '15px',
  },
  discussionContainer: {
    marginTop: '10px',
    marginBottom: '20px',
    border: '1px solid #CECECE',
    borderRadius: '10px',
  },
  discussionTitleBox: {
    backgroundColor: '#D5FAFF',
    padding: '13px 20px',
    borderRadius: '10px 10px 0px 0px',
  },
  discussionCategoryTitle: {
    color: '#042955',
    fontSize: '20px',
    fontFamily: 'Open Sans',
    lineHeight: '27px',
  },
  discussionDetailsBox: {
    padding: '7px 22px 19px',
  },
  discussionTitle: {
    color: '#FF6B6B',
    fontSize: '24px',
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
    lineHeight: '33px',
    marginRight: '8.5px',
  },
  backslash: {
    marginLeft: '5px',
    color: '#042955',
  },
  dotSeparator: {
    height: '12px',
    width: '12px',
    fill: '#FF6B6B',
    marginRight: '10px',
  },
  postByText: {
    color: '#042955',
    fontSize: '18px',
    fontWeight: 'lighter',
    fontFamily: 'Open Sans',
  },
  username: {
    color: '#042955',
    fontSize: '20px',
    fontFamily: 'Open Sans',
    lineHeight: '27px',
  },
  discussionTime: {
    marginLeft: '6px',
    color: '#042955',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
    lineHeight: '27px',
  },
  discussionIconRow: {
    float: 'right',
  },
  discussionIcon: {
    color: '#042955',
    fontSize: '20px',
    fontWeight: 300,
    fontFamily: 'Open Sans',
    marginLeft: '8px',
    marginRight: '20px',
    verticalAlign: 'super',
  },
  discussionDotIcon: {
    fill: '#FF6B6B',
  },
  discussionParagraph: {
    color: '#042955',
    fontSize: '18px',
    fontFamily: 'Open Sans',
    lineHeight: '24px',
  },
  attachmentsDiv: {
    display: 'inline-block',
    marginTop: '10px',
    marginRight: '10px',
    height: '150px',
    borderRadius: '10px',
    border: '1px solid #FF6B6B',
  },
  discussionDivider: {
    marginTop: '25px',
  },
  answersText: {
    color: '#042955',
    fontSize: '16px',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    lineHeight: '22px',
    marginTop: '9px',
  },
  commentReplyBox: {},
  bottomButton: {
    float: 'right',
    marginBottom: '26px',
    marginRight: '32px',
  },
  awardCount: {
    color: '#754700',
    position: 'absolute',
    top: '63%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '36px',
    fontWeight: 'bold',
  }
});

const StyledOutlinedButton = withStyles({
  root: {
    height: '45px',
    color: '#FE6B6B',
    border: '1px solid #FF6B6B',
    borderRadius: '10px',
    marginTop: '15px',
    backgroundColor: 'transparent',
  },
})(Button);

const StyledCancelButton = withStyles({
  root: {
    height: '44px',
    color: '#D85806',
    border: '1px solid #FF6B6B',
    borderRadius: '10px',
    padding: '0 18px',
    backgroundColor: 'transparent',
  },
})(Button);

const StyledButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    height: '44px',
    borderRadius: '10px',
    padding: '0 25px',
    marginLeft: '15px',
    '&:hover': {
      backgroundColor: '#FF6B6B',
    },
  },
})(Button);

const StyledInput = withStyles({
  root: {
    height: '45px',
    width: '100%',
    padding: '5px 20px',
    border: '1px solid #DBDBDB',
    borderRadius: '10px',
    marginTop: '13px',
    marginBottom: '10px',
  },
})(InputBase);

const OutlinedButton = withStyles({
  root: {
    height: '45px',
    color: '#0455A6',
    border: '1px solid #0455A6',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    '@media (min-width: 600px)': {
      marginTop: '20px!important',
    },
  },
})(Button);

export default function DiscussionPostComponent(props) {
  const classes = useStyles({});
  const history = useHistory();
  const location = useLocation();
  const postsId = useParams();
  const postData = useSelector((state) => state.discussionReducers.post);
  const [reply, setReply] = React.useState('');
  const [commentsList, setCommentsList] = React.useState([]);
  const [postsData, setPostsData] = React.useState('');
  const [commentsCount, setCommentsCount] = React.useState(0);
  const { setAlert } = useContext(AlertNotificationContext);

  const handleChange = (e) => {
    setReply(e.target.value);
  };

  const handleBackToPost = () => {
    //history.push('/discussion-forum');
    if(location.pathname === `/student-forum/post/${postsId.id}`){
      history.push('/student-forum');
    }
    else {
      history.push('/teacher-forum');
    }
    //<Redirect to="/dashboard" />
  };

  const handleReplie = () => {
    //alert(reply);
    const params = {
      answer: reply,
      post: postsData.id
    }

    axiosInstance.post(endpoints.discussionForum.CreateCommentAndReplay, params)
    .then((res) => {
      console.log(res);
      setReply('');
      setCommentsCount(commentsCount + 1);
      setAlert('success', res.data.message);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  React.useEffect(() => {
    //const postID = location.state.params;
    axiosInstance
      .get(`/academic/${postsId.id}/retrieve-post/`)
      .then((res) => {
        setPostsData(res.data.result);
        setCommentsCount(res.data.result.comment_count);
      })
      .catch((error) => console.log(error));
  }, []);

  React.useEffect(() => {
    if(commentsCount > 0){
      axiosInstance
      .get(`${endpoints.discussionForum.postLike}?post=${postsId.id}&type=2`)
      .then((res) => {
        setCommentsList(res.data.result.results);
      })
      .catch((error) => console.log(error));
    }
  }, [commentsCount]);

  // awards popover
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (e) => {
    //e.preventDefault();
    e.stopPropagation();
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [openGiveAward, setOpenGiveAward] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [awardsCount, setAwardsCount] = React.useState(0);
  const [goldCount, setGoldCount] = React.useState(0);
  const [silverCount, setSilverCount] = React.useState(0);
  const [bronzeCount, setBronzeCount] = React.useState(0);
  const [postId, setPostId] = React.useState('');

  const handleClickOpen = (id) => {
    //handlePopoverClose();
    setPostId(id);
    setOpenGiveAward(true);
  };

  const handleAwardsCount = (id) =>{
    if(id === 1){
      setGoldCount(goldCount + 1);
    }
    if(id === 2){
      setSilverCount(silverCount + 1);
    }
    if(id === 3){
      setBronzeCount(bronzeCount + 1);
    }
    setAwardsCount(awardsCount + 1);
  }
  const handleClose = (value) => {
    setOpenGiveAward(false);
    setSelectedValue(value);
  };

  React.useEffect(() => {
    postsData &&
      postsData.awards.map((award) => {
        setAwardsCount(awardsCount + award.gold + award.silver + award.bronze);
        award.gold && setGoldCount(award.gold);
        award.silver && setSilverCount(award.silver);
        award.bronze && setBronzeCount(award.bronze);
      });
  }, [postsData]);

  return (
      <Layout>
        <div className='breadcrumb-container-create' style={{ marginLeft: '15px'}}>
          <CommonBreadcrumbs
            componentName='Discussion forum'
            childComponentName='Post'
          />
        </div>
        <Paper className={classes.paperStyels}>
          {postsData && (
            <div>
              {postsData.categories && (
                <>
                  <span className={classes.discussionTitle}>
                    {postsData.categories.category_name}
                    <span className={classes.backslash}>/</span>
                  </span>
                  <span className={classes.discussionTitle}>
                    {postsData.categories.sub_category_name}
                    <span className={classes.backslash}>/</span>
                  </span>
                  <span className={classes.discussionTitle}>
                    {postsData.categories.sub_sub_category_name}
                  </span>
                </>
              )}
              <span className={classes.discussionIconRow}>
                <span>
                  <LikeButton
                    id={postsData.id}
                    isLike={postsData.is_like}
                    likeCounts={postsData? postsData.like_count : 0}
                  />
                </span>
                <span style={{ marginLeft: '10px'}}>
                  <ChatIcon />
                  <span className={classes.discussionIcon}>
                    {commentsCount}
                  </span>
                </span>
                <span
                  aria-describedby={id}
                  onMouseEnter={handlePopoverOpen}
                >
                  <StarAwardIcon />
                  <span className={classes.discussionIcon}>
                    {awardsCount}
                  </span>
                </span>
                  <ClickAwayListener onClickAway={handlePopoverClose}>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handlePopoverClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}  
                    >
                      <div style={{ padding: '10px 20px', textAlign: 'center'}}>
                        {/* <SilverAwards /> */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          {goldCount !== 0 && (
                            <span style={{position: 'relative'}}>
                              <img src={GoldAwards} alt="Silver Awards" />
                              <div className={classes.awardCount}>{goldCount}</div>
                            </span>)}
                          {silverCount !== 0 && (
                            <span style={{position: 'relative'}}>
                              <img src={SilverAwards} alt="Silver Awards" />
                              <div className={classes.awardCount}>{silverCount}</div>
                            </span>)}
                          {bronzeCount !== 0 && (
                            <span style={{position: 'relative'}}>
                              <img src={BronzeAwards} alt="Silver Awards" />
                              <div className={classes.awardCount}>{bronzeCount}</div>
                            </span>)}
                          {goldCount === 0 && silverCount === 0 && bronzeCount === 0 && (
                            <span className={classes.noAwardsText}>No Awards Found</span>
                          )}
                        </div>
                        <Divider />
                        <OutlinedButton
                            variant="outlined"
                            color="secondary"
                            onClick={(e) => handleClickOpen(postsData.id)}
                        >
                          GIVE AWARD
                        </OutlinedButton>
                      </div>
                    </Popover>
                  </ClickAwayListener>
                  {props.rowData && props.rowData.attachments !== undefined && props.rowData.attachments !== 0 && (
                    <span>
                      <AttachmentIcon />
                      <span className={classes.discussionIcon}>
                      {props.rowData ? props.rowData.attachments : 0}
                    </span>
                  </span>
                )}
            </span>
          </div>
        )}
        <Grid container className={classes.discussionContainer}>
                  <Grid item xs={12}>
                      <div className={classes.discussionTitleBox}>
                          <span>
                              <span className={classes.postByText}>post by</span>
                              <ProfileIcon
                                  firstname={postsData.post_by ? postsData.post_by.first_name : ''}
                                  lastname={postsData.post_by ? postsData.post_by.last_name : ''}
                                  bgColor='#3E9CF7'
                              />
                              <span className={classes.username}>
                                  {`${postsData.post_by ? postsData.post_by.first_name : ''} ${postsData.post_by ? postsData.post_by.last_name : ''}`}
                                  {' '}/
                              </span>
                              {postsData.post_at && (
                                <>
                                  <span className={classes.discussionTime}>
                                    {moment(postsData.post_at).format('hh:mm')}
                                    {' '}/
                                  </span>
                                  <span className={classes.discussionTime}>{moment(postsData.post_at).format('DD.MM.YYYY')}</span>
                                </>
                              )}
                            </span>
                          </div>
                      <Box className={classes.discussionDetailsBox}>
                          <Typography className={classes.discussionTitle}>
                            {postsData && postsData.title}
                          </Typography>
                           
                          <Typography className={classes.discussionParagraph}>
                              <div dangerouslySetInnerHTML={{__html: postsData && postsData.description}} />
                          </Typography>
                          {/* <Grid container spacing={1}>
                              {[1,2].map((data, id) => (
                              <Grid
                                  item sm={3} xs={6} key={id} className={classes.attachmentsDiv}
                                  style={{  
                                  backgroundImage: `url(https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350)`,
                                  backgroundPosition: 'center',
                                  backgroundSize: 'cover',
                                  backgroundRepeat: 'no-repeat',
                                }}
                              ></Grid>
                            ))}
                          </Grid> */}
                          <Divider className={classes.discussionDivider} />
                          <Grid container spacing={2}>
                              <Grid item xs={10}>
                                <StyledInput
                                      placeholder="Have your say"
                                      value={reply}
                                      onChange={handleChange}
                                      fullWidth
                                />
                              </Grid>
                              <Grid item xs={2}>
                                  <StyledOutlinedButton
                                      fullWidth
                                      onClick={handleReplie}
                                    >
                                      Reply
                                    </StyledOutlinedButton>
                              </Grid>
                              <Grid item xs={12}>
                                  {commentsList && commentsList.length > 0 && (
                                    <Box className={classes.commentReplyBox}>
                                      {commentsList &&
                                        commentsList.length > 0 &&
                                            commentsList.map((commentRow, id) => (
                                              <PostComments
                                                  key={commentRow.id}
                                                  id={commentRow.id}
                                                  firstname={commentRow.first_name? commentRow.first_name : ''}
                                                  lastname={commentRow.last_name? commentRow.last_name : ''}
                                                  commnet={commentRow.answer? commentRow.answer : ''}
                                                  likes={commentRow.like_count? commentRow.like_count : 0}
                                                  isLikes={commentRow.is_like? commentRow.is_like : false}
                                                  replies={commentRow.replay? commentRow.replay : []}
                                                  replayCount={commentRow.replay_count ? commentRow.replay_count : 0}
                                                  commentAt={commentRow.comment_at ? commentRow.comment_at : 0}
                                                  //commentRow={commentRow}
                                              />
                                      ))}
                                    </Box>
                                  )}
                              </Grid>
                          </Grid>
                      </Box>
                  </Grid>
                  <Grid item xs={12}>
                      <span className={classes.bottomButton}>
                          {/* <StyledCancelButton>
                              CANCEL
                            </StyledCancelButton> */}
                          <StyledButton onClick={handleBackToPost}>
                            Back to posts
                          </StyledButton>
                      </span>
                  </Grid>
                </Grid>
              <GiveAwardDialog
                selectedValue={selectedValue}
                postId={postId}
                open={openGiveAward}
                onClose={handleClose}
                handleAwardsCount={handleAwardsCount}
              />
      </Paper>
    </Layout>
  );
}

export const DiscussionPost = React.memo(DiscussionPostComponent);
