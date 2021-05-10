import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import './publications.scss';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import Card from '@material-ui/core/Card';
import FilterImage from '../../assets/images/Filter_Icon.svg';
import LineImage from '../../assets/images/line.svg';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Layout from '../Layout/index';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import OpenPublication from './OpenPublication';
import EditPublication from './EditPublication';
import MediaQuery from 'react-responsive';
import {
  CardActions,
  CardHeader,
  DialogActions,
  Grid,
  ButtonBase,
  GridList,
  Paper,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import FilterIcon from '../../components/icon/FilterIcon';
import ClearIcon from '../../components/icon/ClearIcon';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import ReactHtmlParser from 'react-html-parser';
import MenuItem from '@material-ui/core/MenuItem';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paginations from './Paginations';
import './publications.scss';
import { Pagination } from '@material-ui/lab';
import { DataGrid } from '@material-ui/data-grid';
import AddPublication from './AddPublication';
import PublicationPreview from './PublicationPreview';
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

const StyledFilterButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
    padding: '12px 40px',
    marginLeft: '20px',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: '#FF6B6B',
    },
  },
  startIcon: {
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
  },
})(Button);

const Publications = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [subject, setSubject] = React.useState('Select Subject');
  const [mainsubject, setMainsubject] = React.useState([]);
  const [branchGet, setBranchGet] = useState();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage] = React.useState(8);
  const [Filter, setFilter] = useState(true);
  //  const [counter, setCounter] = useState(3);

  // extra
  const [dataMap, setDataMap] = useState([]);
  const [acadamicYearID, setAcadamicYear] = useState(1);

  const [subjectID, setSubjectID] = useState('Select Subject');
  const [counter, setCounter] = useState(2);
  const [academicYear, setAcadamicYearName] = useState('Select Acdemic Year');

  const [individualData, setIndividualData] = useState();
  const [readFlag, setReadFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [readID, setReadID] = useState();
  const [goBackFlag, setGoBackFlag] = useState(false);
  const [dataDraft, setDataDraft] = useState();
  const [reviewData, setReviewData] = useState();
  const [getZoneData, setGetZoneData] = useState();

  const [reviewDataPut, setReviewDataPut] = useState('Review');
  const [publishDataPut, setPublishDataPut] = useState('Published');
  const [reviewFlag, setReviewFlag] = useState(false);
  const [pub_id, setPub_id] = useState('');
  const [pub_title, setPub_title] = useState();
  const [pub_subject, setPub_subject] = useState('');
  const [pub_grade, setPub_grade] = useState();
  const [pub_publication_type, setPub_publication_type] = useState();
  const [pub_description, setPub_description] = useState();
  const [pub_thumbnail, setPub_thambnail] = useState();
  const [pub_file, setPub_file] = useState();
  const [pub_author_name, setPub_author_name] = useState();
  const [pub_zone, setPub_zone] = useState();
  const [open1, setOpen1] = React.useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleEdit = (
    id,
    title,
    subject,
    grade,
    publication_type,
    description,
    thumbnail,
    file,
    zone,
    author_name
  ) => {
    console.log("Types:'''", publication_type);
    setPub_id(id);
    setPub_title(title);
    setPub_subject(subject);
    setPub_grade(grade);
    setPub_publication_type(publication_type);
    setPub_description(description);
    setPub_thambnail(thumbnail);
    setPub_file(file);
    setPub_author_name(author_name);
    setPub_zone(zone);

    setTableFlag(false);
    setReviewFlag(true);
  };

  const handleRead = (value) => {
    console.log('valuessss:', value);
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
  };
  const handleGoBackPre = () => {
    setTableFlag(true);
    setEditFlag(false);
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

  const handleSubjectID = (value) => {
    console.log('subjef6tID:', value);
    handleDraftSubjectId(value);
    handleReviewSubjectId(value);
    axiosInstance
      .get(`${endpoints.publish.ebook}?subject_id=${value}&status_post=Published`)
      .then((res) => {
        console.log('getting', res.data.data);
        setIndividualData(res.data.data);
      });
  };
  const handleDraftSubjectId = (value) => {
    axiosInstance
      .get(`${endpoints.publish.ebook}?subject_id=${value}&status_post=Draft`)
      .then((res) => {
        console.log('in axios');
        console.log('response1:', res.data.data);
        setDataDraft(res.data.data);
      });
  };

  const handleZone = (e) => {
    console.log('dataaa', e.target.value);
    setGetZoneData(e.target.value);
  };

  const handleZoneDataGet = () => {
    axiosInstance
      .get(`${endpoints.publish.ebook}?zone=${getZoneData}&status_post=Published`)
      .then((res) => {
        console.log('Zones Data:::', res.data.data);
        setData(res.data.data);
      });
    handleClose();
  };
  const handleReviewStatus = (value) => {
    console.log(value);
    axiosInstance
      .put(`${endpoints.publish.update_delete}?publication_id=${value}`, {
        status_post: reviewDataPut,
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };
  const handleReviewSubjectId = (value) => {
    axiosInstance
      .get(`${endpoints.publish.ebook}?subject_id=${value}&status_post=Review`)
      .then((res) => {
        console.log('in axios');
        console.log('response1:', res.data.data);
        setReviewData(res.data.data);
      });
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFilterData = () => {
    return (
      <>
        <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
          <DialogTitle id='form-dialog-title'>Subscribe</DialogTitle>
          <Select
            labelId='demo-simple-select-outlined-label'
            id='demo-simple-select-outlined'
            name='zone'
            // onChange={handleBranch}

            outlined
            labelWidth={70}
            required
          >
            {branchGet &&
              branchGet.map((options) => {
                return (
                  <MenuItem value={options.id} key={options.id}>
                    {options.branch_name}
                  </MenuItem>
                );
              })}
          </Select>
        </Dialog>
      </>
    );
  };

  const handlePublish = (value) => {
    axiosInstance
      .put(`${endpoints.publish.update_delete}?publication_id=${value}`, {
        status_post: publishDataPut,
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
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
    if (counter === 1) {
      setAcadamicYear(value);
    }

    if (counter === 2) {
      setSubjectID(value);
    }
  };

  useEffect(() => {
    callingAPI();
  }, [counter]);
  const callingAPI = () => {
    if (counter === 1) {
      callingAcadamicAPI();
    }

    if (counter === 2) {
      callingSubjectAPI();
    }
  };

  const callingSubjectAPI = () => {
    axiosInstance
      .get(endpoints.masterManagement.subjects)
      .then((res) => {
        console.log('in axios');
        setDataMap(res.data.result.results);
        console.log('responseer:', res.data.result.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callingAcadamicAPI = () => {
    axiosInstance
      .get('/erp_user/list-academic_year/', {})
      .then((res) => {
        setDataMap(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCounter = (value) => {
    if (value === 'back' && counter > 1) {
      setCounter(counter - 1);
    }
    if (value === 'forward' && counter < 4) {
      setCounter(counter + 1);
    }
  };

  useEffect(() => {
    axiosInstance.get(`${endpoints.publish.ebook}?status_post=Published`).then((res) => {
      console.log('in axios');
      console.log('response1:', res.data.data);
      setData(res.data.data);

      // setLoading(false);
    });
    axiosInstance.get(endpoints.masterManagement.subjects).then((res) => {
      console.log('in axios');
      setMainsubject(res.data.result.results);
      console.log('responser of subject:', res.data.result.results);
    });
    axiosInstance.get(endpoints.academics.branches).then((res) => {
      console.log('Branches', res.data.data);
      setBranchGet(res.data.data);
    });
  }, []);
  const classes = useStyles();
  const theme = useTheme();
  const handleDelete = (value, subjectId) => {
    console.log('valuedelete:', value);

    // setLoading(true);
    axiosInstance
      .delete(`${endpoints.publish.update_delete}?publication_id=${value}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          handleSubjectID(subjectId);
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  const [value, setValue] = React.useState(0);

  const handleChanger = (event, newValue) => {
    setValue(newValue);
  };
  console.log('subje', subject);

  const Tabpanel1 = (props) => {
    const { children, value, index } = props;
    return <div>{value === index && <>{children}</>}</div>;
  };

  const Post = ({ data, loading }) => {
    if (loading) {
      return <h2>Loading...</h2>;
    }

    return (
      <>
        <MediaQuery minWidth={600}>
          {data.map((item, index) => {
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
                                onClick={handleClickOpen1}
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
                                    handleDelete(item.id);
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
          })}
        </MediaQuery>
        <MediaQuery maxWidth={599}>
          {data.map((item, index) => {
            return (
              <div className={classes.paperMar1}>
                {/* {ReactHtmlParser(item.description)} */}
                <Grid item xs={12} className='arrange'>
                  <Paper elevation={3}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Typography style={{ float: 'right' }}>
                          <IconButton aria-label='settings' onClick={handleClickOpen1}>
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
                                handleDelete(item.id, item.subject.id);
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
          })}
        </MediaQuery>
      </>
    );
  };
  const NewDraft = ({ data, loading }) => {
    if (loading) {
      return <h2>Loading...</h2>;
    }

    return (
      <>
        <MediaQuery minWidth={600}>
          {dataDraft ? (
            dataDraft.map((item, index) => {
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
                                  onClick={handleClickOpen1}
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
                                      handleDelete(item.id, item.subject.id);
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

                  {/* <Button
                          size='small'
                          type='submit'
                          color='primary'
                          onClick={(e) => {
                            handleEdit(
                              item.id,
                              item.title,
                              item.grade,
                              item.subject,
                              item.publication_type,
                              item.description,
                              item.thumbnail,
                              item.file,
                              item.zone,
                              item.author_name
                            );
                          }}
                        >
                          Edit
                        </Button> */}
                </div>
              );
            })
          ) : (
            <Grid item md={3}>
              <h1>Select Above Subject</h1>
            </Grid>
          )}
        </MediaQuery>
        <MediaQuery maxWidth={599}>
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
                            <IconButton aria-label='settings' onClick={handleClickOpen1}>
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
                                  handleDelete(item.id, item.subject.id);
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
            <Grid item md={3}>
              <h1>Select Above Subject</h1>
            </Grid>
          )}
        </MediaQuery>
      </>
    );
  };

  const IndividualPost = ({ data, loading }) => {
    if (loading) {
      return <h2>Loading...</h2>;
    }
    return (
      <>
        <MediaQuery minWidth={600}>
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
                                  onClick={handleClickOpen1}
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
                                      handleDelete(item.id, item.subject.id);
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
            <Grid item md={3}>
              <h1>Select Above Subject</h1>
            </Grid>
          )}
        </MediaQuery>
        <MediaQuery maxWidth={599}>
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
                            <IconButton aria-label='settings' onClick={handleClickOpen1}>
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
                                  handleDelete(item.id, item.subject.id);
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
            <Grid item md={3}>
              <h1>Select Above Subject</h1>
            </Grid>
          )}
        </MediaQuery>
      </>
    );
  };

  const ReviewPost = ({ data, loading }) => {
    if (loading) {
      return <h2>Loading...</h2>;
    }
    return (
      <>
        <MediaQuery minWidth={600}>
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
                                  onClick={handleClickOpen1}
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
                                      handleDelete(item.id, item.subject.id);
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
            <h1>Select Above Subject</h1>
          )}
        </MediaQuery>

        <MediaQuery maxWidth={599}>
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
                            <IconButton aria-label='settings' onClick={handleClickOpen1}>
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
                                  handleDelete(item.id, item.subject.id);
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
            <h1>Select Above Subject</h1>
          )}
        </MediaQuery>
      </>
    );
  };
  //get current posts

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = data?.slice(indexOfFirstPost, indexOfLastPost) || [];

  //change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleFilter = (value) => {
    setFilter(value);
  };

  return (
    <Layout>
      <div className='bread-crumb-container'>
        <CommonBreadcrumbs
          componentName='Publication'
          childComponentName={
            readFlag && !tableFlag
              ? 'OpenPublication'
              : editFlag && !tableFlag
              ? 'AddPublication'
              : reviewFlag && !tableFlag
              ? 'Review Publication'
              : null
          }
        />
      </div>

      {!tableFlag && editFlag && <AddPublication handleGoBackPre={handleGoBackPre} />}
      {!tableFlag && readFlag && <OpenPublication ID={readID} />}
      {!tableFlag && reviewFlag && (
        <EditPublication
          ID={pub_id}
          showtitle={pub_title}
          showgrade={pub_grade}
          showsubject={pub_subject}
          showbooktype={pub_publication_type}
          showauthor={pub_author_name}
          showdes={pub_description}
          IMG={pub_thumbnail}
          PDF={pub_file}
          showzone={pub_zone}
          handleGoBackPre={handleGoBackPre}
        />
      )}

      {tableFlag && !readFlag && !editFlag && (
        <div>
          <>
            <MediaQuery minWidth={600}>
              {Filter ? (
                <div className={classes.root}>
                  <div className='upper-table-container'>
                    <Grid className='all-box-container'>
                      <div
                        className={
                          counter === 1
                            ? 'grade-container'
                            : counter === 2
                            ? 'box-right-2'
                            : 'acadamic-year-box'
                        }
                      >
                        {counter === 1 ? (
                          <>
                            <div className='text-fixed'>Acadamic Year</div>
                            <div className='inner-grade-container'>
                              <div className='change-grade-options'>
                                <Select
                                  multiple
                                  fullWidth
                                  native
                                  value={acadamicYearID}
                                  onChange={handleChangeMultiple}
                                >
                                  {dataMap &&
                                    dataMap.map((name) => (
                                      <option
                                        key={name.id}
                                        value={name.id}
                                        onClick={() =>
                                          setAcadamicYearName(name.session_year)
                                        }
                                      >
                                        {name.session_year}
                                      </option>
                                    ))}
                                </Select>
                              </div>
                              <div className='text-fixed-last'>
                                Expand
                                <IconButton
                                  aria-label='delete'
                                  onClick={() => setCounter(counter + 1)}
                                  size='small'
                                >
                                  <ArrowForwardIcon className='arrow-button' />
                                </IconButton>
                              </div>
                            </div>
                          </>
                        ) : (
                          <Grid className='text-rotate'>AcadamicYear</Grid>
                        )}
                      </div>

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
                                        value={name.subject.subject_name}
                                        onClick={() => handleSubjectID(name.subject.id)}
                                      >
                                        {name.subject.subject_name}
                                      </option>
                                    ))}
                                </Select>
                              </div>
                              <div className='text-fixed-last'>
                                Expand
                                <IconButton
                                  aria-label='delete'
                                  onClick={() => setCounter(counter - 1)}
                                  size='small'
                                >
                                  <ArrowBackIcon className='arrow-button' />
                                  <ArrowForwardIcon className='arrow-button' />
                                </IconButton>
                              </div>
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
                      href={`/publications`}
                    >
                      Clear all
                    </StyledClearButton>
                    <StyledFilterButton
                      variant='contained'
                      color='secondary'
                      startIcon={<FilterFilledIcon className={classes.filterIcon} />}
                      className={classes.filterButton}
                      onClick={handleClickOpen}
                    >
                      filter
                    </StyledFilterButton>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby='form-dialog-title'
                    >
                      <DialogTitle id='form-dialog-title'>Zone</DialogTitle>
                      <Select
                        labelId='demo-simple-select-outlined-label'
                        id='demo-simple-select-outlined'
                        name='zone'
                        onChange={handleZone}
                        outlined
                        labelWidth={70}
                        required
                      >
                        {branchGet &&
                          branchGet.map((options) => {
                            return (
                              <MenuItem value={options.id} key={options.id}>
                                {options.branch_name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <DialogActions>
                        <Button onClick={handleClose} color='primary'>
                          Cancel
                        </Button>
                        <Button onClick={handleZoneDataGet} color='primary'>
                          Generate
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {/* <img src={LineImage} /> */}
                    <StyledFilterButton
                      variant='contained'
                      color='secondary'
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
                          counter === 1
                            ? 'grade-container1'
                            : counter === 2
                            ? 'box-right-2'
                            : 'acadamic-year-box1'
                        }
                      >
                        {counter === 1 ? (
                          <>
                            <div className='text-fixed1'>Acadamic Year</div>
                            <div className='inner-grade-container1'>
                              <div className='change-grade-options1'>
                                <Select
                                  multiple
                                  fullWidth
                                  native
                                  value={acadamicYearID}
                                  onChange={handleChangeMultiple}
                                >
                                  {dataMap &&
                                    dataMap.map((name) => (
                                      <option
                                        key={name.id}
                                        value={name.id}
                                        onClick={() =>
                                          setAcadamicYearName(name.session_year)
                                        }
                                      >
                                        {name.session_year}
                                      </option>
                                    ))}
                                </Select>
                              </div>
                              <div className='text-fixed-last1'>
                                Expand
                                <IconButton
                                  aria-label='delete'
                                  onClick={() => setCounter(counter + 1)}
                                  size='small'
                                >
                                  <ArrowForwardIcon className='arrow-button1' />
                                </IconButton>
                              </div>
                            </div>
                          </>
                        ) : (
                          <Grid className='text-rotate1'>AcadamicYear</Grid>
                        )}
                      </div>

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
                                        value={name.subject.subject_name}
                                        onClick={() => handleSubjectID(name.subject.id)}
                                      >
                                        {name.subject.subject_name}
                                      </option>
                                    ))}
                                </Select>
                              </div>
                              <div className='text-fixed-last1'>
                                Expand
                                <IconButton
                                  aria-label='delete'
                                  onClick={() => setCounter(counter - 1)}
                                  size='small'
                                >
                                  <ArrowBackIcon className='arrow-button1' />
                                  <ArrowForwardIcon className='arrow-button1' />
                                </IconButton>
                              </div>
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
                          startIcon={<FilterFilledIcon className={classes.filterIcon} />}
                          className={classes.filterButton}
                          onClick={handleClickOpen}
                        >
                          filter
                        </StyledFilterButton>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby='form-dialog-title'
                        >
                          <DialogTitle id='form-dialog-title'>Zone</DialogTitle>
                          <Select
                            labelId='demo-simple-select-outlined-label'
                            id='demo-simple-select-outlined'
                            name='zone'
                            onChange={handleZone}
                            outlined
                            labelWidth={70}
                            required
                          >
                            {branchGet &&
                              branchGet.map((options) => {
                                return (
                                  <MenuItem value={options.id} key={options.id}>
                                    {options.branch_name}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                          <DialogActions>
                            <Button onClick={handleClose} color='primary'>
                              Cancel
                            </Button>
                            <Button onClick={handleZoneDataGet} color='primary'>
                              Generate
                            </Button>
                          </DialogActions>
                        </Dialog>
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
            {academicYear}
            <li>{subjectID}</li>
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
              <Tab label='All' />
              <Tab label='Draft' />
              <Tab label='For Review' />
              <Tab label='Published' />
            </Tabs>
            <Divider loading={loading} />

            <Tabpanel1 value={value} index={0}>
              <Grid container direction='row' spacing={1} className='gridscroll'>
                <Post data={currentPost} loading={loading} />
              </Grid>
              <Grid container direction='row' justify='center' alignItems='center'>
                <Paginations
                  postsPerPage={postsPerPage}
                  totalPosts={data.length}
                  paginate={paginate}
                />
              </Grid>
            </Tabpanel1>
            <Tabpanel1 value={value} index={1}>
              <Grid container direction='row' spacing={2}>
                <NewDraft loading={loading} />
              </Grid>
            </Tabpanel1>
            <Tabpanel1 value={value} index={2}>
              <Grid container direction='row'>
                <ReviewPost loading={loading} />
              </Grid>
            </Tabpanel1>
            <Tabpanel1 value={value} index={3}>
              <Grid container direction='row' spacing={2}>
                <IndividualPost data={currentPost} loading={loading} />
              </Grid>
            </Tabpanel1>
          </Grid>
        </div>
      )}
    </Layout>
  );
};

export default Publications;
