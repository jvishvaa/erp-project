import React, { useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  IconButton,
  Tooltip,
  Card,
  Button,
  TextField,
  Box,
  Typography,
} from '@material-ui/core';
import {
  Favorite as LikeIcon,
  FavoriteBorder as UnlikeIcon,
  Face as PersonIcon,
  ChatBubbleOutline as CommentIcon,
} from '@material-ui/icons';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Layout from '../../Layout';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import orchidsRadioLogo from './orchidsRadioLogo.png';
import AudioPlayerWrapper from './audioPlayerWrapper';
import {
  getSparseDate,
  getFormattedHrsMnts,
} from '../../../components/utils/timeFunctions';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Pagination from '@material-ui/lab/Pagination';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  tabRoot: {
    width: '100%',
    flexGrow: 1,

  },
  comment: {
    backgroundColor: '#f9f9f9',
    width: '95%',
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    display: 'flex'
  },
  commenter: {
    marginRight: '5px'
  },
  commentInput: {
    height: 50,
  },
  mobroot: {
    maxWidth: 345,
  },
}));
const ViewOrchadioMobile = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [tabValue, settabValue] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const { first_name: name } = JSON.parse(localStorage.getItem('userDetails') || {});
  const [collapseId, setCollapseId] = React.useState('');
  const tabs = ['All', 'Liked', 'Archived'];
  const limit = 5;
  const [totalPages, setTotalPages] = React.useState('')
  const [pageNumber, setPageNumber] = React.useState(1)
  var letterNumber = /^.*[a-zA-Z0-9][^a-zA-Z0-9]*$/

  let userName = JSON.parse(localStorage.getItem('rememberDetails')) || {};
  console.log(userName[0], 'userName');

  const handleExpandClick = (index) => {
    setCollapseId(index);
    setExpanded(!expanded);
  };
  const completionCallback = (id) => {
    const body = {
      listened_percentage: 100,
    };
    axios
      .put(
        `${endpoints.orchadio.ListenedPercentage}${id}/orchido-listened-percentage/
      `,
        body
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  const completedOnPecentageLimit = (id, percentageCompleted) => {
    const body = {
      listened_percentage: percentageCompleted === 1 ? 0 : 30,
    };
    axios
      .put(
        `${endpoints.orchadio.ListenedPercentage}${id}/orchido-listened-percentage/
      `,
        body
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  const likeHandler = (item) => {
    axios
      .put(`${endpoints.orchadio.PostCommentandLike}${item.id}/orchido-like/`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setAlert('success', result.data.message);
          const dat = data.map((it) => {
            if (it.id === item.id) {
              it.is_like = !it.is_like;
              if (it.is_like) {
                it.likes += 1;
              } else {
                it.likes -= 1;
              }
            }
            return it;
          });
          setData(dat);
        } else {
          setAlert('warning', result.data.message);
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', 'Something went wrong.. Try again later');
      });
  };

  const commentValidate = (item) => {
    if (!letterNumber.test(comment)) {
      console.log("not match");
      setAlert('warning', "Please enter comment");
    } else {
      postComment(item);
    }
  }
  const postComment = (item) => {
    axios
      .put(`${endpoints.orchadio.PostCommentandLike}${item.id}/create-orchido-comment/`, {
        comment,
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setComment('')
          setAlert('success', result.data.message);
          const dat = data.map((it) => {
            if (it.id === item.id) {
              const commentArray = [{'comment' : comment, 'user__first_name' : name ,'user__username' : userName[0] }]
              it.comments_list.unshift(commentArray[0]);
              console.log(commentArray , "its");
            }
            return it;
          });
          setData(dat);
        } else {
          setAlert('warning', result.data.message);
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.response?.data?.description)
      });
  };

  const handlePagination = (event, page) => {
    setPageNumber(page);
    setLoading(true)
  };

  const getRadio = () => {
    let url;
    if (tabValue === 0) {
      url = `${endpoints.orchadio.GetRadioProgram}?page_number=${pageNumber}&page_size=${limit}`;
    } else if (tabValue === 1) {
      url = `${endpoints.orchadio.GetRadioProgram}?category_type=1&page_number=${pageNumber}&page_size=${limit}`;
    } else if (tabValue === 2) {
      url = `${endpoints.orchadio.GetRadioProgram}?is_deleted=True&page_number=${pageNumber}&page_size=${limit}`;
    }
    axios
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          console.log(result.data.result);
          setData(result.data.result.data);
          setTotalPages(result.data.result.total_pages);
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getRadio();
  }, []);
  const handleTabChange = (event, newValue) => {
    settabValue(newValue);
    setLoading(true)
    setPageNumber(1)
  };
  useEffect(() => {
    getRadio();
  }, [tabValue,pageNumber]);
  const handleComment = (event) => {
    setComment(event.target.value);
  };
  const getRadioList = (item, i) => {
    const date = getSparseDate(moment('2021-03-17T21:03:55'));
    const bName = [];
    item.branch.map((ii) => bName.push(ii.branch_name));
    const composers = bName.join();
    return (
      <div style={{ marginBottom: '20px' }} key={`${item.id} ${i + 1}`}>
        <AudioPlayerWrapper
          albumName={item.album_name}
          albumComposers={composers.split(', ')}
          src={`${endpoints.orchadio.s3}/${item.files[0]}`}
          timeToStart={getFormattedHrsMnts(date[3], date[4])}
          timedStart={false}
          dateToStart={new Date()}
          duration={item.duration}
          completionPercentage={80}
          completionCallback={() => completionCallback(item.id)}
          completedOnPecentageLimit={(percentage) =>
            completedOnPecentageLimit(item.id, percentage)
          }
          likeHandler={() => likeHandler(item)}
          likesCount={item.likes}
          viewCount={item.views}
          imageSrc={orchidsRadioLogo}
          isLiked={item.is_like}
          radioProgramId={item.id}
        />
      </div>
    );
  };
  return (
    <div className='layout-container-div'>
      <Layout className='layout-container'>
        <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
          <div
            className='message_log_breadcrumb_wrapper'
            style={{ backgroundColor: '#F9F9F9' }}
          >
            {loading ? <Loading message='Loading...' /> : null}
            <CommonBreadcrumbs componentName='Orchadio' />
            <div className={classes.root}>
              <Grid container spacing={3}>
                <div className={classes.tabRoot}>
                  <Tabs
                    indicatorColor='primary'
                    textColor='primary'
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label='simple tabs example'
                  >
                    {tabs.map((tab, index) => (
                      <Tab label={tab} {...a11yProps(index)} />
                    ))}
                  </Tabs>
                  {tabs.map((tab, index) => {
                    return (
                      <TabPanel value={tabValue} index={index}>
                        {data.map((item, index) => (
                          <Grid item xs={12} sm={6}>
                            <Card className={classes.mobroot}>
                              <CardHeader
                                avatar={
                                  <img
                                    src={orchidsRadioLogo}
                                    alt='not Found'
                                    width='50px'
                                    style={{
                                      float: 'left',
                                      borderRadius: '60px',
                                      backgroundColor: 'white',
                                    }}
                                  />
                                }
                                title={(
                                  <Typography align='center'>
                                    ORCHADIO
                                  </Typography>
                                )}
                              />
                              <CardContent>{getRadioList(item, index)}</CardContent>

                              <CardActions disableSpacing>
                                <Tooltip title='Like'>
                                  <IconButton
                                    id={index}
                                    className={
                                      index % 2 === 0
                                        ? classes.iconsColorPrimary
                                        : classes.iconsColorSecondary
                                    }
                                    onClick={() => likeHandler(item)}
                                  >
                                    <Typography
                                      variant='body2'
                                      style={{ marginRight: 5 }}
                                    >
                                      {item.likes}
                                    </Typography>
                                    {item.is_like === true ? (
                                      <LikeIcon color='secondary' />
                                    ) : (
                                      <UnlikeIcon />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title='Like'>
                                  <IconButton
                                    id={index}
                                    className={
                                      index % 2 === 0
                                        ? classes.iconsColorPrimary
                                        : classes.iconsColorSecondary
                                    }
                                    onClick={() => likeHandler(item)}
                                  >
                                    <Typography
                                      variant='body2'
                                      style={{ marginRight: 5 }}
                                    >
                                      {item.views}
                                    </Typography>
                                    <PersonIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title='Like'>
                                  <IconButton
                                    className={
                                      index % 2 === 0
                                        ? classes.iconsColorPrimary
                                        : classes.iconsColorSecondary
                                    }
                                  >
                                    <Typography
                                      variant='body2'
                                      style={{ marginRight: 5 }}
                                    >
                                      {item.comments_list.length}
                                    </Typography>
                                    <CommentIcon />
                                  </IconButton>
                                </Tooltip>
                                <IconButton
                                  key={item.id}
                                  id={index}
                                  className={clsx(classes.expand, {
                                    [classes.expandOpen]: expanded,
                                  })}
                                  onClick={() => handleExpandClick(index)}
                                  aria-expanded={expanded}
                                  aria-label='show more'
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                              </CardActions>
                              {index === collapseId ? (
                                <Collapse
                                  id={index}
                                  in={expanded}
                                  timeout='auto'
                                  unmountOnExit
                                >
                                  <CardContent>
                                    <Grid item xs={12}>
                                      <TextField
                                        id='outlined-multiline-flexible'
                                        label='Enter your Comment'
                                        multiline
                                        size='small'
                                        rowsMax={4}
                                        style={{ marginBottom: '10px', width: '90%' }}
                                        value={comment}
                                        onChange={handleComment}
                                        variant='outlined'
                                        InputProps={{
                                          startAdornment: (
                                            <Chip
                                              avatar={<Avatar>{name.charAt(0)}</Avatar>}
                                              label={name}
                                            />
                                          ),
                                        }}
                                      />
                                      <Button
                                        style={{ margin: 10 }}
                                        size='small'
                                        onClick={() => commentValidate(item)}
                                      >
                                        Post
                                      </Button>
                                      {item.comments_list.map((c) => (
                                        <div className="commentArea" >
                                 
                                        <Card className={classes.comment}  >
                                        <Chip
                                              avatar={<Avatar>{c?.user__first_name?.charAt(0)}</Avatar>}
                                              label={c.user__first_name}
                                              className={classes.commenter}
                                            />
                                          <Typography>{c.comment}</Typography>
                                        </Card>
                                        </div>
                                      ))}
                                    </Grid>
                                  </CardContent>
                                </Collapse>
                              ) : (
                                ''
                              )}
                            </Card>
                          </Grid>
                        ))}
                      </TabPanel>
                    );
                  })}
                     <Grid container justify='center'>
                    {data && !loading && <Pagination 
                      onChange={handlePagination}
                      count = {totalPages}
                      color='primary'
                      page={pageNumber}
                    />}
              </Grid>
                </div>
              </Grid>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ViewOrchadioMobile;
