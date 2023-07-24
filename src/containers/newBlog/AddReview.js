import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BookmarksIcon from '@material-ui/icons/Bookmarks';

import {
  IconButton,
  Divider,
  TextField,
  Button,
  SvgIcon,
  makeStyles,
  Typography,
  Grid,
  Breadcrumbs,
  MenuItem,
  TextareaAutosize,
  Paper,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Table,
  Drawer,
  TablePagination,
  Dialog,
} from '@material-ui/core';
import Layout from 'containers/Layout';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Box from '@material-ui/core/Box';
import { useTheme, withStyles } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useHistory } from 'react-router-dom';
import MyTinyEditor from 'containers/question-bank/create-question/tinymce-editor';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RatingScale from './HoverRating';
import Checkbox from '@material-ui/core/Checkbox';

import './styles.scss';

import axiosInstance from '../../config/axios';
import ReactHtmlParser from 'react-html-parser';

import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import StarsIcon from '@material-ui/icons/Stars';
import Rating from '@material-ui/lab/Rating';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90vw',
    width: '95%',
    marginLeft: '25px',
    // marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  buttonColor1: {
    color: 'grey !important',
    backgroundColor: 'white',
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },

  buttonColor: {
    color: `${theme.palette.primary.main} !important`,
    // backgroundColor: 'white',
  },

  buttonColor2: {
    color: '#FF6161 !important',
    backgroundColor: 'white',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  tableCell: {
    color: 'black !important',
    backgroundColor: '#ADD8E6 !important',
  },
  tableCells: {
    color: 'black !important',
    backgroundColor: '#F0FFFF !important',
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
}));
const DEFAULT_RATING = 0;

