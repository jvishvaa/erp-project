import React, { useState, useRef, useContext,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';

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
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';


import Layout from 'containers/Layout';
import Close from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Box from '@material-ui/core/Box';
import { useTheme, withStyles } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ForumIcon from '@material-ui/icons/Forum';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DialogContentText from '@material-ui/core/DialogContentText';

import './styles.scss';

import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90vw',
    width: '95%',
    margin: '20px auto',
    marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  searchTable: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },

  customTabRoot: {
    color: 'red',
    backgroundColor: 'green',
  },
  customTabIndicator: {
    backgroundColor: 'orange',
  },

  tableCell: {
    color: 'white !important',
    backgroundColor: '#1b4ccc !important',
  },
  tableCells: {
    color: 'black !important',
    backgroundColor: '#F0FFFF !important',
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
  buttonColor: {
    color: `${theme.palette.primary.main} !important`,
    // backgroundColor: 'white',
  },
  tabStyle: {
    color: 'white !important',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  tabStatic: {
    position: 'static',
    paddingLeft: '19px',
    paddingRight: '39px',
    paddingTop: '36px',
  },
  buttonColor1: {
    color: 'grey !important',
    backgroundColor: 'white',
  },
  buttonColor2: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: 'white',
  },
  selected1: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
  },
  selected2: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
  },
  tabsFont: {
    '& .MuiTab-wrapper': {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  tabsFont1: {
    '& .MuiTab-wrapper': {
      color: 'black',
      fontWeight: 'bold',
    },
  },
}));

