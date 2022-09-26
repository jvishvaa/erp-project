import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

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
} from '@material-ui/core';
import Layout from 'containers/Layout';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Box from '@material-ui/core/Box';
import { useTheme, withStyles } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useHistory } from 'react-router-dom';
import MyTinyEditor from 'containers/question-bank/create-question/tinymce-editor';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RatingScale from './RatingScale';

import './styles.scss';

import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import StarsIcon from '@material-ui/icons/Stars';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

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
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  buttonColor: {
    color: 'white',
    backgroundColor: `${theme.palette.primary.main} !important`,
    borderRadius: '5px',
  },
  
  buttonColor1: {
    color: 'green !important',
    backgroundColor: 'white',
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

const Shortlisted = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  const  ActivityId  = JSON.parse(localStorage.getItem('ActivityId')) || {};

  const [totalSubmitted, setTotalSubmitted] = useState([]);

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
  const [value, setValue] = useState(0);

  const [desc, setDesc] = useState('');

  const [startDate, setStartDate] = useState(null);

  const [dropdownData, setDropdownData] = React.useState({
    branch: [],
    grade: [],
  });
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const [filterData, setFilterData] = React.useState({
    branch: '',
    year: '',
  });
  useEffect(() => {
    handleAcademicYear('', selectedAcademicYear);
    setFilterData({
      branch: '',
      grade: '',
    });
  }, [moduleId]);

  function getBranch(acadId) {
    axiosInstance
      .get(`${endpoints.academics.branches}?session_year=${acadId}&module_id=${moduleId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              branch: result.data?.data?.results,
            };
          });
        }
      })
      .catch((error) => {});
  }

  const handleAcademicYear = (event, value) => {
    setDropdownData({
      ...dropdownData,
      branch: [],
      grade: [],
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
    });
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
    if (value) {
      getBranch(value?.id);
      setFilterData({ ...filterData, selectedAcademicYear });
    }
  };

  function getGrade(acadId, branchId) {
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${acadId}&branch_id=${branchId}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              grade: result.data?.data,
            };
          });
        }
      })
      .catch((error) => {});
  }

  const handleBranch = (event, value) => {
    setDropdownData({
      ...dropdownData,
      grade: [],
    });
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
    });
    if (value) {
      getGrade(selectedAcademicYear?.id, value?.branch?.id);
      setFilterData({ ...filterData, branch: value });
      const selectedId = value?.branch?.id;
      setSelectedBranch(value);
      setSelectedBranchIds(selectedId);
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedId}&module_id=${moduleId}`,
        'gradeList'
      );
    }
  };

  const handleGrade = (event = {}, value = []) => {
    if (value) {
      setSectionList([]);
      setSelectedSection([]);
      setSelectedSectionIds('');

      const selectedId = value?.grade_id;
      setSelectedGrade(value);
      setSelectedGradeIds(selectedId);
      callApi(
        `${endpoints.academics.sections}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${selectedBranchIds}&grade_id=${selectedId?.toString()}&module_id=${moduleId}`,
        'section'
      );
    } else {
      setSelectedGrade([]);
      setSectionList([]);
      setSelectedSection([]);
      setSelectedGradeIds('');
      setSelectedSectionIds('');
    }
  };

  const handleSection = (event = {}, value = []) => {
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...sectionList].filter(({ id }) => id !== 'all')
          : value;
      const selectedsecctionId = value.map((item) => item.section_id || []);
      // const selectedsecctionId = value?.section_id;
      const sectionid = value.map((item) => item.id || []);
      // const sectionid = value?.id;
      setSectionId(sectionid);
      setSelectedSection(value);
      setSelectedSectionIds(selectedsecctionId);
    } else {
      setSectionId('');
      setSelectedSection([]);
      setSelectedSectionIds('');
    }
  };

  function callApi(api, key) {
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            const selectAllObject = {
              session_year: {},
              id: 'all',
              section__section_name: 'Select All',
              section_name: 'Select All',
              section_id: 'all',
            };
            const data = [selectAllObject, ...result?.data?.data];
            setSectionList(data);
          }
        } else {
          console.log('error', result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleEditorChange = (content, editor) => {
    setDesc(content);
  };
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
  const statuss = [
    { label: 'Assigned', value: '1' },
    { label: 'Unassigned', value: '2' },
  ];
  const handleChanges = (event) => {
    setMonth(event.target.value);
  };
  const handleStatus = (event, val) => {
    setStatus(val);
  };

  const viewBlog = () => {
    history.push('/blog/blogview');
  };

  const getTotalSubmitted = () => {
    axios
      .get(
        `${endpoints.newBlog.studentSideApi}?section_ids=null&user_id=null&activity_detail_id=null&is_reviewed=True&is_bookmarked=True`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        console.log(response, 'response');
        setTotalSubmitted(response?.data?.result);
      });
  };

  useEffect(() => {
    getTotalSubmitted();
  }, []);

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
    history.push('/blog/blogview');
  };

  

  return (
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

      <Grid container style={{ paddingTop: '25px', paddingLeft: '23px' }}>
        <Grid item md={2}>
          <TextField
            select
            style={{ borderRadius: '1px', width: '160px' }}
            size='small'
            // value={month}
            // onChange={handleChanges}
            SelectProps={{
              native: true,
            }}
            variant='outlined'
          >
            {months.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={3}>
          <TextField
            select
            style={{ borderRadius: '1px', width: '218px' }}
            size='small'
            // value={month}
            // onChange={handleChanges}
            SelectProps={{
              native: true,
            }}
            variant='outlined'
          >
            {blogsContent.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={2}>
          <Button
            variant='contained'
            color='primary'
            size='medium'
            className={classes.buttonColor}
          >
            Filter
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        style={{
          display: 'flex',
          paddingLeft: '24px',
          paddingRight: '42px',
          paddingTop: '31px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Grid item>
          <Button
            variant='contained'
            color='primary'
            size='medium'
            className={classes.buttonColor}
          >
            Shortlisted({totalSubmitted?.length})
          </Button>
        </Grid>
        <Grid item style={{fontSize:"16px"}}>
          <StarsIcon style={{ color: '#F7B519' }} /> Published
        </Grid>
      </Grid>
      <Paper className={`${classes.root} common-table`} id='singleStudent'>
        <TableContainer
          className={`table table-shadow view_users_table ${classes.container}`}
        >
          <Table stickyHeader aria-label='sticky table'>
            <TableHead className={`${classes.columnHeader} table-header-row`}>
              <TableRow>
                <TableCell className={classes.tableCell} style={{ whiteSpace: 'nowrap' }}>
                  S No.
                </TableCell>
                <TableCell className={classes.tableCell}>Student Name</TableCell>
                {/* <TableCell className={classes.tableCell}>Grade</TableCell> */}
                <TableCell className={classes.tableCell}>Submission Date</TableCell>
                <TableCell className={classes.tableCell}>Overall Score</TableCell>
                <TableCell className={classes.tableCell}></TableCell>
                <TableCell className={classes.tableCell}>Action</TableCell>
              </TableRow>
            </TableHead>
            {totalSubmitted?.map((response, index)=> (   

            <TableBody>
              <TableRow
                hover
                role='checkbox'
                tabIndex={-1}
                // key={`user_table_index${i}`}
              >
                <TableCell className={classes.tableCells}>{index+1}</TableCell>
                <TableCell className={classes.tableCells}>{response?.booked_user?.username}</TableCell>
                {/* <TableCell className={classes.tableCells}>Grade 1</TableCell> */}
                <TableCell className={classes.tableCells}>{response?.submitted_on.slice(0,10)}</TableCell>
                <TableCell className={classes.tableCells}>
                  {' '}
                  <Box component='fieldset' mb={3} borderColor='transparent'>
                  
                    <RatingScale
                            name={`rating${index}`}
                            size='small'
                            readOnly
                            rating={response?.user_reviews?.given_rating}
                            // defaultValue={props.defaultValue}
                           
                            
                          />
                  </Box>
                </TableCell>
                <TableCell className={classes.tableCells}>
                  <StarsIcon style={{ color: '#F7B519' }} />
                </TableCell>

                <TableCell className={classes.tableCells}>
                  <Button
                    variant='outlined'
                    size='small'
                    className={classes.buttonColor2}
                  >
                    Unpublish
                  </Button>{' '}
                  &nbsp;
                  <Button
                    variant='outlined'
                    size='small'
                    className={classes.buttonColor1}
                  >
                    Check Review{' '}
                  </Button>{' '}
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
    </Layout>
  );
};
export default Shortlisted;