const AddReview = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();

  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);

  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [maxWidth, setMaxWidth] = React.useState('lg');

  const [value, setValue] = useState({ rating: DEFAULT_RATING });
  useEffect(() => {
    setValue({
      rating: DEFAULT_RATING,
    });
  }, []);

  const [desc, setDesc] = useState('');

  const [startDate, setStartDate] = useState(null);

  const [dropdownData, setDropdownData] = React.useState({
    branch: [],
    grade: [],
  });
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const handleChanges = (event) => {
    setMonth(event.target.value);
  };
  const handleStatus = (event, val) => {
    setStatus(val);
  };

  const viewBlog = () => {
    history.push('/blog/activityreview');
  };
  const blogsContent = [
    {
      label: 'Public Speaking',
      value: '1',
    },
    {
      label: 'Post Card Writting',
      value: '2',
    },
    {
      label: 'Blog Card Writting',
      value: '3',
    },
  ];
  const handleStartDateChange = (val) => {
    setStartDate(val);
  };
  const PreviewBlog = () => {
    history.push('/blog/activityreview');
  };
  const [submit, setSubmit] = useState(false);
  const submitReview = () => {
    setSubmit(true);
  };
  const expandMore = () => {
    setSubmit(false);
  };
  const [publish, setPublish] = useState(false);
  const createPublish = () => {
    setPublish(true);
  };
  const [title, setTitle] = useState();
  console.log(history?.location);
  useEffect(() => {
    if (history?.location?.pathname === '/blog/addreview') {
      setTitle(history?.location?.state?.data);
    }
  }, [history]);

  let schoolDetails = JSON.parse(localStorage.getItem('schoolDetails'));
  const { school_logo } = schoolDetails;

  return (
    <>
      <Layout>
        <div
          style={{
            paddingTop: '10px',
            paddingLeft: '15px',
            paddingRight: '15px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onClick={PreviewBlog}
        >
          <ArrowBackIcon /> <span style={{ color: 'gray' }}>Back to</span> Blog
        </div>

        <Grid container direction='row' justifyContent='center'>
          <Grid item>
            <div
              style={{
                border: '1px solid #813032',
                width: '583px',
                background: '#47B8CF',
                height: 'auto',
              }}
            >
              <div
                style={{
                  background: 'white',
                  width: '554px',
                  marginLeft: '13px',
                  marginTop: '5px',
                }}
              >
                <div>
                  <img src={school_logo} width='130' alt='image' />
                </div>
              </div>

              <div
                style={{
                  background: 'white',
                  width: '502px',
                  marginLeft: '34px',
                  marginTop: '16px',
                  height: 'auto',
                }}
              >
                <div style={{ paddingLeft: '30px', paddingTop: '7px' }}>
                  {title?.activity_detail?.title}
                </div>
                <div
                  style={{
                    paddingLeft: '30px',
                    paddingTop: '10px',
                    paddingBottom: '5px',
                  }}
                >
                  {title?.activity_detail?.description}
                </div>
              </div>
              <div
                style={{
                  background: 'white',
                  width: '502px',
                  marginLeft: '34px',
                  height: 'auto',
                  marginTop: '12px',
                  marginBottom: '29px',
                }}
              >
                <div style={{ paddingLeft: '30px', paddingTop: '12px' }}>
                  <img
                    src='https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554__340.jpg'
                    width='130'
                    alt='image'
                  />
                </div>
                <div
                  style={{
                    paddingLeft: '30px',
                    paddingTop: '12px',
                    paddingBottom: '6px',
                  }}
                >
                  {ReactHtmlParser(title?.submitted_work?.html_text)}
                </div>
              </div>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'row-reverse', paddingTop: '9px' }}
            >
              {' '}
              <Button
                variant='outlined'
                size='medium'
                // onClick={shortList}
                className={classes.buttonColor1}
                startIcon={<BookmarksIcon style={{ color: 'grey' }} />}
              >
                Shortlist
              </Button>{' '}
              &nbsp;
              <Button
                variant='contained'
                color='primary'
                size='medium'
                className={classes.buttonColor}
                onClick={createPublish}
              >
                Published Blog{' '}
              </Button>
            </div>
          </Grid>
          <Grid item>
            {submit == false ? (
              <div style={{ paddingLeft: '15px' }}>Add Review</div>
            ) : (
              <div style={{ paddingLeft: '15px' }}>Edit Review</div>
            )}
            {submit == false && (
              <div
                style={{
                  border: '1px solid #707070',
                  width: '318px',
                  height: 'auto',
                  marginLeft: '12px',
                }}
              >
                <div
                  style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '5px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {' '}
                    Creativity
                    <RatingScale
                      name='simple-controlled'
                      defaultValue={DEFAULT_RATING}
                      onChange={(event, value) => {
                        setValue((prev) => ({ ...prev, rating: value }));
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      id='outlined-basic'
                      size='small'
                      variant='outlined'
                      style={{ width: '286px' }}
                    />
                  </div>
                </div>

                <div
                  style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '5px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {' '}
                    Creativity
                    <RatingScale
                      name='simple-controlled'
                      defaultValue={DEFAULT_RATING}
                      onChange={(event, value) => {
                        setValue((prev) => ({ ...prev, rating: value }));
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      id='outlined-basic'
                      size='small'
                      variant='outlined'
                      style={{ width: '286px' }}
                    />
                  </div>
                </div>

                <div
                  style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '5px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {' '}
                    Creativity
                    <RatingScale
                      name='simple-controlled'
                      defaultValue={DEFAULT_RATING}
                      onChange={(event, value) => {
                        setValue((prev) => ({ ...prev, rating: value }));
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      id='outlined-basic'
                      size='small'
                      variant='outlined'
                      style={{ width: '286px' }}
                    />
                  </div>
                </div>

                <div
                  style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '5px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {' '}
                    Creativity
                    <RatingScale
                      name='simple-controlled'
                      defaultValue={DEFAULT_RATING}
                      onChange={(event, value) => {
                        setValue((prev) => ({ ...prev, rating: value }));
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      id='outlined-basic'
                      size='small'
                      variant='outlined'
                      style={{ width: '286px' }}
                    />
                  </div>
                </div>

                <div
                  style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '5px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {' '}
                    Creativity
                    <RatingScale
                      name='simple-controlled'
                      defaultValue={DEFAULT_RATING}
                      onChange={(event, value) => {
                        setValue((prev) => ({ ...prev, rating: value }));
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      id='outlined-basic'
                      size='small'
                      variant='outlined'
                      style={{ width: '286px' }}
                    />
                  </div>
                </div>

                <div
                  style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '5px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {' '}
                    Creativity
                    <RatingScale
                      name='simple-controlled'
                      defaultValue={DEFAULT_RATING}
                      onChange={(event, value) => {
                        setValue((prev) => ({ ...prev, rating: value }));
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      id='outlined-basic'
                      size='small'
                      variant='outlined'
                      style={{ width: '286px' }}
                    />
                  </div>
                </div>
                <div
                  style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '5px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {' '}
                    Creativity
                    <RatingScale
                      name='simple-controlled'
                      defaultValue={DEFAULT_RATING}
                      onChange={(event, value) => {
                        setValue((prev) => ({ ...prev, rating: value }));
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      id='outlined-basic'
                      size='small'
                      variant='outlined'
                      style={{ width: '286px' }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginRight: '10px',
                    marginLeft: '6px',
                    marginBottom: '15px',
                    marginTop: '32px',
                  }}
                >
                  {' '}
                  <Button
                    variant='contained'
                    color='primary'
                    size='medium'
                    className={classes.buttonColor}
                    onClick={submitReview}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            )}
            {submit == true && (
              <div
                style={{
                  border: '1px solid #707070',
                  width: '318px',
                  height: 'auto',
                  marginLeft: '12px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                  <ExpandMoreIcon onClick={expandMore} />
                </div>
                <div
                  style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '5px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {' '}
                    Overall
                    <RatingScale
                      name='simple-controlled'
                      defaultValue={DEFAULT_RATING}
                      onChange={(event, value) => {
                        setValue((prev) => ({ ...prev, rating: value }));
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      paddingBottom: '9px',
                    }}
                  >
                    Review Submitted
                  </div>
                </div>
              </div>
            )}
          </Grid>
        </Grid>

        <Dialog open={publish} maxWidth={maxWidth} style={{ borderRadius: '10px' }}>
          <div style={{ width: '642px' }}>
            <div
              style={{
                marginTop: '12px',
                marginLeft: '30px',
                marginBottom: '23px',
              }}
            >
              <div style={{ marginTop: '23px', fontWeight: 'bold', fontSize: '19px' }}>
                Publishing Options
              </div>
              <div
                style={{
                  marginTop: '21px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#1C85EB',
                  textDecorationLine: 'underline',
                  textDecorationThickness: '4px',
                }}
              >
                Publish Level
              </div>
              <Divider style={{ marginRight: '74px' }} />
              <div style={{ marginTop: '13px', fontWeight: 'bold' }}>
                <Checkbox inputProps={{ 'aria-label': 'primary checkbox' }} /> &nbsp;Intra
                Orchids
              </div>
              <div>
                <Checkbox inputProps={{ 'aria-label': 'primary checkbox' }} /> &nbsp;
                <span style={{ fontWeight: 'bold' }}>
                  Top Blog of Intra Orchids Category
                </span>
                <div style={{ marginLeft: '51px' }}>
                  will appear on top of the blog wall 1Blog per Grade across Orchids
                </div>
              </div>
              <Divider />
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  <Checkbox inputProps={{ 'aria-label': 'primary checkbox' }} />{' '}
                  &nbsp;Branch
                </div>
              </div>
              <div>
                <Checkbox inputProps={{ 'aria-label': 'primary checkbox' }} /> &nbsp;
                <span style={{ fontWeight: 'bold' }}>
                  top of the blog per Grade across Orchids
                </span>
                <div style={{ marginLeft: '51px' }}>
                  {' '}
                  (will appear on top of the blog wall 1Blog per Grade across Orchids)
                </div>
              </div>

              <div
                style={{
                  marginTop: '13px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#1C85EB',
                  textDecorationLine: 'underline',
                  textDecorationThickness: '4px',
                }}
              >
                Publish Date
              </div>
              <Divider style={{ marginRight: '74px' }} />

              <div>
                {' '}
                <TextField
                  required
                  size='small'
                  style={{ marginTop: '13px' }}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  type='date'
                  value={startDate || ' '}
                  variant='outlined'
                />
              </div>

              <div
                style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}
              >
                {' '}
                <Button
                  variant='contained'
                  color='primary'
                  size='medium'
                  className={classes.buttonColor}
                >
                  Cancel
                </Button>{' '}
                &nbsp;&nbsp;&nbsp;
                <Button
                  variant='contained'
                  color='primary'
                  size='medium'
                  className={classes.buttonColor}
                >
                  Submit
                </Button>{' '}
              </div>
            </div>
          </div>
        </Dialog>
      </Layout>
    </>
  );
};
export default AddReview;