const CreateActivityType = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);


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
  const [drawer, setDrawer] = useState(false);
  const [drawers, setDrawers] = useState(false);
  const [value, setValue] = useState(0);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [accordianBulkFilter, setAccordianBulkFilter] = useState(false);
  const [creativityType, setCreativityType] = useState('');
  const [scoreType, setScoreType] = useState("");
  const [inputList, setInputList] = useState([
    {
      score: null,
      rating: null,
    },
  ]);
  console.log(inputList);

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (inputList.length > 0) {
      inputList[inputList.length - 1].input === ''
        ? setIsDisabled(true)
        : setIsDisabled(false);
    }
  }, []);
  const handleListAdd = () => {
    setInputList([
      ...inputList,
      {
        score: '',
        rating: '',
      },
    ]);
  };
  
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const months = [
    {
      label: 'January',
      value: '1',
    },
    {
      label: 'Febraury',
      value: '2',
    },
    {
      label: 'March',
      value: '3',
    },
    {
      label: 'April',
      value: '4',
    },
    {
      label: 'May',
      value: '5',
    },
    {
      label: 'June',
      value: '6',
    },
    {
      label: 'July',
      value: '7',
    },
    {
      label: 'August',
      value: '8',
    },
    {
      label: 'September',
      value: '9',
    },
    {
      label: 'October',
      value: '10',
    },
    {
      label: 'November',
      value: '11',
    },
    {
      label: 'December',
      value: '12',
    },
  ];

  const [view, setViewed] = useState(false);
  const [branchView, setBranchView] = useState(true);
  const [branchSearch, setBranchSearch] = useState(true);

  const viewed = () => {
    setViewed(true);
  };
  const handleClose = () => {
    setViewed(false);
  };

  const branchViewed = () => {
    setBranchView(false);
    setBranchSearch(true);
  };

  const shortList = () => {
    history.push('/blog/short');
  };
  const [data, setData] = useState('');
  const handleDate = (data) => {
    console.log(data, 'data');
    setBranchView(true);
    setBranchSearch(false);
    setData(data);
  };
  const [assigned, setAssigned] = useState(false);

  const assignIcon = () => {
    setAssigned(true);
  };

  const [assingeds, setAssigneds] = useState([]);
  const getAssinged = () => {
    axios
      .get(`${endpoints.newBlog.unAssign}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        console.log(response);
        setAssigneds(response.data.result);
      });
  };

  useEffect(() => {
    getAssinged();
  }, []);
  const [ActivityType, setActivityType] = useState('');

  const submitActivity = () => {
    if(!ActivityType){
      setAlert('error','Please Add Activity Type')
      return
    }else{
      let body = {
        activity_type: ActivityType,
  
      };
      axios
        .post(
          `${endpoints.newBlog.activityTypeSubmit}`,
          body,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          if(response?.data?.status_code === 400){
            setAlert('error',response?.data?.message)
            return
          }else{
            setAlert('success', 'Activity Successfully Created');
            setActivityType('');
            setAccordianBulkFilter(false);
            getActivityCategory();
          }
        });
    }
  };

  const [activityCategory, setActivityCategory] = useState([]);
  const getActivityCategory = () => {
    axios
      .get(`${endpoints.newBlog.getActivityType}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setActivityCategory(response.data.result);
      });
  };
  useEffect(() => {
    getActivityCategory();
  }, []);

  const activityScore = (e) => {
    const re = /^[0-5\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setScoreType(e.target.value);
    }
  };

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const newInputList = [...inputList];
    // newInputList[index].creativity = value;
    newInputList[index].score = value;
    newInputList[index].rating = value;

    setInputList(newInputList);
  };


  

  return (
    <Layout>
      <Grid
        container
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '22px',
          paddingRight: '15px',
          paddingBottom: '15px',
        }}
      >
        <Grid item xs={4} md={4}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            aria-label='breadcrumb'
          >
            <Typography color='textPrimary' variant='h6'>
              <strong>Activity</strong>
            </Typography>
            <Typography color='textPrimary' style={{fontSize:'20px', fontWeight:'bold'}}>Create Activity Type</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid
        item
        sm={12}
        md={13}
        xs={12}
        style={{
          paddingLeft: '21px',
          paddingRight: '28px',
        }}
      >
        <Accordion expanded={accordianBulkFilter}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            onClick={() => setAccordianBulkFilter(!accordianBulkFilter)}
          >
            <Typography variant='h6' color='primary'>
              Create Activity Type
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1} style={{display: 'flex'}}>
              <Grid item>
                <TextField label="Activity Type" 
                variant='outlined' 
                size='small' 
                value={ActivityType}
                type={'text'}
                inputProps={{ maxLength: 30 }}
                onChange={(e)=>setActivityType(e.target.value)} />
              </Grid>
              &nbsp;&nbsp;
              <Grid item>
                <Button  onClick={submitActivity}>Submit</Button>
                
                </Grid>
              </Grid>
            
          </AccordionDetails>
        </Accordion>
      </Grid>

      <Paper className={`${classes.root} common-table`} id='singleStudent'>
        <TableContainer
          className={`table table-shadow view_users_table ${classes.container}`}
        >
          <Table stickyHeader aria-label='sticky table'>
            <TableHead className={`${classes.columnHeader} table-header-row`}>
              <TableRow>
                <TableCell className={classes.tableCell} style={{ maxWidth: '1px' }}>
                  S No.
                </TableCell>
                <TableCell className={classes.tableCell}>Activity Type Name </TableCell>
              </TableRow>
            </TableHead>
            {activityCategory.map((response, index) => (
              <TableBody>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  // key={`user_table_index${i}`}
                >
                  <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                  <TableCell className={classes.tableCells}>{response.name}</TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          {/* <TablePagination
            component='div'
            // count={totalCount}
            // rowsPerPage={limit}
            // page={Number(currentPage) - 1}
            // onChangePage={(e, page) => {
            // handlePagination(e, page + 1);
            // }}
            rowsPerPageOptions={false}
            className='table-pagination'
            classes={{
              spacer: classes.tablePaginationSpacer,
              toolbar: classes.tablePaginationToolbar,
            }}
          /> */}
        </TableContainer>
      </Paper>

      <Dialog
        open={view}
        // onClose={handleClose}
        maxWidth={maxWidth}
        // style={{width:'700px'}}
      >
        {' '}
        <div style={{ width: '700px' }}>
          <Grid
            container
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            style={{ justifyContent: 'space-between' }}
          >
            <Grid item>
              <Typography>
                <strong
                  style={{ fontSize: '14px', color: themeContext.palette.primary.main }}
                >
                  Please Select Your Branch
                </strong>
              </Typography>
            </Grid>
            <Grid item>
              <IconButton size='small' style={{ visibility: 'hidden' }}>
                <Close />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton size='small' onClick={() => handleClose()}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>

          <Divider className={classes.divider} />
          <Grid
            container
            direction='row'
            style={{ marginLeft: '5px', marginBottom: '20px' }}
          >
            {branchView == true && (
              <Grid item>
                Branch Name:{' '}
                <Button
                  size='small'
                  color='primary'
                  className={classes.buttonColor}
                  variant='contained'
                  onClick={branchViewed}
                  endIcon={<ArrowDropDownIcon />}
                  style={{ width: '576px' }}
                >
                  {data == '' ? 'Select' : data.label}
                </Button>
              </Grid>
            )}
            {data && (
              <Grid
                item
                style={{
                  marginLeft: '580px',
                  marginTop: '25px',
                }}
              >
                <Button variant='contained' size='small' color='primary'>
                  {' '}
                  Proceed
                </Button>
              </Grid>
            )}
            {branchSearch == true && branchView == false && (
              <Grid item style={{ display: 'flex' }}>
                Branch Name:&nbsp;
                <Paper
                  style={{
                    border: '1px solid gray',
                    width: '576px',
                    height: '321px',
                    overflowY: 'auto',
                  }}
                >
                  <div>
                    <TextField
                      placeholder='Type Text...'
                      style={{ background: 'lightgray', width: '574px' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant='standard'
                    />
                  </div>
                  <div>
                    <TableContainer>
                      <Table aria-label='simple table'>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.searchTable}>
                              Branch Name
                            </TableCell>
                            <TableCell className={classes.searchTable} align='right'>
                              Total Submitted
                            </TableCell>
                            <TableCell className={classes.searchTable} align='right'>
                              Reviewed
                            </TableCell>
                            <TableCell className={classes.searchTable} align='right'>
                              Review Pending
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {months.map((option) => (
                            <TableRow
                              key={option.value}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleDate(option)}
                            >
                              <TableCell component='th' scope='row'>
                                {option.value}
                              </TableCell>
                              <TableCell align='right'>{option.label}</TableCell>
                              <TableCell align='right'>22</TableCell>
                              <TableCell align='right'>30</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Paper>
              </Grid>
            )}
          </Grid>
        </div>
      </Dialog>
    </Layout>
  );
};
export default CreateActivityType;
