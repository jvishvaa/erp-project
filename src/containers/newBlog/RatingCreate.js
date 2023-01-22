import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loader from '../../components/loader/loader';
import { Drawer as AntDrawer, Button as AntButton, Input, Select, Space, Modal as AntModal, Divider as AntDivider } from 'antd';
import { DeleteFilled, DeleteOutlined, EditOutlined, DownOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';

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


const visualOptionData = [
  { name: "good", id: 1 },
  { name: "can do better", id: 2 }
]

const RatingCreate = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  const { Option } = Select;
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
  const [loading, setLoading] = useState(false)
  const [showPhy, setShowPhy] = useState(false);

  const [score1, setScore1] = useState('');
  const [creativity, setCreativity] = useState('');

  const [score2, setScore2] = useState('');

  const [score3, setScore3] = useState('');

  const [score4, setScore4] = useState('');

  const [score5, setScore5] = useState('');

  const [inputList, setInputList] = useState([{ name: '', rating: '', score: null }]);

  const [isDisabled, setIsDisabled] = useState(false);
  const [viewParameterFlag, setViewParameterFlag] = useState(false);
  const [antDrawer, setAntDrawer] = useState(false)
  const [visualInputlList, setVisualInputList] = useState([{ name: '',score:null }]);
  const [selectedOption, setSelectedOption] = useState('')
  const [onOptionVisible, setOnOptionVisible] = useState(false)
  const [onOptionModal, setOnOptionModal] = useState(false)
  const [optionTitleSelected, setOptionTitle] = useState('')
  const [optionList, setOptionList] = useState([{ name: '', score: null, status: false }]);
  const [visualActivity, setVisualActivity] = useState('')

  console.log(optionTitleSelected, 'jk')
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

  const handleParameterClose = () => {
    setViewParameterFlag(false)
  }

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
  const [ActivityType, setActivityType] = useState();

  const handleActivityTypeSubmit = () => {
    if (!ActivityType?.name) {
      setAlert('error', 'Please Enter Activity Type')
      return;
    }
    const uniqueValues = new Set(inputList.map((e) => e.name));
    if (uniqueValues.size < inputList.length) {
      setAlert('error', 'Duplicate Name Found');
      return
    }
    let body = {
      sub_type: ActivityType?.sub_type,
      activity_type: ActivityType?.name,
      grading_scheme:
        inputList,

    };
    setLoading(true)
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
        setLoading(false)
        setAlert('success', 'Rating and Score Successfully Created');
        setActivityType('');
        handleClose();
        getActivityCategory();
      })
      .catch((error) => {
        setLoading(false)
      });
  };

  const [activityCategory, setActivityCategory] = useState([]);
  const getActivityCategory = () => {
    setLoading(true)
    axios
      .get(`${endpoints.newBlog.getActivityType}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setActivityCategory(response.data.result);
        setLoading(false)
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
    if (value > 5 || value < 0) {
      setAlert('error', 'Please Enter Number In Between 0 to 5')
      return
    }
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

  const viewParameter = () => {
    // setViewParameterFlag(true)
    setAntDrawer(true)
  }
  const viewOption = () => {
    setOnOptionVisible(true)
  }
  const viewDisplay = () => {
    setViewing(true);
  };

  const handleCreateTemplate = () => {
    history.push(
      '/blog/templates'
    );
  }

  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
  };
  const [search, setSearch] = useState();
  // const handleSearch = (event) => {
  //   setSearch(event.target.value);
  // }

  const handleActivity = (e, value) => {
    setSearch(value)
  }

  useEffect(() => {
    if (ActivityType?.name == "Physical Activity") {
      setShowPhy(true)
    } else {
      setShowPhy(false)
    }
  }, [ActivityType])

  const onCloseAnt = () => {
    setAntDrawer(false)
    setOnOptionVisible(false)
  }

  const handleVisualInputApp = () => {
    setVisualInputList([
      ...visualInputlList,
      {
        name: '',
        score:null,
      },
    ])
  };


  const handleVisualOption = (event, index) => {
    let newInputList = [...visualInputlList]
    newInputList[index].option = value;
    setVisualInputList(newInputList)
  }

  const handleRemoveVisual = (index) => {
    let newList = [...visualInputlList]
    newList.splice(index, 1);
    setVisualInputList(newList)
  }

  const handleVisualTypeSubmit = () => {
    let uniqueValues = new Set(visualInputlList.map((e) => e.name));
    if (uniqueValues.size < visualInputlList.length) {
      setAlert('error', 'Duplicate Name Found');
      return
    }

    //API call
  }


  //Visual Option dropdown
  const visulaOptions = visualOptionData?.map((each) => {
    return (
      <Option value={each?.name} key={each?.id}>
        {each?.name}
      </Option>
    )
  })

  const handleVisualChange = (e, value) => {
    if (e) {
      setSelectedOption(value?.value)
    } else {
      setSelectedOption('')
    }
  }

  const onOptionModalFun = () => {
    setOnOptionModal(true)
  }

  const activityOption = activityCategory.map((each) => {
    return (
      <Option value={each?.name} key={each?.id}>
        {each?.name}
      </Option>
    )
  })

  const handleActivityAnt = (e, value) => {
    setVisualActivity("")
    if (value) {
      setVisualActivity(value)
    }
  }

  const handleOptionInputAdd = (e, value) => {
    setOptionList([
      ...optionList,
      {
        name: '',
        score: null,
        status: false
      },
    ])
  };

  const handleOptionInput = (event, index) => {
    console.log(index)
    if (event) {
      const { value } = event.target;
      const newInputList = [...optionList]
      newInputList[index].name = value;
      setOptionList(newInputList)
    }
  }

  const handleMarksInput = (event, index) => {
    const { value } = event.target;
    let newInputList = [...optionList]
    newInputList[index].score = value;
    setOptionList(newInputList)
  }

  const handleOptionSubmit = () => {
    const arr1 = visualInputlList?.map((obj) =>{
      return {...obj,rating: optionList}
      return obj
    })
    // let uniqueValues = new Set(optionList.map((e) => e?.option));
    // if(uniqueValues.size < optionList?.length){
    //   setAlert('error','Duplicate Name FOund')
    //   return
    // }
    let body = {
      activity_type: ActivityType?.name,
      grading_scheme: arr1

    };

    setLoading(true)
    axios
      .post(`${endpoints.newBlog.visualOptionSubmit}`,
        body,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((res) => {
        console.log(res)
        setLoading(false)
        setAlert('success', 'Option Created Successfully')
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const handleOptionTitle = (e) => {
    const { value } = e.target
    setOptionTitle(value)

  }

  const handleOptionDelete = (index) => {
    let newList = [...optionList]
    newList.splice(index, 1)
    setOptionList(newList)

  }

  const handleQuestion =(event,index) =>{
    if(event){
      const {value} = event.target;
      const newInputList = [...visualInputlList]
      newInputList[index].name = value
      setVisualInputList(newInputList)
    }
  }



  return (
    <div>
      {loading && <Loader />}

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
              <Typography
                color='textPrimary'
                style={{ fontWeight: 'bold', fontSize: '22px' }}
              >
                Create Rating
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>

        {/* <div style={{ width: '85%' }}> */}
        <Grid container item md={12} sm={12} xs={12}>
          <Grid item spacing={3} md={6}>
            <Grid item md={6} style={{ margin: '0 6%' }}>
              <Autocomplete
                size='small'
                fullWidth
                onChange={handleActivity}
                // id='branch_id'
                className='dropdownIcon'
                value={search}
                options={activityCategory || []}
                getOptionLabel={(option) => option?.name || ''}
                // getOptionSelected={(option, value) => option?.branch?.id == value?.branch?.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Activity Type'
                    placeholder='Activity Type'
                    required
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* </div> */}
          <Grid item md={6} container justifyContent='flex-end'>
            <Grid item md={3} container justifyContent='flex-end'>
              <Button variant='contained' color='primary' onClick={handleCreateTemplate}>
                {' '}
                Add Template
              </Button>
            </Grid>
            <Grid item md={3} container justifyContent='center'>
              <Button variant='contained' color='primary' onClick={viewParameter}>
                Add Parameter
              </Button>
            </Grid>
            <Grid item md={3} container justifyContent='center'>
              <Button variant='contained' color='primary' onClick={viewOption}>
                Add Option
              </Button>
            </Grid>
            <Grid item md={3} container justifyContent='center'>
              <Button variant='contained' color='primary' onClick={viewDisplay}>
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {search?.name === "Visual Activity" ? (
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
                    <TableCell className={classes.tableCell}>Question</TableCell>
                    <TableCell className={classes.tableCell}>Action</TableCell>
                  </TableRow>
                </TableHead>
                {activityCategory
                  ?.filter((response) =>
                    response?.name?.toLowerCase()?.includes(search?.name?.toLowerCase())
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
                        <TableCell className={classes.tableCells}>{response.sub_type ? response.sub_type : <b style={{ color: 'red' }}>NA</b>}</TableCell>
                        <TableCell className={classes.tableCells}>
                          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <DeleteOutlined style={{ cursor: 'pointer' }} />
                            <EditOutlined style={{ cursor: 'pointer' }} />
                          </div>
                        </TableCell>{' '}
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

        ) : (
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
                    <TableCell className={classes.tableCell}>Sub-Type Activity</TableCell>
                    <TableCell className={classes.tableCell}>Criteria Name</TableCell>

                    <TableCell className={classes.tableCell}>Rating </TableCell>
                    {search?.name == "Physical Activity" ? (
                      ""
                    ) : (
                      <TableCell className={classes.tableCell}>Score </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                {activityCategory
                  ?.filter((response) =>
                    response?.name?.toLowerCase()?.includes(search?.name?.toLowerCase())
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
                        <TableCell className={classes.tableCells}>{response.sub_type ? response.sub_type : <b style={{ color: 'red' }}>NA</b>}</TableCell>
                        <TableCell className={classes.tableCells}>
                          {response?.grading_scheme.map((obj) => (
                            <div>{obj.name}</div>
                          ))}
                        </TableCell>{' '}
                        <TableCell className={classes.tableCells}>
                          <Typography>
                            {response?.grading_scheme.map((obj) => (
                              <div>{obj.rating}</div>
                            ))}
                          </Typography>
                        </TableCell>
                        <TableCell className={classes.tableCells}>
                          <Typography>
                            {response?.grading_scheme.map((obj) => (
                              <div>{obj.score}</div>
                            ))}
                          </Typography>
                        </TableCell>
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

        )}


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
            <div style={{ fontSize: '28px', fontWeight: 'bold', width: '46vw' }}>Create Rating</div>
            <Divider />
            <div style={{ marginTop: '8px' }}>
              {/* <TextField
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
            </TextField> */}
              <Autocomplete
                size='small'
                style={{ width: '45%' }}
                onChange={(e, value) => setActivityType(value)}
                // id='branch_id'
                className='dropdownIcon'
                value={ActivityType}
                options={activityCategory || []}
                getOptionLabel={(option) => option?.name || ''}
                // getOptionSelected={(option, value) => option?.branch?.id == value?.branch?.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Activity Type'
                    placeholder='Activity Type'
                    required
                  />
                )}
              />

            </div>

            {ActivityType?.name == "Physical Activity" ? (
              <div style={{ width: '73vh', fontWeight: 400, marginTop: '10px', paddingLeft: '10px' }}>
                Sub-Activity Type :<b style={{ color: 'blue' }}> {ActivityType?.sub_type} </b>
              </div>
            ) : ""}
            {ActivityType?.name === "Visual Art" ? (
              <div className='row m-2'>
                <AntDivider orientation="left" plain>
                  Add Question
                </AntDivider>
                {visualInputlList ? visualInputlList.map((input, index) => (
                  <>
                    <div className='col-10'>
                      <Input
                        placeholder='Question'
                        width={100}
                        onChange={(event) => handleQuestion(event,index)}
                      />
                    </div>
                    <div className='col-2'>
                      <DeleteFilled onClick={() => handleRemoveVisual(index)} style={{ cursor: 'pointer' }} />
                    </div>

                  </>
                )) : (
                  "No Item In The List"
                )}

                <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
                  <AntButton icon={<PlusOutlined />} type="primary" onClick={handleVisualInputApp} >Add</AntButton>
                </div>
                <AntDivider orientation="left" plain>
                  Add Options
                </AntDivider>
                {optionList ? optionList.map((input, index) => (
                  <div className='row'>
                    <div className='col-6' style={{ padding: '0.5rem 0rem' }}>
                      <Input
                        placeholder='Option'
                        width={100}
                        onChange={(event) => handleOptionInput(event, index)}
                      />
                    </div>
                    <div className='col-3' style={{ padding: '0.5rem 0rem' }}>
                      <Input
                        placeholder='Marks'
                        width={100}
                        onChange={(event) => handleMarksInput(event, index)}
                      />
                    </div>
                    <div className='col-3'>
                      <DeleteFilled style={{ cursor: 'pointer' }} onClick={() => handleOptionDelete(index)} />
                    </div>
                  </div>

                )) : (
                  "No Option In The List"
                )}
                <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
                  <AntButton
                    icon={<PlusOutlined />}
                    onClick={handleOptionInputAdd}
                  >
                    Add Button
                  </AntButton>
                </div>
                <div className='col-12'
                >
                  <AntButton onClick={handleOptionSubmit}>
                    Submit
                  </AntButton>

                </div>
              </div>
            ) : (
              <>
                {inputList
                  ? inputList.map((input, index) => (
                    <>
                      <div style={{ marginTop: '1rem', display: 'flex' }}>
                        <TextField
                          label='Criteria Name'
                          size='small'
                          type='text'
                          onChange={(event) => handleInputCreativity(event, index)}
                          variant='outlined'
                        />
                        &nbsp;&nbsp;&nbsp;
                        {showPhy ? (
                          ""
                        ) : (
                          <>
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
                          </>
                        )}
                        <Button
                          style={{ marginLeft: '12px' }}
                          color='primary'
                          variant='contained'
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
                  variant='contained'
                  color='primary'

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
              </>


            )}
          </div>


        </Dialog>


        <AntDrawer
          title={`Add Parameters`}
          zIndex={1300}
          placement="right"
          width={window.innerWidth < 768 ? '90vw' : '450px'}
          // size='default'
          onClose={onCloseAnt}
          visible={antDrawer}
          // closable={false}
          open={antDrawer}
        // extra={
        //   <Space>
        //     <Button onClick={onClose}>Cancel</Button>
        //     <Button type="primary" onClick={onClose}>
        //       OK
        //     </Button>
        //   </Space>
        // }
        >

          <div className='action-filed'>
            {visualInputlList ? visualInputlList.map((input, index) => (
              <>
                <div className='row' style={{ marginTop: '1rem', display: 'flex' }}>
                  <div className='col-6'>

                  </div>
                  <div className='col-4'>
                    <Select
                      className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                      bordered={true}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      // value={selectedCategoryName}
                      placement='bottomRight'
                      placeholder='Select Option'
                      suffixIcon={<DownOutlined className='th-black-1' />}
                      dropdownMatchSelectWidth={false}
                      //  onChange={(e, val) => handleGradeChange(e, val)}
                      onChange={(e, val) => handleVisualChange(e, val)}
                      allowClear

                      menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
                    >
                      {visulaOptions}

                    </Select>
                  </div>
                  <div className='col-2'>
                    <DeleteFilled onClick={() => handleRemoveVisual(index)} style={{ cursor: 'pointer' }} />
                  </div>

                </div>
              </>
            )) : "No Item In The List"}
            <div style={{ padding: '0.5rem 0rem' }}>
              <AntButton type="primary" onClick={handleVisualInputApp} >Add</AntButton>

            </div>
            <div style={{ padding: '0.5rem 0rem', display: 'flex', alignItem: 'center', justifyContent: 'end' }}>
              <AntButton type="primary">Submit</AntButton>
            </div>

          </div>
        </AntDrawer>
        <AntDrawer
          title={`Options`}
          zIndex={1300}
          placement="right"
          width={window.innerWidth < 768 ? '90vw' : '450px'}
          // size='default'
          onClose={onCloseAnt}
          visible={onOptionVisible}
          open={onOptionVisible}
          extra={
            <Space>
              <AntButton
                icon={<PlusOutlined />}
                onClick={onOptionModalFun}
              >Add Options</AntButton>
            </Space>
          }
        >

          <div className='action-filed'>
            {visualInputlList ? visualInputlList.map((input, index) => (
              <>
                <div className='row' style={{ marginTop: '1rem', display: 'flex' }}>
                  <div className='col-6'>

                  </div>
                  <div className='col-4'>
                    <Select
                      className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                      bordered={true}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      // value={selectedCategoryName}
                      placement='bottomRight'
                      placeholder='Select Option'
                      suffixIcon={<DownOutlined className='th-black-1' />}
                      dropdownMatchSelectWidth={false}
                      //  onChange={(e, val) => handleGradeChange(e, val)}
                      onChange={(e, val) => handleVisualChange(e, val)}
                      allowClear

                      menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
                    >
                      {visulaOptions}

                    </Select>
                  </div>
                  <div className='col-2'>
                    <DeleteFilled onClick={() => handleRemoveVisual(index)} style={{ cursor: 'pointer' }} />
                  </div>

                </div>
              </>
            )) : "No Item In The List"}
            <div style={{ padding: '0.5rem 0rem' }}>
              <AntButton type="primary" onClick={handleVisualInputApp} >Add</AntButton>

            </div>
            <div style={{ padding: '0.5rem 0rem', display: 'flex', alignItem: 'center', justifyContent: 'end' }}>
              <AntButton type="primary">Submit</AntButton>
            </div>

          </div>
        </AntDrawer>
        <AntModal
          title="Add Options"
          centered
          open={onOptionModal}
          visible={onOptionModal}
          // onOk={() => setOnOptionModal(false)}
          onCancel={() => setOnOptionModal(false)}
        // width={1000}
        >
          <div style={{ border: '1px solid black', margin: '0.5rem 0rem' }}>
            <div className='col-10' style={{ padding: '0.5rem 0rem' }}>
              <Input
                placeholder='Question'
                width={100}
              // onChange={(e, value) => setOptionTitle(value)}
              // onChange={(e) => handleOptionTitle(e)}


              />
            </div>
            <div className='col-2'>
            </div>
            {optionList ? optionList.map((input, index) => (
              <div className='row'>
                {/* <Space> */}

                <div className='col-6' style={{ padding: '0.5rem 0rem' }} >
                  <Input
                    placeholder='Option'
                    width={100}
                    onChange={(event) => handleOptionInput(event, index)}
                  />
                </div>
                <div className='col-6' style={{ padding: '0.5rem 0rem' }}>
                  <Input
                    placeholder='Marks'
                    width={100}
                    onChange={(event) => handleMarksInput(event, index)}
                  />
                </div>
                {/* </Space> */}
              </div>
            )) : "No Item In The List"}
            <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
              <AntButton
                icon={<PlusOutlined />}
                onClick={handleOptionInputAdd}
              >
                Add Button
              </AntButton>
            </div>
            <div className='col-12'
            // onClick={handleOptionSubmit}
            >
              <AntButton onClick={handleOptionSubmit}>
                Submit
              </AntButton>

            </div>

          </div>
        </AntModal>

      </Layout>
    </div>
  );
};
export default RatingCreate;
