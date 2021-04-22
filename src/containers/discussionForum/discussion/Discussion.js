import React, { useContext } from 'react';
import moment from 'moment';
import { Grid, Box, Typography, makeStyles, Button, withStyles, InputBase, Popover, Divider, IconButton} from '@material-ui/core';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import DiscussionReplies from './DiscussionReplies';
// import PostReplies from './comments/PostReplies';
import LikeIcon from '../../../components/icon/LikeIcon';
import ChatIcon from '../../../components/icon/ChatIcon';
import StarAwardIcon from '../../../components/icon/StarAwardIcon';
import AttachmentIcon from '../../../components/icon/AttachmentIcon';
import ProfileIcon from '../../../components/icon/ProfileIcon';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useHistory, useLocation } from 'react-router-dom';
import LikeButton from '../../../components/like-button/index';
import { useDispatch } from 'react-redux';
import { postAction } from '../../../redux/actions/discussionForumActions';
import GoldAwards from '../../../assets/images/Gold.svg';
import SilverAwards from '../../../assets/images/Silver.svg';
import BronzeAwards from '../../../assets/images/Bronze.svg';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import GiveAwardDialog from './GiveAwardDialog';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Edit } from '@material-ui/icons';
import { editPostDataAction } from '../../../redux/actions/discussionForumActions';

