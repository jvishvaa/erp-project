import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import './publications.scss';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import FilterImage from '../../assets/images/Filter_Icon.svg';
import LineImage from '../../assets/images/line.svg';
import { connect, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Layout from '../Layout/index';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import OpenPublication from './OpenPublication';
import MediaQuery from 'react-responsive';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import {
  DialogActions,
  Grid,
  ButtonBase,
  Paper,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import ClearIcon from '../../components/icon/ClearIcon';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import './publications.scss';
import { Pagination } from '@material-ui/lab';

import AddPublication from './AddPublication';
import PublicationPreview from './PublicationPreview';
import Nodata from '../../assets/images/not-found.png';
import PublishIcon from '@material-ui/icons/Publish';
import filterImage2 from '../../assets/images/unfiltered.svg';
import Loading from '../../components/loader/loader';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginLeft: '6%',
    marginTop: '2%',
  },
  paperMar: {
    marginLeft: '2%',
    marginTop: '2%',
    width: '382px',
    height: '237px',
    borderRadius: '20px',
  },
  paperMar1: {
    width: '279px',
    height: ' 463px',
    margin: '10%',

    borderRadius: '20px',
  },

  paperMar3: {
    marginLeft: '2%',
    marginTop: '5%',
    width: '280px',
    height: '167px',
    borderRadius: '20px',
  },
  dividers: {
    '& hr': {
      margin: theme.spacing(0, 3),
    },
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
  },

  content: {
    flex: '1 0 auto',
  },
  image: {
    width: '170px',
    height: '217px',
    borderRadius: '10px',
    display: 'block',
    margin: '2%',
  },
  image1: {
    width: '259px',
    height: '306px',
    borderRadius: '10px',
    display: 'block',
    margin: '2%',
  },

  image2: {
    width: '120px',
    height: '157px',
    borderRadius: '10px',
    display: 'block',
    margin: '2%',
  },
  cover: {
    width: 130,
    height: 300,
    borderRadius: '10px',
    objectFit: 'cover',
  },
  cardstyle: {
    display: 'flex',
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    padding: '1rem',
    width: 400,
    height: 350,
    borderRadius: '10px',

    margin: '20px',
  },
  paperSize: {
    width: '382px',
    height: '237px',
    borderRadius: '10px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const StyledClearButton = withStyles({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    height: '42px',
    marginTop: 'auto',
  },
})(Button);
const StyledButton = withStyles({
  root: {
    color: '#014B7E',
    marginLeft: '50px',
    fontSize: '16px',
    fontFamily: 'Raleway',
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
  },
  iconSize: {},
})(Button);

const StyledFilterButton = withStyles((theme)=>({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
    padding: '12px 40px',
    marginLeft: '20px',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  startIcon: {
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
  },
}))(Button);

