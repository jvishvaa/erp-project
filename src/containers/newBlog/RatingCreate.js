import React, { useState, useRef, useEffect,useContext } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

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

const RatingCreate = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();

  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
  const { setAlert } = useContext(AlertNotificationContext);


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

  const [score1, setScore1] = useState('');
  const [creativity, setCreativity] = useState('');

  const [score2, setScore2] = useState('');

  const [score3, setScore3] = useState('');

  const [score4, setScore4] = useState('');

  const [score5, setScore5] = useState('');

  const [inputList, setInputList] = useState([{ name: '', rating: '', score: null }]);

  const [isDisabled, setIsDisabled] = useState(false);

  //   useEffect(() => {
  //     if (inputList.length > 0) {
  //       inputList[inputList.length - 1].input === ''
  //         ? setIsDisabled(true)
  //         : setIsDisabled(false);
  //     }
  //   }, []);
  const handleListAdd = () => {
    setInputList([
      ...inputList,
      {
        name: '',
        rating: '',
        score: null,
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
    setViewing(false);
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

  const handleActivityTypeSubmit = () => {
    let body = {
      activity_type: ActivityType,
      grading_scheme:
        // name: scoreType,
        inputList,
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
        console.log(response);
        // alert.success('activity successfully created');
        setAlert('success', 'Rating and Score Successfully Created');

        setActivityType('');
        handleClose();
        getActivityCategory();
      });
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

  const activityScore1 = (e) => {
    const re = /^[0-5\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setScore1(e.target.value);
    }
    console.log(e.target.value, 'event');
  };

  const handleInputCreativity = (event, index) => {
    const { value } = event.target;
    const newInputList = [...inputList];
    // newInputList[index].creativity = value;
    newInputList[index].name = value;
    setInputList(newInputList);
  };
  const handleInputRating = (event, index) => {
    const { value } = event.target;
    const newInputList = [...inputList];
    // newInputList[index].creativity = value;
    newInputList[index].rating = value;
    setInputList(newInputList);
  };

  const handleInputChange1 = (event, index) => {
    const { value } = event?.target;
    // const index1=1;

    let newInputList = [...inputList];
    // newInputList[index].creativity = value;
    newInputList[index].score = Number(value);

    setInputList(newInputList);
  };
  const [viewing, setViewing] = useState(false);
  const viewDisplay = () => {
    setViewing(true);
  };

  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
  };
  const [search, setSearch] = useState('');
  // const handleSearch = (event) => {
  //   setSearch(event.target.value);
  // }
  console.log(search);

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
            <Typography color='Primary'>Create Rating Type</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginLeft: '32px',
          marginRight: '34px',
        }}
      >
        <div style={{ width: '300%' }}>
          <TextField
            label='Activity Type'
            size='small'
            type='text'
            value={search}
            select
            style={{ width: '18%' }}
            onChange={(e) => setSearch(e.target.value)}
            variant='outlined'
          >
            {activityCategory.map((option) => (
              <MenuItem key={option.name} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          <Button onClick={viewDisplay}>Add</Button>
        </div>
      </div>

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
                <TableCell className={classes.tableCell}>Criteria Name</TableCell>

                <TableCell className={classes.tableCell}>Rating </TableCell>

                <TableCell className={classes.tableCell}>Score </TableCell>
              </TableRow>
            </TableHead>
            {activityCategory
              ?.filter((response) =>
                response?.name?.toLowerCase()?.includes(search?.toLowerCase())
              )
              .map((response, index) => (
                <TableBody>
                  <TableRow
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    // key={`user_table_index${i}`}
                  >
                    <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                    <TableCell className={classes.tableCells}>{response.name}</TableCell>
                    <TableCell className={classes.tableCells}>
                      {response?.grading_scheme.map((obj) => (<div>{obj.name}</div>))}
                    </TableCell>{' '}
                    <TableCell className={classes.tableCells}>
                      <Typography>
                        {response?.grading_scheme.map((obj) => (<div>{obj.rating}</div>))}
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      <Typography>
                        {response?.grading_scheme.map((obj) => (<div>{obj.score}</div>))}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
          <TablePagination
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
          />
        </TableContainer>
      </Paper>

      <Dialog
        // open={deleteModel}
        open={viewing}
        maxWidth={maxWidth}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div
          style={{
            marginLeft: '37px',
            marginTop: '13px',
            marginBottom: '12px',
            marginRight: '28px',
          }}
        >
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>Create Rating</div>
          <Divider />
          <div style={{ marginTop: '8px' }}>
            <TextField
              label='Activity Type'
              size='small'
              type='text'
              value={ActivityType}
              select
              style={{ width: '29%' }}
              onChange={(e) => setActivityType(e.target.value)}
              variant='outlined'
            >
              {activityCategory.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {inputList
            ? inputList.map((input, index) => (
                <>
                  <div style={{ marginTop: '1rem' }}>
                    <TextField
                      label='Criteria Name'
                      size='small'
                      type='text'
                      onChange={(event) => handleInputCreativity(event, index)}
                      variant='outlined'
                    />
                    &nbsp;&nbsp;&nbsp;
                    <TextField
                      label='Rating'
                      size='small'
                      type='number'
                      // value={rating1}
                      onChange={(event) => handleInputRating(event, index)}
                      // onInput={(e) => {
                      //   e.target.value = Math.max(0, parseInt(e.target.value))
                      //     .toString()
                      //     .slice(0, 1);
                      // }}
                      // onChange={(event) => handleInputChange(event, index)}
                      variant='outlined'
                    />
                    &nbsp;&nbsp;&nbsp;
                    <TextField
                      label='Score'
                      size='small'
                      type='number'
                      // onInput={(e) => {
                      //   e.target.value = Math.max(0, parseInt(e.target.value))
                      //     .toString()
                      //     .slice(0, 1);
                      // }}
                      // onChange={(e) => activityScore(e)}
                      // onChange={(event) => handleInputChange(event, index)}
                      // onChange={(e) => activityScore1(e)}
                      onChange={(event) => handleInputChange1(event, index)}
                      variant='outlined'
                    />
                    <Button
                      style={{ marginLeft: '12px' }}
                      onClick={() => handleRemoveItem(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              ))
            : 'No item in the list '}
          &nbsp;&nbsp;&nbsp;
          <Button
            onClick={handleListAdd}
            disabled={isDisabled}
            style={{ marginTop: '1rem' }}
          >
            Add
          </Button>
          &nbsp;&nbsp;
          <Button
            variant='contained'
            size='small'
            color='primary'
            onClick={handleActivityTypeSubmit}
            style={{ marginTop: '1rem' }}
          >
            Submit
          </Button>
        </div>
      </Dialog>
    </Layout>
  );
};
export default RatingCreate;