const useStyles = makeStyles({
  discussionContainer: {
    width: '100%',
    marginTop: '10px',
    marginBottom: '20px',
    border: '1px solid #CECECE',
    borderRadius: '10px',
  },
  discussionTitleBox: {
    backgroundColor: '#EFFFB2',
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
    color: '#042955',
    fontSize: '24px',
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
    lineHeight: '33px',
    marginRight: '8.5px',
    '@media (max-width: 600px)': {
      fontSize: '20px',
      marginRight: '6px',
      lineHeight: '24px',
    },
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
    textAlign: 'center',
    '@media (max-width: 600px)': {
      display: 'block',
      justifyContent: 'right',
    },
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
  noAwardsText: {
    color: '#042955',
    fontSize: '20px',
    lineHeight: '24px',
  },
  discussionDotIcon: {
    fill: '#FF6B6B',
  },
  discussionParagraph: {
    color: '#042955',
    fontSize: '18px',
    fontFamily: 'Open Sans',
    lineHeight: '24px',
    height: '48px',
    overflow: 'hidden',
  },
  answersText: {
    color: '#042955',
    fontSize: '16px',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    lineHeight: '22px',
    marginTop: '9px',
  },
  commentReplyBox: {
    borderLeft: '1px solid #FE6B6B',
    minHeight: '60px',
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: '8px',
  },
  mobileButtons: {
    position: 'relative',
    '@media (max-width: 600px)': {
      padding: '10px',
    },
  },
  replyButtons: {
    marginTop: 'auto',
    '@media (max-width: 600px)': {
      marginTop: '10px!important',
    },
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
    backgroundColor: 'transparent',
    position: 'absolute',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
    bottom: '15px',
    width: '178px',
    '@media (max-width: 600px)': {
      width: '170px',
    },
  },
})(Button);

const OutlinedButton = withStyles({
  root: {
    height: '45px',
    color: '#0455A6',
    border: '1px solid #0455A6',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
    backgroundColor: 'transparent',
    '@media (min-width: 600px)': {
      marginTop: '20px!important',
    },
  },
})(Button);

const StyledButton = withStyles({
  root: {
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
    marginTop: '10px',
    backgroundColor: '#FF6B6B',
    '&:hover': {
      backgroundColor: '#FF6B6B',
    },
    '@media (min-width: 600px)': {
      marginTop: '0px!important',
    },
  },
  startIcon: {
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
  },
})(Button);

const StyledInput = withStyles({
  root: {
    height: '45px',
    width: '100%',
    padding: '5px 20px',
    border: '1px solid #DBDBDB',
    borderRadius: '10px',
    //marginBottom: '10px',
    marginTop: '5px',
  },
})(InputBase);
/*
function createMarkup() {
    return {__html: 'First &middot; Second'};
  }
  
  function MyComponent() {
    return <div dangerouslySetInnerHTML={createMarkup()} />;
  }
*/
export default function DiscussionComponent(props) {
  const classes = useStyles({});
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { setAlert } = useContext(AlertNotificationContext);
  const [reply, setReply] = React.useState('');
  const [ addComment, setAddComment] = React.useState(props.rowData.comment_count? props.rowData.comment_count: 0);
  const [commentList, setCommentList] = React.useState([]);

  const handleChange = (e) => {
    setReply(e.target.value);
  };
  const handleReply = () => {
    const param = {
      answer: reply,
      post: props.rowData.id,
    };

    axiosInstance
      .post(endpoints.discussionForum.CreateCommentAndReplay, param)
      .then((res) => {
        if(res.data.status_code === 200){
          setReply('');
          setAlert('success', res.data.message);
          setAddComment(addComment + 1);
        }
        else {
          setAlert('error', res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        setAlert('error', error.message);
      });
  };
  const handleReadPost = () => {
    //dispatch(postAction(props.rowData));
    if(location.pathname === '/student-forum'){
      history.push('/student-forum/post/' + props.rowData.id);
    }
    else {
      history.push('/teacher-forum/post/' + props.rowData.id);
    }
    //history.push('/discussion-forum/post/' + props.rowData.id);
  };

  React.useEffect(() => {
    const params = {
      comment: props.rowData.id,
    };
    axiosInstance
      .get(`${endpoints.discussionForum.postLike}?post=${props.rowData.id}&type=2`)
      .then((res) => {
        setCommentList(res.data.result.results);
      })
      .catch((error) => console.log(error));
  }, [props.rowData, addComment]);

  // awards popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);

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
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};

  const handleClickOpen = (id) => {
    //handlePopoverClose();
    setPostId(id);
    setOpenGiveAward(true);
  };

  const handleClose = (value) => {
    setOpenGiveAward(false);
    setSelectedValue(value);
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

  React.useEffect(() => {
    props.rowData && props.rowData.awards.map((award) => {
      setAwardsCount(awardsCount + award.gold + award.silver + award.bronze);
      award.gold && setGoldCount(award.gold);
      award.silver && setSilverCount(award.silver);
      award.bronze && setBronzeCount(award.bronze);
    })
  }, [props.rowData]);

  const handleDiscussionAction = (event) => {
    if(props.rowData.post_by.id === userDetails.user_id){
      setAnchorE2(event.currentTarget)
    }
  }

  const handlePopoverActionClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorE2(null);
  }

  const open2 = Boolean(anchorE2);
  const id2 = open2 ? 'simple-popover1' : undefined;

  const handleDelete = (id) => {
    axiosInstance
      .delete(`/academic/${id}/update-post/`)
      .then((res) => {
        if(res.data.status_code === 200){
          setAlert('success', res.data.message);
          props.deleteEdit();
          handlePopoverActionClose();
        }
      })
      .catch((error) => console.log(error));
  }

  const handleEditPost = () => {
    //dispatch(editPostDataAction(props.rowData));
    if(location.pathname === '/student-forum'){
      history.push('/student-forum/edit/' + props.rowData.id);
    }
    else {
      history.push('/teacher-forum/edit/' + props.rowData.id);
    }
  }

  return (
    <Grid container className={classes.discussionContainer}>
      <Grid item xs={12}>
        <div className={classes.discussionTitleBox}>
          <span>
            <div>
              <span className={classes.discussionTitle}>
                {`${props.rowData && props.rowData.categories.category_name} /`}
              </span>
              <span className={classes.discussionTitle}>
                {`${props.rowData && props.rowData.categories.sub_category_name} /`}
              </span>
              <span className={classes.discussionTitle}>
                {props.rowData && props.rowData.categories.sub_sub_category_name}
              </span>
            </div>
            <div style={{ display: 'inline-block'}}>
              {/* <FiberManualRecordIcon className={classes.dotSeparator} /> */}
              <span className={classes.postByText}>post by</span>
              <span style={{verticalAlign: 'middle'}}>
                <ProfileIcon
                  firstname={props.rowData.post_by.first_name}
                  lastname={props.rowData.post_by.last_name}
                  bgColor='#14B800'
                />
              </span>
              <span className={classes.username}>
                {`${props.rowData.post_by.first_name} ${props.rowData.post_by.last_name} /`}
              </span>
              <span className={classes.discussionTime}>
                {`${moment(props.rowData.post_at).format('hh : mm A')} /`}
              </span>
              <span className={classes.discussionTime}>
                {moment(props.rowData.post_at).format('DD.MM.YYYY')}
              </span>
            </div>
          </span>
          <span className={classes.discussionIconRow}>
            <span>
              <LikeButton
                id={props.rowData.id}
                isLike={props.rowData.is_like}
                likeCounts={props.rowData.like_count}
              />
            </span>
            <span style={{ marginLeft: '10px'}}>
              <ChatIcon />
              <span className={classes.discussionIcon}>
                {addComment}
              </span>
            </span>
            <span
              aria-describedby={id}
              onMouseEnter={handlePopoverOpen}
              //onMouseLeave={handlePopoverClose}
              //onClick={handlePopoverOpen}
            >
              <StarAwardIcon />
              <span className={classes.discussionIcon}>{awardsCount}</span>
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
                    {goldCount === 0 && silverCount === 0 && bronzeCount === 0 && (<span className={classes.noAwardsText}>No Awards Found</span>)}
                  </div>
                  <Divider />
                  <OutlinedButton
                    variant="outlined"
                    color="secondary"
                    onClick={(e) => handleClickOpen(props.rowData.id)}
                  >
                    GIVE AWARD
                  </OutlinedButton>
                </div>
              </Popover>
            </ClickAwayListener>
            {props.rowData.attachments !== undefined && props.rowData.attachments !== 0 && (
              <span>
                <AttachmentIcon />
                <span className={classes.discussionIcon}>
                  {props.rowData.attachments}
                </span>
              </span>
            )}
            <IconButton onClick={handleDiscussionAction} style={{verticalAlign: 'baseline',}}>
              <MoreVertIcon className={classes.discussionDotIcon}/>
            </IconButton>
            {/* <ClickAwayListener onClickAway={handlePopoverActionClose}> */}
              <Popover
                id={id2}
                open={open2}
                anchorEl={anchorE2}
                onClose={handlePopoverActionClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <div style={{padding: '10px', borderRadius: '5px'}}>
                  <Typography onClick={handleEditPost}>Edit</Typography>
                  <Divider style={{marginBottom:'10px', marginTop: '10px'}}/>
                  <Typography onClick={() => handleDelete(props.rowData.id)}>Delete</Typography>
                </div>
              </Popover>
            {/* </ClickAwayListener> */}
          </span>
        </div>
        <Box className={classes.discussionDetailsBox}>
          <Typography className={classes.discussionTitle}>
            {props.rowData.title ?? ''}
          </Typography>
          {props.rowData && props.rowData.description && (
            <Typography className={classes.discussionParagraph}>
              <div dangerouslySetInnerHTML={{__html: props.rowData.description}} />
            </Typography>
          )}
          <Typography className={classes.answersText}>Top answers</Typography>
          <Grid container spacing={2}>
            <Grid item sm={10} sx={12}>
              {commentList && (
                <Box className={classes.commentReplyBox}>
                  {commentList.slice(0, 2).map((commentRow) => (
                    <DiscussionReplies key={commentRow.id} commentRow={commentRow} />
                  ))}
                </Box>
              )}
              <StyledInput
                placeholder="Have your say"
                value={reply}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item sm={2} xs={12} className={classes.mobileButtons}>
              <Grid container spacing={2}>
                <Grid item sm={12} xs={6}>
                  <StyledButton
                    color="secondary"
                    variant="contained"
                    fullWidth
                    onClick={handleReadPost}
                  >
                    Read post
                  </StyledButton>
                </Grid>
                <Grid item sm={12} xs={6} className={classes.replyButtons}>
                  <StyledOutlinedButton fullWidth onClick={handleReply}>
                    Reply
                  </StyledOutlinedButton>
                </Grid>
              </Grid>
            </Grid>
            {/*
            <Grid item sm={10} xs={12}>
              <StyledInput
                placeholder="Have your say"
                value={reply}
                onChange={handleChange}
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={2}>
              <StyledOutlinedButton onClick={handleReply}>
                Reply
              </StyledOutlinedButton>
            </Grid>
            */}
          </Grid>
        </Box>
        <GiveAwardDialog
          selectedValue={selectedValue}
          postId={postId}
          open={openGiveAward}
          onClose={handleClose}
          handleAwardsCount={handleAwardsCount}
        />
      </Grid>
    </Grid>
  );
}

export const Discussion = React.memo(DiscussionComponent);