const Publications = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);

  const [mainsubject, setMainsubject] = React.useState([]);

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [Filter, setFilter] = useState(true);
  //  const [counter, setCounter] = useState(3);

  // extra
  const [dataMap, setDataMap] = useState([]);
  const [acadamicYearID, setAcadamicYear] = useState(
    useSelector((state) => state.commonFilterReducer?.selectedYear)
  );

  const [subjectID, setSubjectID] = useState('Select Subject');
  const [counter, setCounter] = useState(2);
  const [academicYear, setAcadamicYearName] = useState(
    useSelector((state) => state.commonFilterReducer?.selectedYear?.session_year)
  );
  const [id, setId] = useState();

  const [individualData, setIndividualData] = useState();
  const [readFlag, setReadFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [readID, setReadID] = useState();
  const [goBackFlag, setGoBackFlag] = useState(false);
  const [dataDraft, setDataDraft] = useState();
  const [reviewData, setReviewData] = useState();

  const [reviewDataPut, setReviewDataPut] = useState('Review');
  const [publishDataPut, setPublishDataPut] = useState('Published');

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [subjectChanger, setSubjectChanger] = useState('');
  const [changer, setChanger] = useState(true);
  const [changer2, setChanger2] = useState(true);
  const [changer3, setChanger3] = useState(true);
  const [changer4, setChanger4] = useState(true);
  const [changer5, setChanger5] = useState(true);
  const [theSubjectId, setTheSubjectId] = useState();
  //pagination
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);
  const [totalPages2, setTotalPages2] = useState(0);
  const [totalPages3, setTotalPages3] = useState(0);
  const [totalPages4, setTotalPages4] = useState(0);
  const [totalPages5, setTotalPages5] = useState(0);
  const formData = new FormData();
  const [did, setDid] = useState();
  const [dsubject, setDsubject] = useState();
  const [dialPublish, setDialPublish] = useState();
  const [dialReview, setDialReview] = useState();
  const [filterPage, setFilterPage] = useState(false);
  const handlePagination = (event, page) => {
    setPage(page);
    console.log('The page number:', page);

    handleSubjectID(subjectChanger, page);
    handleAlldata(page);
  };
  const handleClickOpen1 = (did, dsubject) => {
    setOpen1(true);
    setDid(did);
    setDsubject(dsubject);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleClickOpen2 = (dialPublish) => {
    setOpen2(true);
    setDialPublish(dialPublish);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClickOpen3 = (dialReview) => {
    setOpen3(true);
    setDialReview(dialReview);
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  const handleclear = () => {
    const newPage = 1;
    setFilterPage(false);
    setMainsubject('');
    setPage(1);
    setReviewData('');
    setIndividualData('');
    setDataDraft('');
    handleAlldata(newPage);
    setSubjectID('Select Subject');
  };

  const handleRead = (value) => {
    setReadID(value);
    setTableFlag(false);
    setReadFlag(true);
  };

  const RemoveLocalData = () => {
    localStorage.removeItem('title');
    localStorage.removeItem('image');
    localStorage.removeItem('author');
    localStorage.removeItem('book_type');
    localStorage.removeItem('description');
    localStorage.removeItem('subjects_local');
    localStorage.removeItem('grade');
    localStorage.removeItem('zone');
    localStorage.removeItem('branch');
  };
  const handleGoBackPre = () => {
    setTableFlag(true);
    setEditFlag(false);
    setPage(1);
    setGoBackFlag(!goBackFlag);
    setReviewData('');
    setIndividualData('');
    setDataDraft('');
    handleAlldata(page);
    setSubjectID('Select Subject');
  };
  const handleGoBackPre1 = () => {
    setTableFlag(true);
    setEditFlag(false);
    setPage(1);
    setGoBackFlag(!goBackFlag);
  };

  const handleAdd = (value) => {
    setTableFlag(false);
    setEditFlag(true);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 450);
  }, [goBackFlag]);

  const filterForAllData = (theSubjectId, page) => {
    if (!mainsubject) {
      setAlert('error', 'Select Subject');
      return;
    }
    setFilterPage(true);
    handleSubjectID(theSubjectId, page);
    handleAllSubjectData(theSubjectId, page);

    handleDraftSubjectId(theSubjectId, page);
    handleReviewSubjectId(theSubjectId, page);
  };
  const handleSubjectID = (value, page) => {
    setSubjectChanger(value);

    setLoading(true);
    axiosInstance
      .get(
        `${
          endpoints.publish.ebook
        }?subject_id=${value}&status_post=Published&page_number=${page}&page_size=${8}`
      )
      .then((res) => {
        if (res.data.total_pages === 0) {
          setChanger4(false);
        } else if (res.data.status_code === 200) {
          // setAlert('success', res.data.message);
          setTotalPages4(res.data.total_pages);
          setIndividualData(res.data.data);
          setChanger4(true);
          setLoading(false);
        } else {
          setAlert('error', res.data.message);
          setLoading(false);
        }
      });
  };
  const handleAllSubjectData = (value, pageNumber) => {
    setLoading(true);
    axiosInstance
      .get(
        `${
          endpoints.publish.ebook
        }?subject_id=${value}&page_number=${pageNumber}&page_size=${8}`
      )
      .then((res) => {
        if (res.data.total_pages === 0) {
          setChanger5(false);
          setData('');
          setLoading(false);
        } else if (res.data.status_code === 200) {
          // setAlert('success', res.data.message);
          setTotalPages5(res.data.total_pages);
          setData(res.data.data);
          setChanger5(true);
          setLoading(false);
        } else {
          setAlert('error', res.data.message);
          setData('');
          setLoading(false);
        }
      });
  };
  const handleDraftSubjectId = (value, pageNumber) => {
    setLoading(true);
    axiosInstance
      .get(
        `${
          endpoints.publish.ebook
        }?subject_id=${value}&status_post=Draft&page_number=${pageNumber}&page_size=${8}`
      )
      .then((res) => {
        if (res.data.total_pages === 0) {
          setChanger2(false);
          setLoading(false);
        } else if (res.data.status_code === 200) {
          // setAlert('success', res.data.message);
          setTotalPages2(res.data.total_pages);
          setDataDraft(res.data.data);
          setLoading(false);
          setChanger2(true);
        } else {
          setAlert('error', res.data.message);
          setDataDraft('');
          setTotalPages2('');
          setLoading(false);
        }
      });
  };

  const handleReviewStatus = (value) => {
    formData.append('status_post', reviewDataPut);
    setLoading(true);
    axiosInstance
      .put(`${endpoints.publish.update_delete}?publication_id=${value}`, formData)

      .then((result) => {
        console.log('the new subject', theSubjectId);
        if (result.data.status_code === 200) {
          // setAlert('success', result.data.message);
          filterForAllData(theSubjectId, page);
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  };
  const handleReviewSubjectId = (value, pageNumber) => {
    setLoading(true);
    axiosInstance
      .get(
        `${
          endpoints.publish.ebook
        }?subject_id=${value}&status_post=Review&page_number=${pageNumber}&page_size=${8}`
      )
      .then((res) => {
        if (res.data.total_pages === 0) {
          setChanger3(false);
          setLoading(false);
        } else if (res.data.status_code === 200) {
          // setAlert('success', res.data.message);
          setTotalPages3(res.data.total_pages);
          setReviewData(res.data.data);
          setChanger3(true);
          setLoading(false);
        } else {
          setAlert('error', res.data.message);
          setLoading(false);
        }
      });
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePublish = (value) => {
    formData.append('status_post', publishDataPut);
    setLoading(true);
    axiosInstance
      .put(`${endpoints.publish.update_delete}?publication_id=${value}`, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          // setAlert('success', result.data.message);
          filterForAllData(theSubjectId, page);
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  };
  const handleChangeMultiple = (event) => {
    const { options } = event.target;

    const value = [];
    for (
      let noOfOption = 0, length = options.length;
      noOfOption < length;
      noOfOption += 1
    ) {
      if (options[noOfOption].selected) {
        value.push(options[noOfOption].value);
      }
    }
    // if (counter === 1) {
    //   setAcadamicYear(value);
    // }

    if (counter === 2) {
      setSubjectID(value);
    }
  };

  useEffect(() => {
    callingAPI();
  }, [counter]);
  const callingAPI = () => {
    // if (counter === 1) {
    //   callingAcadamicAPI();
    // }

    if (counter === 2) {
      callingSubjectAPI(id);
    }
  };

  const callingSubjectAPI = (id) => {
    // console.log('The subject id:', id);
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.userManagement.subjectName}?academic_year_id=${acadamicYearID?.id}`
      )
      .then((res) => {
        // console.log('data Api:', res.data.data);
        if (acadamicYearID?.id) {
          setMainsubject(res.data.data);
          setLoading(false);
        } else {
          setMainsubject('');
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  // const callingAcadamicAPI = () => {
  //   setLoading(true);
  //   //   axiosInstance
  //   //     .get(endpoints.userManagement.academicYear)
  //   //     .then((res) => {
  //   //       setDataMap(res.data.data);
  //   //       setLoading(false);
  //   //     })
  //   //     .catch((error) => {
  //   //       setLoading(false);
  //   //     });
  // };

  const handleCounter = (value) => {
    if (value === 'back' && counter > 1) {
      setCounter(counter - 1);
    }
    if (value === 'forward' && counter < 4) {
      setCounter(counter + 1);
    }
  };
  const handleAlldata = (page) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.publish.ebook}?page_number=${page}&page_size=${8}`)
      .then((res) => {
        if (res.data.total_pages === 0) {
          setChanger(false);
          setData('');
          setLoading(false);
        } else if (res.data.status_code === 200) {
          // setAlert('success', res.data.message);
          setTotalPages(res.data.total_pages);
          setData(res.data.data);
          setChanger(true);
          setLoading(false);
        } else {
          setAlert('error', res.data.message);
          setData('');
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    handleAlldata(page);
  }, []);
  const classes = useStyles();
  const theme = useTheme();
  const handleDelete = (value, subjectId) => {
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.publish.update_delete}?publication_id=${value}`)
      .then((result) => {
        if (result.data.status_code === 200 && subjectId === theSubjectId) {
          setAlert('success', result.data.message);
          handleSubjectID(subjectId, page);
          handleAllSubjectData(subjectId, page);

          handleDraftSubjectId(subjectId, page);
          handleReviewSubjectId(subjectId, page);

          setLoading(false);
        } else if (result.data.status_code === 200) {
          handleAlldata(page);

          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  };

  const [value, setValue] = React.useState(0);

  const handleChanger = (event, newValue) => {
    setValue(newValue);
  };

  const Tabpanel1 = (props) => {
    const { children, value, index } = props;
    return <div>{value === index && <>{children}</>}</div>;
  };

  const Post = () => {
    return (
      <>
        <MediaQuery minWidth={1733}>
          {data ? (
            data.map((item, index) => {
              return (
                <div className={classes.paperMar}>
                  {/* {ReactHtmlParser(item.description)} */}
                  <Grid item xs={12}>
                    <Paper elevation={3}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <ButtonBase className={classes.image}>
                            <img
                              className={classes.image}
                              alt='complex'
                              src={item.thumbnail}
                            />
                          </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm container>
                          <Grid item xs container direction='column' spacing={2}>
                            <Grid item xs>
                              <Typography style={{ float: 'right' }}>
                                <IconButton
                                  aria-label='settings'
                                  onClick={() => {
                                    handleClickOpen1(item.id, item.subject);
                                  }}
                                >
                                  <Tooltip title='Delete' arrow>
                                    <MoreHorizIcon />
                                  </Tooltip>
                                </IconButton>
                              </Typography>
                              <Dialog
                                open={open1}
                                onClose={handleClose1}
                                aria-labelledby='alert-dialog-title'
                                aria-describedby='alert-dialog-description'
                              >
                                <DialogTitle id='alert-dialog-title'>
                                  {'Are you sure to delete?'}
                                </DialogTitle>

                                <DialogActions>
                                  <Button variant='contained' onClick={handleClose1} color='primary'>
                                    cancel
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      handleDelete(did, dsubject);
                                      handleClose1();
                                    }}
                                    color='primary'
                                    variant='contained'
                                  >
                                    Delete
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Grid>

                            <Grid item xs>
                              <Typography
                                gutterBottom
                                variant='subtitle1'
                                color='secondary'
                              >
                                <b>{item.title}</b>
                              </Typography>
                              <Typography variant='body2' gutterBottom>
                                Author:{item.author_name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2'>
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </Typography>
                              <Typography variant='body2'>
                                {item.created_at.slice(0, 10)}
                              </Typography>
                              <Typography>
                                <Button
                                  size='small'
                                  type='submit'
                                  color='primary'
                                  style={{ paddingLeft: '50px', paddingRight: '50px' }}
                                  onClick={(e) => {
                                    handleRead(item.id);
                                  }}
                                >
                                  READ
                                </Button>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </div>
              );
            })
          ) : (
            <Grid container direction='row' justify='center' alignItems='center'>
              <img src={Nodata} />
            </Grid>
          )}
        </MediaQuery>
        <MediaQuery minWidth={900} maxWidth={1732}>
          {data ? (
            data.map((item, index) => {
              return (
                <div className={classes.paperMar3}>
                  <Paper elevation={3}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <ButtonBase className={classes.image2}>
                          <img
                            className={classes.image2}
                            alt='complex'
                            src={item.thumbnail}
                          />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} sm container>
                        <Grid item xs container direction='column' spacing={2}>
                          <Grid item xs>
                            <Typography style={{ float: 'right' }}>
                              <IconButton
                                aria-label='settings'
                                onClick={() => {
                                  handleClickOpen1(item.id, item.subject);
                                }}
                              >
                                <Tooltip title='Delete' arrow>
                                  <MoreHorizIcon />
                                </Tooltip>
                              </IconButton>
                            </Typography>
                            <Dialog
                              open={open1}
                              onClose={handleClose1}
                              aria-labelledby='alert-dialog-title'
                              aria-describedby='alert-dialog-description'
                            >
                              <DialogTitle id='alert-dialog-title'>
                                {'Are you sure to delete?'}
                              </DialogTitle>

                              <DialogActions>
                                <Button onClick={handleClose1} color='primary'>
                                  cancel
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    handleDelete(did, dsubject);
                                    handleClose1();
                                  }}
                                  color='primary'
                                  autoFocus
                                >
                                  Delete
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Grid>

                          <Grid item xs className={{ padding: '5%' }}>
                            <Typography
                              gutterBottom
                              variant='subtitle1'
                              color='secondary'
                              className='newmargin'
                            >
                              <b style={{ fontSize: '13px' }}>{item.title}</b>
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                              <span style={{ fontSize: '13px' }}>
                                {' '}
                                Author:
                                {item.author_name}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid item style={{ marginTop: '-30%' }}>
                            <Typography variant='body2'>
                              <span style={{ fontSize: '13px' }}>
                                {' '}
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </span>
                            </Typography>
                            <Typography variant='body2'>
                              <span style={{ fontSize: '13px' }}>
                                {item.created_at.slice(0, 10)}
                              </span>
                            </Typography>
                            <Typography>
                              <Button
                                size='small'
                                type='submit'
                                color='primary'
                                onClick={(e) => {
                                  handleRead(item.id);
                                }}
                              >
                                <span style={{ fontSize: '13px' }}> READ</span>
                              </Button>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              );
            })
          ) : (
            <Grid container direction='row' justify='center' alignItems='center'>
              <img src={Nodata} />
            </Grid>
          )}
        </MediaQuery>
        <MediaQuery maxWidth={899}>
          {data ? (
            data.map((item, index) => {
              return (
                <div className={classes.paperMar1}>
                  {/* {ReactHtmlParser(item.description)} */}
                  <Grid item xs={12} className='arrange'>
                    <Paper elevation={3}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Typography style={{ float: 'right' }}>
                            <IconButton
                              aria-label='settings'
                              onClick={() => {
                                handleClickOpen1(item.id, item.subject);
                              }}
                            >
                              <Tooltip title='Delete' arrow>
                                <MoreHorizIcon />
                              </Tooltip>
                            </IconButton>
                          </Typography>
                          <Dialog
                            open={open1}
                            onClose={handleClose1}
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                          >
                            <DialogTitle id='alert-dialog-title'>
                              {'Are you sure to delete?'}
                            </DialogTitle>

                            <DialogActions>
                              <Button onClick={handleClose1} color='primary'>
                                cancel
                              </Button>
                              <Button
                                onClick={(e) => {
                                  handleDelete(did, dsubject);
                                  handleClose1();
                                }}
                                color='primary'
                                autoFocus
                              >
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                          <ButtonBase className={classes.image1}>
                            <img
                              className={classes.image1}
                              alt='complex'
                              src={item.thumbnail}
                            />
                          </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm container>
                          <Grid
                            item
                            xs
                            container
                            direction='column'
                            spacing={2}
                            style={{ margin: '5%' }}
                          >
                            <Grid item xs>
                              <Typography
                                gutterBottom
                                variant='subtitle1'
                                color='secondary'
                              >
                                <b>{item.title}</b>
                              </Typography>
                              <Typography variant='body2' gutterBottom>
                                Author:{item.author_name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2'>
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </Typography>
                              <Typography variant='body2'>
                                {item.created_at.slice(0, 10)}
                              </Typography>
                              <Typography>
                                <Button
                                  size='small'
                                  type='submit'
                                  color='primary'
                                  style={{ paddingLeft: '50px', paddingRight: '50px' }}
                                  onClick={(e) => {
                                    handleRead(item.id);
                                  }}
                                >
                                  READ
                                </Button>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </div>
              );
            })
          ) : (
            <Grid container direction='row' justify='center' alignItems='center'>
              <img src={Nodata} />
            </Grid>
          )}
        </MediaQuery>
      </>
    );
  };
  const NewDraft = () => {
    return (
      <>
        <MediaQuery minWidth={1733}>
          {dataDraft ? (
            dataDraft.map((item, index) => {
              return (
                <div className={classes.paperMar}>
                  {/* {ReactHtmlParser(item.description)} */}

                  <Paper elevation={3}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <ButtonBase className={classes.image}>
                          <img
                            className={classes.image}
                            alt='complex'
                            src={item.thumbnail}
                          />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} sm container>
                        <Grid item xs container direction='column' spacing={2}>
                          <Grid item xs>
                            <Typography style={{ float: 'right' }}>
                              <IconButton
                                aria-label='settings'
                                onClick={() => {
                                  handleClickOpen1(item.id, item.subject);
                                }}
                              >
                                <Tooltip title='Delete' arrow>
                                  <MoreHorizIcon />
                                </Tooltip>
                              </IconButton>
                            </Typography>
                            <Dialog
                              open={open1}
                              onClose={handleClose1}
                              aria-labelledby='alert-dialog-title'
                              aria-describedby='alert-dialog-description'
                            >
                              <DialogTitle id='alert-dialog-title'>
                                {'Are you sure to delete?'}
                              </DialogTitle>

                              <DialogActions>
                                <Button onClick={handleClose1} color='primary'>
                                  cancel
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    handleDelete(did, dsubject);
                                    handleClose1();
                                  }}
                                  color='primary'
                                  autoFocus
                                >
                                  Delete
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Grid>
                          <Grid item xs>
                            <Typography
                              gutterBottom
                              variant='subtitle1'
                              color='secondary'
                            >
                              <b>{item.title}</b>
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                              Author:{item.author_name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant='body2'>
                              Publication:
                              {item.publication_type === '1' ? 'magazine' : 'newsletter'}
                            </Typography>
                            <Typography variant='body2'>
                              {item.created_at.slice(0, 10)}
                            </Typography>
                            <Typography>
                              <Button
                                size='small'
                                type='submit'
                                color='primary'
                                style={{ paddingLeft: '50px', paddingRight: '50px' }}
                                onClick={(e) => {
                                  handleReviewStatus(item.id);
                                }}
                              >
                                Review
                              </Button>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              );
            })
          ) : (
            <Grid container spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'center', marginTop: '10px' }}
              >
                <img src={filterImage2} alt='crash' height='250px' width='250px' />
                <Typography>Please select the filter to dislpay Publications</Typography>
              </Grid>
            </Grid>
          )}
        </MediaQuery>
        <MediaQuery minWidth={900} maxWidth={1732}>
          {dataDraft ? (
            dataDraft.map((item, index) => {
              return (
                <div className={classes.paperMar3}>
                  <Paper elevation={3}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <ButtonBase className={classes.image2}>
                          <img
                            className={classes.image2}
                            alt='complex'
                            src={item.thumbnail}
                          />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} sm container>
                        <Grid item xs container direction='column' spacing={2}>
                          <Grid item xs>
                            <Typography style={{ float: 'right' }}>
                              <IconButton
                                aria-label='settings'
                                onClick={() => {
                                  handleClickOpen1(item.id, item.subject);
                                }}
                              >
                                <Tooltip title='Delete' arrow>
                                  <MoreHorizIcon />
                                </Tooltip>
                              </IconButton>
                            </Typography>
                            <Dialog
                              open={open1}
                              onClose={handleClose1}
                              aria-labelledby='alert-dialog-title'
                              aria-describedby='alert-dialog-description'
                            >
                              <DialogTitle id='alert-dialog-title'>
                                {'Are you sure to delete?'}
                              </DialogTitle>

                              <DialogActions>
                                <Button onClick={handleClose1} color='primary'>
                                  cancel
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    handleDelete(did, dsubject);
                                    handleClose1();
                                  }}
                                  color='primary'
                                  autoFocus
                                >
                                  Delete
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Grid>

                          <Grid item xs className={{ padding: '5%' }}>
                            <Typography
                              gutterBottom
                              variant='subtitle1'
                              color='secondary'
                              className='newmargin'
                            >
                              <b style={{ fontSize: '13px' }}>{item.title}</b>
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                              <span style={{ fontSize: '13px' }}>
                                {' '}
                                Author:
                                {item.author_name}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid item style={{ marginTop: '-30%' }}>
                            <Typography variant='body2'>
                              <span style={{ fontSize: '13px' }}>
                                {' '}
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </span>
                            </Typography>
                            <Typography variant='body2'>
                              <span style={{ fontSize: '13px' }}>
                                {item.created_at.slice(0, 10)}
                              </span>
                            </Typography>
                            <Typography>
                              <Button
                                size='small'
                                type='submit'
                                color='primary'
                                onClick={(e) => {
                                  handleClickOpen3(item.id);
                                }}
                              >
                                Review
                              </Button>
                            </Typography>
                            <Dialog
                              open={open3}
                              onClose={handleClose3}
                              aria-labelledby='alert-dialog-title'
                              aria-describedby='alert-dialog-description'
                            >
                              <DialogTitle id='alert-dialog-title'>
                                {'Are you sure to Review?'}
                              </DialogTitle>

                              <DialogActions>
                                <Button onClick={handleClose3} color='primary'>
                                  cancel
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    handleReviewStatus(dialReview);
                                    handleClose3();
                                  }}
                                  color='primary'
                                  autoFocus
                                >
                                  Review
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              );
            })
          ) : (
            <Grid container spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'center', marginTop: '10px' }}
              >
                <img src={filterImage2} alt='crash' height='250px' width='250px' />
                <Typography>Please select the filter to dislpay Publications</Typography>
              </Grid>
            </Grid>
          )}
        </MediaQuery>
        <MediaQuery maxWidth={899}>
          {dataDraft ? (
            dataDraft.map((item, index) => {
              return (
                <div className={classes.paperMar1}>
                  {/* {ReactHtmlParser(item.description)} */}
                  <Grid item xs={12} className='arrange'>
                    <Paper elevation={3}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Typography style={{ float: 'right' }}>
                            <IconButton
                              aria-label='settings'
                              onClick={() => {
                                handleClickOpen1(item.id, item.subject);
                              }}
                            >
                              <Tooltip title='Delete' arrow>
                                <MoreHorizIcon />
                              </Tooltip>
                            </IconButton>
                          </Typography>
                          <Dialog
                            open={open1}
                            onClose={handleClose1}
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                          >
                            <DialogTitle id='alert-dialog-title'>
                              {'Are you sure to delete?'}
                            </DialogTitle>

                            <DialogActions>
                              <Button onClick={handleClose1} color='primary'>
                                cancel
                              </Button>
                              <Button
                                onClick={(e) => {
                                  handleDelete(did, dsubject);
                                  handleClose1();
                                }}
                                color='primary'
                                autoFocus
                              >
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                          <ButtonBase className={classes.image1}>
                            <img
                              className={classes.image1}
                              alt='complex'
                              src={item.thumbnail}
                            />
                          </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm container>
                          <Grid
                            item
                            xs
                            container
                            direction='column'
                            spacing={2}
                            style={{ margin: '5%' }}
                          >
                            <Grid item xs>
                              <Typography
                                gutterBottom
                                variant='subtitle1'
                                color='secondary'
                              >
                                <b>{item.title}</b>
                              </Typography>
                              <Typography variant='body2' gutterBottom>
                                Author:{item.author_name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2'>
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </Typography>
                              <Typography variant='body2'>
                                {item.created_at.slice(0, 10)}
                              </Typography>
                              <Typography>
                                <Button
                                  size='small'
                                  type='submit'
                                  color='primary'
                                  style={{ paddingLeft: '50px', paddingRight: '50px' }}
                                  onClick={(e) => {
                                    handleReviewStatus(item.id);
                                  }}
                                >
                                  Review
                                </Button>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </div>
              );
            })
          ) : (
            <Grid container spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'center', marginTop: '10px' }}
              >
                <img src={filterImage2} alt='crash' height='250px' width='250px' />
                <Typography>Please select the filter to dislpay Publications</Typography>
              </Grid>
            </Grid>
          )}
        </MediaQuery>
      </>
    );
  };

  const IndividualPost = () => {
    return (
      <>
        <MediaQuery minWidth={1733}>
          {individualData ? (
            individualData.map((item, index) => {
              return (
                <div className={classes.paperMar}>
                  {/* {ReactHtmlParser(item.description)} */}
                  <Grid item xs={12}>
                    <Paper elevation={3}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <ButtonBase className={classes.image}>
                            <img
                              className={classes.image}
                              alt='complex'
                              src={item.thumbnail}
                            />
                          </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm container>
                          <Grid item xs container direction='column' spacing={2}>
                            <Grid item xs>
                              <Typography style={{ float: 'right' }}>
                                <IconButton
                                  aria-label='settings'
                                  onClick={() => {
                                    handleClickOpen1(item.id, item.subject);
                                  }}
                                >
                                  <Tooltip title='Delete' arrow>
                                    <MoreHorizIcon />
                                  </Tooltip>
                                </IconButton>
                              </Typography>
                              <Dialog
                                open={open1}
                                onClose={handleClose1}
                                aria-labelledby='alert-dialog-title'
                                aria-describedby='alert-dialog-description'
                              >
                                <DialogTitle id='alert-dialog-title'>
                                  {'Are you sure to delete?'}
                                </DialogTitle>

                                <DialogActions>
                                  <Button onClick={handleClose1} color='primary'>
                                    cancel
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      handleDelete(did, dsubject);
                                      handleClose1();
                                    }}
                                    color='primary'
                                    autoFocus
                                  >
                                    Delete
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Grid>
                            <Grid item xs>
                              <Typography
                                gutterBottom
                                variant='subtitle1'
                                color='secondary'
                              >
                                <b>{item.title}</b>
                              </Typography>
                              <Typography variant='body2' gutterBottom>
                                Author:{item.author_name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2'>
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </Typography>
                              <Typography variant='body2'>
                                {item.created_at.slice(0, 10)}
                              </Typography>
                              <Typography>
                                <Button
                                  size='small'
                                  type='submit'
                                  color='primary'
                                  style={{ paddingLeft: '50px', paddingRight: '50px' }}
                                  onClick={(e) => {
                                    handleRead(item.id);
                                  }}
                                >
                                  READ
                                </Button>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </div>
              );
            })
          ) : (
            <Grid container spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'center', marginTop: '10px' }}
              >
                <img src={filterImage2} alt='crash' height='250px' width='250px' />
                <Typography>Please select the filter to dislpay Publications</Typography>
              </Grid>
            </Grid>
          )}
        </MediaQuery>
        <MediaQuery minWidth={900} maxWidth={1732}>
          {individualData ? (
            individualData.map((item, index) => {
              return (
                <div className={classes.paperMar3}>
                  <Paper elevation={3}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <ButtonBase className={classes.image2}>
                          <img
                            className={classes.image2}
                            alt='complex'
                            src={item.thumbnail}
                          />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} sm container>
                        <Grid item xs container direction='column' spacing={2}>
                          <Grid item xs>
                            <Typography style={{ float: 'right' }}>
                              <IconButton
                                aria-label='settings'
                                onClick={() => {
                                  handleClickOpen1(item.id, item.subject);
                                }}
                              >
                                <Tooltip title='Delete' arrow>
                                  <MoreHorizIcon />
                                </Tooltip>
                              </IconButton>
                            </Typography>
                            <Dialog
                              open={open1}
                              onClose={handleClose1}
                              aria-labelledby='alert-dialog-title'
                              aria-describedby='alert-dialog-description'
                            >
                              <DialogTitle id='alert-dialog-title'>
                                {'Are you sure to delete?'}
                              </DialogTitle>

                              <DialogActions>
                                <Button onClick={handleClose1} color='primary'>
                                  cancel
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    handleDelete(did, dsubject);
                                    handleClose1();
                                  }}
                                  color='primary'
                                  autoFocus
                                >
                                  Delete
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Grid>

                          <Grid item xs className={{ padding: '5%' }}>
                            <Typography
                              gutterBottom
                              variant='subtitle1'
                              color='secondary'
                              className='newmargin'
                            >
                              <b style={{ fontSize: '13px' }}>{item.title}</b>
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                              <span style={{ fontSize: '13px' }}>
                                {' '}
                                Author:
                                {item.author_name}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid item style={{ marginTop: '-30%' }}>
                            <Typography variant='body2'>
                              <span style={{ fontSize: '13px' }}>
                                {' '}
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </span>
                            </Typography>
                            <Typography variant='body2'>
                              <span style={{ fontSize: '13px' }}>
                                {item.created_at.slice(0, 10)}
                              </span>
                            </Typography>
                            <Typography>
                              <Button
                                size='small'
                                type='submit'
                                color='primary'
                                onClick={(e) => {
                                  handleRead(item.id);
                                }}
                              >
                                READ
                              </Button>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              );
            })
          ) : (
            <Grid container spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'center', marginTop: '10px' }}
              >
                <img src={filterImage2} alt='crash' height='250px' width='250px' />
                <Typography>Please select the filter to dislpay Publications</Typography>
              </Grid>
            </Grid>
          )}
        </MediaQuery>
        <MediaQuery maxWidth={899}>
          {individualData ? (
            individualData.map((item, index) => {
              return (
                <div className={classes.paperMar1}>
                  {/* {ReactHtmlParser(item.description)} */}
                  <Grid item xs={12} className='arrange'>
                    <Paper elevation={3}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Typography style={{ float: 'right' }}>
                            <IconButton
                              aria-label='settings'
                              onClick={() => {
                                handleClickOpen1(item.id, item.subject);
                              }}
                            >
                              <Tooltip title='Delete' arrow>
                                <MoreHorizIcon />
                              </Tooltip>
                            </IconButton>
                          </Typography>
                          <Dialog
                            open={open1}
                            onClose={handleClose1}
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                          >
                            <DialogTitle id='alert-dialog-title'>
                              {'Are you sure to delete?'}
                            </DialogTitle>

                            <DialogActions>
                              <Button onClick={handleClose1} color='primary'>
                                cancel
                              </Button>
                              <Button
                                onClick={(e) => {
                                  handleDelete(did, dsubject);
                                  handleClose1();
                                }}
                                color='primary'
                                autoFocus
                              >
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                          <ButtonBase className={classes.image1}>
                            <img
                              className={classes.image1}
                              alt='complex'
                              src={item.thumbnail}
                            />
                          </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm container>
                          <Grid
                            item
                            xs
                            container
                            direction='column'
                            spacing={2}
                            style={{ margin: '5%' }}
                          >
                            <Grid item xs>
                              <Typography
                                gutterBottom
                                variant='subtitle1'
                                color='secondary'
                              >
                                <b>{item.title}</b>
                              </Typography>
                              <Typography variant='body2' gutterBottom>
                                Author:{item.author_name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2'>
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </Typography>
                              <Typography variant='body2'>
                                {item.created_at.slice(0, 10)}
                              </Typography>
                              <Typography>
                                <Button
                                  size='small'
                                  type='submit'
                                  color='primary'
                                  style={{ paddingLeft: '50px', paddingRight: '50px' }}
                                  onClick={(e) => {
                                    handleRead(item.id);
                                  }}
                                >
                                  READ
                                </Button>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </div>
              );
            })
          ) : (
            <Grid container spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'center', marginTop: '10px' }}
              >
                <img src={filterImage2} alt='crash' height='250px' width='250px' />
                <Typography>Please select the filter to dislpay Publications</Typography>
              </Grid>
            </Grid>
          )}
        </MediaQuery>
      </>
    );
  };

  const ReviewPost = () => {
    return (
      <>
        <MediaQuery minWidth={1733}>
          {reviewData ? (
            reviewData.map((item, index) => {
              return (
                <div className={classes.paperMar}>
                  {/* {ReactHtmlParser(item.description)} */}
                  <Grid item xs={12}>
                    <Paper elevation={3}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <ButtonBase className={classes.image}>
                            <img
                              className={classes.image}
                              alt='complex'
                              src={item.thumbnail}
                            />
                          </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm container>
                          <Grid item xs container direction='column' spacing={2}>
                            <Grid item xs>
                              <Typography style={{ float: 'right' }}>
                                <IconButton
                                  aria-label='settings'
                                  onClick={() => {
                                    handleClickOpen1(item.id, item.subject);
                                  }}
                                >
                                  <Tooltip title='Delete' arrow>
                                    <MoreHorizIcon />
                                  </Tooltip>
                                </IconButton>
                              </Typography>
                              <Dialog
                                open={open1}
                                onClose={handleClose1}
                                aria-labelledby='alert-dialog-title'
                                aria-describedby='alert-dialog-description'
                              >
                                <DialogTitle id='alert-dialog-title'>
                                  {'Are you sure to delete?'}
                                </DialogTitle>

                                <DialogActions>
                                  <Button onClick={handleClose1} color='primary'>
                                    cancel
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      handleDelete(did, dsubject);
                                      handleClose1();
                                    }}
                                    color='primary'
                                    autoFocus
                                  >
                                    Delete
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Grid>
                            <Grid item xs>
                              <Typography
                                gutterBottom
                                variant='subtitle1'
                                color='secondary'
                              >
                                <b>{item.title}</b>
                              </Typography>
                              <Typography variant='body2' gutterBottom>
                                Author:{item.author_name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2'>
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </Typography>
                              <Typography variant='body2'>
                                {item.created_at.slice(0, 10)}
                              </Typography>
                              <Typography>
                                <Button
                                  size='small'
                                  type='submit'
                                  style={{ margin: '2%' }}
                                  onClick={(e) => {
                                    handleRead(item.id);
                                  }}
                                >
                                  READ
                                </Button>
                                <Button
                                  size='small'
                                  type='submit'
                                  onClick={(e) => {
                                    handlePublish(item.id);
                                  }}
                                >
                                  Publish
                                </Button>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </div>
              );
            })
          ) : (
            <Grid container spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'center', marginTop: '10px' }}
              >
                <img src={filterImage2} alt='crash' height='250px' width='250px' />
                <Typography>Please select the filter to dislpay Publications </Typography>
              </Grid>
            </Grid>
          )}
        </MediaQuery>
        <MediaQuery minWidth={900} maxWidth={1732}>
          {reviewData ? (
            reviewData.map((item, index) => {
              return (
                <div className={classes.paperMar3}>
                  <Paper elevation={3}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <ButtonBase className={classes.image2}>
                          <img
                            className={classes.image2}
                            alt='complex'
                            src={item.thumbnail}
                          />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} sm container>
                        <Grid item xs container direction='column' spacing={2}>
                          <Grid item xs>
                            <Typography style={{ float: 'right' }}>
                              <IconButton
                                aria-label='settings'
                                onClick={() => {
                                  handleClickOpen1(item.id, item.subject);
                                }}
                              >
                                <Tooltip title='Delete' arrow>
                                  <MoreHorizIcon />
                                </Tooltip>
                              </IconButton>
                            </Typography>
                            <Dialog
                              open={open1}
                              onClose={handleClose1}
                              aria-labelledby='alert-dialog-title'
                              aria-describedby='alert-dialog-description'
                            >
                              <DialogTitle id='alert-dialog-title'>
                                {'Are you sure to delete?'}
                              </DialogTitle>

                              <DialogActions>
                                <Button onClick={handleClose1} color='primary'>
                                  cancel
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    handleDelete(did, dsubject);
                                    handleClose1();
                                  }}
                                  color='primary'
                                  autoFocus
                                >
                                  Delete
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Grid>

                          <Grid item xs className={{ padding: '5%' }}>
                            <Typography
                              gutterBottom
                              variant='subtitle1'
                              color='secondary'
                              className='newmargin'
                            >
                              <b style={{ fontSize: '13px' }}>{item.title}</b>
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                              <span style={{ fontSize: '13px' }}>
                                {' '}
                                Author:
                                {item.author_name}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid item style={{ marginTop: '-30%' }}>
                            <Typography variant='body2'>
                              <span style={{ fontSize: '13px' }}>
                                {' '}
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </span>
                            </Typography>
                            <Typography variant='body2'>
                              <span style={{ fontSize: '13px' }}>
                                {item.created_at.slice(0, 10)}
                              </span>
                            </Typography>
                            <Typography>
                              <button
                                type='submit'
                                style={{ margin: '2%', color: '#ff6b6b' }}
                                onClick={(e) => {
                                  handleRead(item.id);
                                }}
                              >
                                <span style={{ fontSize: '18px', color: '#ff6b6b' }}>
                                  <ImportContactsIcon />
                                </span>
                              </button>

                              <button
                                type='submit'
                                style={{ margin: '2%', color: '#ff6b6b' }}
                                onClick={() => {
                                  handleClickOpen2(item.id);
                                }}
                              >
                                <span style={{ fontSize: '18px', color: '#ff6b6b' }}>
                                  <PublishIcon />
                                </span>
                              </button>
                            </Typography>
                            <Dialog
                              open={open2}
                              onClose={handleClose2}
                              aria-labelledby='alert-dialog-title'
                              aria-describedby='alert-dialog-description'
                            >
                              <DialogTitle id='alert-dialog-title'>
                                {'Are you sure to Publish?'}
                              </DialogTitle>

                              <DialogActions>
                                <Button onClick={handleClose2} color='primary'>
                                  cancel
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    handlePublish(dialPublish);
                                    handleClose2();
                                  }}
                                  color='primary'
                                  autoFocus
                                >
                                  Publish
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              );
            })
          ) : (
            <Grid container spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'center', marginTop: '10px' }}
              >
                <img src={filterImage2} alt='crash' height='250px' width='250px' />
                <Typography>Please select the filter to dislpay Publications</Typography>
              </Grid>
            </Grid>
          )}
        </MediaQuery>

        <MediaQuery maxWidth={899}>
          {reviewData ? (
            reviewData.map((item, index) => {
              return (
                <div className={classes.paperMar1}>
                  {/* {ReactHtmlParser(item.description)} */}
                  <Grid item xs={12} className='arrange'>
                    <Paper elevation={3}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Typography style={{ float: 'right' }}>
                            <IconButton
                              aria-label='settings'
                              onClick={() => {
                                handleClickOpen1(item.id, item.subject);
                              }}
                            >
                              <Tooltip title='Delete' arrow>
                                <MoreHorizIcon />
                              </Tooltip>
                            </IconButton>
                          </Typography>
                          <Dialog
                            open={open1}
                            onClose={handleClose1}
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                          >
                            <DialogTitle id='alert-dialog-title'>
                              {'Are you sure to delete?'}
                            </DialogTitle>

                            <DialogActions>
                              <Button onClick={handleClose1} color='primary'>
                                cancel
                              </Button>
                              <Button
                                onClick={(e) => {
                                  handleDelete(did, dsubject);
                                  handleClose1();
                                }}
                                color='primary'
                                autoFocus
                              >
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                          <ButtonBase className={classes.image1}>
                            <img
                              className={classes.image1}
                              alt='complex'
                              src={item.thumbnail}
                            />
                          </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm container>
                          <Grid
                            item
                            xs
                            container
                            direction='column'
                            spacing={2}
                            style={{ margin: '5%' }}
                          >
                            <Grid item xs>
                              <Typography
                                gutterBottom
                                variant='subtitle1'
                                color='secondary'
                              >
                                <b>{item.title}</b>
                              </Typography>
                              <Typography variant='body2' gutterBottom>
                                Author:{item.author_name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2'>
                                Publication:
                                {item.publication_type === '1'
                                  ? 'magazine'
                                  : 'newsletter'}
                              </Typography>
                              <Typography variant='body2'>
                                {item.created_at.slice(0, 10)}
                              </Typography>
                              <Typography>
                                <Button
                                  size='small'
                                  type='submit'
                                  color='primary'
                                  style={{ margin: '2%' }}
                                  onClick={(e) => {
                                    handleRead(item.id);
                                  }}
                                >
                                  READ
                                </Button>
                                <Button
                                  size='small'
                                  type='submit'
                                  color='primary'
                                  onClick={(e) => {
                                    handlePublish(item.id);
                                  }}
                                >
                                  Publish
                                </Button>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </div>
              );
            })
          ) : (
            <Grid container spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'center', marginTop: '10px' }}
              >
                <img src={filterImage2} alt='crash' height='250px' width='250px' />
                <Typography>Please select the filter to dislpay Publications</Typography>
              </Grid>
            </Grid>
          )}
        </MediaQuery>
      </>
    );
  };
  const handleFilter = (value) => {
    setFilter(value);
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div style={{ width: '95%', margin: '20px auto' }}>
          <CommonBreadcrumbs
            componentName='Publication'
            childComponentName={
              readFlag && !tableFlag
                ? 'Open Publication'
                : editFlag && !tableFlag
                ? 'Add Publication'
                : null
            }
            isAcademicYearVisible={true}
          />
        </div>

        {!tableFlag && editFlag && (
          <AddPublication
            handleGoBackPre={handleGoBackPre}
            handleGoBackPre1={handleGoBackPre1}
          />
        )}
        {!tableFlag && readFlag && <OpenPublication ID={readID} />}

        {tableFlag && !readFlag && !editFlag && (
          <div>
            <>
              <MediaQuery minWidth={900}>
                {Filter ? (
                  <div className={classes.root}>
                    <div className='upper-table-container'>
                      <Grid className='all-box-container'>
                        <div
                          className={
                            counter === 2
                              ? 'grade-container'
                              : counter === 1
                              ? 'box-right-1'
                              : 'box-last-1'
                          }
                        >
                          {counter === 2 ? (
                            <>
                              <div className='text-fixed'>Subject</div>
                              <div className='inner-grade-container'>
                                <div className='change-grade-options'>
                                  <Select
                                    multiple
                                    fullWidth
                                    native
                                    onChange={handleChangeMultiple}
                                  >
                                    {mainsubject &&
                                      mainsubject.map((name) => (
                                        <option
                                          key={name.id}
                                          value={name.subject__subject_name}
                                          onClick={() => {
                                            setPage(1);
                                            setTheSubjectId(name.subject_id);
                                          }}
                                        >
                                          {name.subject__subject_name}
                                        </option>
                                      ))}
                                  </Select>
                                </div>
                                {/* <div className='text-fixed-last'>
                                  Expand
                                  <IconButton
                                    aria-label='delete'
                                    onClick={() => setCounter(counter - 1)}
                                    size='small'
                                  >
                                    <ArrowBackIcon className='arrow-button' />
                                    <ArrowForwardIcon className='arrow-button' />
                                  </IconButton>
                                </div> */}
                              </div>
                            </>
                          ) : (
                            <label className='text-rotate'>Subject</label>
                          )}
                        </div>
                      </Grid>
                    </div>

                    <span className='marg'>
                      {' '}
                      <StyledClearButton
                        variant='contained'
                        startIcon={<ClearIcon />}
                        onClick={() => handleclear()}
                        style={{ fontSize: '13px' }}
                      >
                        Clear all
                      </StyledClearButton>
                      <StyledFilterButton
                        variant='contained'
                        color='secondary'
                        startIcon={<FilterFilledIcon className={classes.filterIcon} />}
                        className={classes.filterButton}
                        style={{ fontSize: '13px' }}
                        onClick={() => {
                          filterForAllData(theSubjectId, page);
                        }}
                      >
                        filter
                      </StyledFilterButton>
                      <StyledFilterButton
                        variant='contained'
                        className={classes.filterButton}
                        style={{ fontSize: '13px' }}
                        onClick={(e) => {
                          handleAdd();
                          RemoveLocalData();
                        }}
                      >
                        ADD NEW
                      </StyledFilterButton>
                      <div
                        className='filter-container'
                        onClick={() => {
                          handleFilter(false);
                        }}
                      >
                        <div className='filter'>HIDE FILTER</div>
                        <img src={FilterImage} />
                      </div>
                    </span>
                  </div>
                ) : (
                  <>
                    <Grid className='bread-crumb-container' style={{ float: 'right' }}>
                      <Grid
                        className={
                          Filter ? 'filter-container-hidden' : 'filter-container-show'
                        }
                        onClick={() => {
                          handleFilter(true);
                        }}
                      >
                        <Grid className='filter-show'>
                          <div className='filter'>SHOW FILTER</div>
                          <img className='filterImage' src={FilterImage} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
              </MediaQuery>
              <MediaQuery maxWidth={599}>
                {Filter ? (
                  <div className={classes.root} style={{ marginLeft: '-2%' }}>
                    <div className='upper-table-container1'>
                      <Grid className='all-box-container1'>
                        <div
                          className={
                            counter === 2
                              ? 'grade-container1'
                              : counter === 1
                              ? 'box-right-1'
                              : 'box-last-1'
                          }
                        >
                          {counter === 2 ? (
                            <>
                              <div className='text-fixed1'>Subject</div>
                              <div className='inner-grade-container1'>
                                <div className='change-grade-options1'>
                                  <Select
                                    multiple
                                    fullWidth
                                    native
                                    onChange={handleChangeMultiple}
                                  >
                                    {mainsubject &&
                                      mainsubject.map((name) => (
                                        <option
                                          key={name.id}
                                          value={name.subject__subject_name}
                                          onClick={() => {
                                            setPage(1);
                                            setTheSubjectId(name.subject_id);
                                          }}
                                        >
                                          {name.subject__subject_name}
                                        </option>
                                      ))}
                                  </Select>
                                </div>
                                {/* <div className='text-fixed-last1'>
                                  Expand
                                  <IconButton
                                    aria-label='delete'
                                    onClick={() => setCounter(counter - 1)}
                                    size='small'
                                  >
                                    <ArrowBackIcon className='arrow-button1' />
                                    <ArrowForwardIcon className='arrow-button1' />
                                  </IconButton>
                                </div> */}
                              </div>
                            </>
                          ) : (
                            <label className='text-rotate1'>Subject</label>
                          )}
                        </div>
                      </Grid>
                      <div className='stylerow'>
                        <div>
                          <StyledFilterButton
                            variant='contained'
                            color='secondary'
                            style={{ marginLeft: '-5%' }}
                            startIcon={
                              <FilterFilledIcon className={classes.filterIcon} />
                            }
                            className={classes.filterButton}
                            onClick={() => {
                              filterForAllData(theSubjectId, page);
                            }}
                          >
                            filter
                          </StyledFilterButton>
                        </div>

                        <StyledFilterButton
                          variant='contained'
                          color='secondary'
                          style={{ marginLeft: '-1%' }}
                          className={classes.filterButton}
                          onClick={(e) => {
                            handleAdd();
                            RemoveLocalData();
                          }}
                        >
                          ADD NEW
                        </StyledFilterButton>
                        <div
                          className='filter-container'
                          onClick={() => {
                            handleFilter(false);
                          }}
                        >
                          <div className='filter'>HIDE FILTER</div>
                          <img src={FilterImage} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Grid className='bread-crumb-container' style={{ float: 'right' }}>
                      <Grid
                        className={
                          Filter ? 'filter-container-hidden' : 'filter-container-show'
                        }
                        onClick={() => {
                          handleFilter(true);
                        }}
                      >
                        <Grid className='filter-show'>
                          <div className='filter'>SHOW FILTER</div>
                          <img className='filterImage' src={FilterImage} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
              </MediaQuery>
            </>
            <br />
            <Divider />

            <br />
            <Grid container direction='row'>
              <div className='table-top-header'>
                <div className='table-header-data'>{academicYear}</div>
                <span class='dot'></span>
                <div className='table-header-data'>{subjectID}</div>
              </div>
            </Grid>
            <br />
            <Grid item md={12} xs={10}>
              <Tabs
                value={value}
                onChange={handleChanger}
                indicatorColor='primary'
                textColor='primary'
                right
              >
                <Tab
                  label='All'
                  style={{
                    fontFamily: 'Raleway bold',
                    textTransform: 'capitalize',
                  }}
                />
                <Tab
                  label='Draft'
                  style={{
                    fontFamily: 'Raleway bold',
                    textTransform: 'capitalize',
                  }}
                />
                <Tab
                  label='For Review'
                  style={{
                    fontFamily: 'Raleway bold',
                    textTransform: 'capitalize',
                  }}
                />
                <Tab
                  label='Published'
                  style={{
                    fontFamily: 'Raleway bold',
                    textTransform: 'capitalize',
                  }}
                />
              </Tabs>
              <Divider loading={loading} />

              <Tabpanel1 value={value} index={0}>
                {changer ? (
                  <>
                    <Grid container direction='row' spacing={1} className='gridscroll'>
                      <Post />
                    </Grid>
                    {!filterPage && (
                      <Grid
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                      >
                        <Pagination
                          onChange={handlePagination}
                          style={{ marginTop: 25 }}
                          count={totalPages}
                          color='primary'
                          page={page}
                        />
                      </Grid>
                    )}
                    {filterPage && (
                      <Grid
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                      >
                        <Pagination
                          onChange={handlePagination}
                          style={{ marginTop: 25 }}
                          count={totalPages5}
                          color='primary'
                          page={page}
                        />
                      </Grid>
                    )}
                  </>
                ) : (
                  <Grid container direction='row' justify='center' alignItems='center'>
                    <img src={Nodata} />
                  </Grid>
                )}
              </Tabpanel1>
              <Tabpanel1 value={value} index={1}>
                {changer2 ? (
                  <>
                    <Grid container direction='row' spacing={1} className='gridscroll'>
                      <NewDraft />
                    </Grid>
                    {dataDraft && (
                      <Grid
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                      >
                        <Pagination
                          onChange={handlePagination}
                          style={{ marginTop: 25 }}
                          count={totalPages2}
                          color='primary'
                          page={page}
                        />
                      </Grid>
                    )}
                  </>
                ) : (
                  <Grid container direction='row' justify='center' alignItems='center'>
                    <img src={Nodata} />
                  </Grid>
                )}
              </Tabpanel1>

              <Tabpanel1 value={value} index={2}>
                {changer3 ? (
                  <>
                    <Grid container direction='row'>
                      <ReviewPost />
                    </Grid>
                    {reviewData && (
                      <Grid
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                      >
                        <Pagination
                          onChange={handlePagination}
                          style={{ marginTop: 25 }}
                          count={totalPages3}
                          color='primary'
                          page={page}
                        />
                      </Grid>
                    )}
                  </>
                ) : (
                  <Grid container direction='row' justify='center' alignItems='center'>
                    <img src={Nodata} />
                  </Grid>
                )}
              </Tabpanel1>
              <Tabpanel1 value={value} index={3}>
                {changer4 ? (
                  <>
                    <Grid container direction='row' spacing={1} className='space'>
                      <IndividualPost />
                    </Grid>
                    {individualData && (
                      <Grid
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                      >
                        <Pagination
                          onChange={handlePagination}
                          style={{ marginTop: 25 }}
                          count={totalPages4}
                          color='primary'
                          page={page}
                        />
                      </Grid>
                    )}
                  </>
                ) : (
                  <Grid container direction='row' justify='center' alignItems='center'>
                    <img src={Nodata} />
                  </Grid>
                )}
              </Tabpanel1>
            </Grid>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Publications;
