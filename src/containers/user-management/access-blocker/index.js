import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Input,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { Divider, TextField } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axiosInstance from '../../../config/axios';
import endpoints from 'config/endpoints';
import FileSaver from 'file-saver';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import { connect, useSelector } from 'react-redux';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
//import exportFromJSON from 'export-from-json';
import { CSVLink } from 'react-csv';
import TablePagination from '@material-ui/core/TablePagination';
import './access.scss';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  paperStyled: {
    minHeight: '80vh',
    height: '100%',
    padding: '50px',
    marginTop: '15px',
  },
  guidelinesText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color : theme.palette.secondary.main
  },
  errorText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fe6b6b',
    marginBottom: '30px',
    display: 'inline-block',
  },
  table: {
    minWidth: 650,
  },
  downloadExcel: {
    float: 'right',
    fontSize: '16px',
    // textDecoration: 'none',
    // backgroundColor: '#fe6b6b',
    // color: '#ffffff',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  guidelineval : {
    color: theme.palette.primary.main,
     fontWeight: '600'
},
guideline:{
    color: theme.palette.secondary.main,
     fontSize: '16px',
      padding: '10px'
}
}));

const guidelines = [
  {
    name: '',
    field: "Please don't remove or manipulate any header in the file format",
  },
  { name: 'Erp Code', field: ' is a mandatory field, Example: 2003970002_OLV' },
  { name: 'Is_lesson_plan', field: ' is a mandatory field' },
  { name: 'Is_online_class', field: ' is a mandatory field' },
  { name: 'Is_ebook', field: ' is a mandatory field' },
  { name: 'Is_ibook', field: ' is a mandatory field' },
  { field: ' If access is need please mention as “0”' },
  { field: ' If access has to remove mention as “1”' },
];

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(Button);

const StyledButtonUnblock = withStyles({
  root: {
    backgroundColor: '#228B22',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#228B22 !important',
    },
  },
})(Button);

const StyledButtonBlock = withStyles({
  root: {
    backgroundColor: '#FF2E2E',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#FF2E2E !important',
    },
  },
})(Button);

const StyledClearButton = withStyles((theme)=>({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    padding: '8px 15px',
    marginLeft: '30px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
}))(Button);

const AccessBlocker = () => {
  const classes = useStyles({});
  const fileRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const [file, setFile] = useState(null);
  const [uploadFlag, setUploadFlag] = useState(false);
  const [data, setData] = useState([]);
  const [failed, setFailed] = useState(false);
  const [excelData] = useState([]);
  const [academicYear, setAcademicYear] = useState();
  const [moduleId, setModuleId] = useState('');
  // const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [bulkUpload, setBulkUpload] = useState(true);
  const [isLesson, setIsLesson] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [isNewSeach, setIsNewSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [ studentList , setStudentList ] = useState([]);
  const [page, setPage] = useState('1');
  const [checkFilter , setCheckFilter] = useState(false);


  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Access-Blocker') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }

    axiosInstance
        .get(`erp_user/user-access-block-list/?page=${currentPage}&page_size=${limit}`)
        .then((res) => {
          console.log(res);
          setStudentList(res.data.result.results)
          setTotalCount(res.data.result.count)
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });

  }, []);

  useEffect(() => {
    getUserList();
  },[currentPage]);

  useEffect(() => {
    getUserList();
  },[searchText]);

  const handleTextSearch = (e) => {
    setIsNewSearch(true);
    setSearchText(e.target.value);
    console.log(e.target.value.length, "event");
    if(e.target.value.length === 0) {
    setIsNewSearch(false);
    }
  };

  const getUserList = () => {
    if (isNewSeach) {
      axiosInstance
      .get(`erp_user/user-access-block-list/?page=${currentPage}&page_size=${limit}&search=${searchText}`)
      .then((res) => {
        console.log(res);
        setStudentList(res.data.result.results)
        setTotalCount(res.data.result.count)
      })
      .catch((error) => {
        setAlert('error', 'Something Wrong!');
      });
    } else {
    axiosInstance
    .get(`erp_user/user-access-block-list/?page=${currentPage}&page_size=${limit}`)
    .then((res) => {
      console.log(res);
      setStudentList(res.data.result.results)
      setTotalCount(res.data.result.count)
    })
    .catch((error) => {
      setAlert('error', 'Something Wrong!');
    });
  }
  }

  const filterBlockList = () => {
    if (checkFilter) {
    axiosInstance
    .get(`erp_user/user-access-block-list/?page=${currentPage}&page_size=${limit}&academic_year=${selectedAcademicYear.id}&branch=${selectedBranch.branch.id}&grade=${selectedGrade.id}&section=${selectedSection.id}`)
    .then((res) => {
      console.log(res);
      setStudentList(res.data.result.results)
      setTotalCount(res.data.result.count)
    })
    .catch((error) => {
      setAlert('error', 'Something Wrong!');
    });
  } else {
    setAlert('error',"All fields are mandatory")
  }
  }

  const unblockAll = (items) =>{
    axiosInstance
    .put(`erp_user/user-access-block-list/`,{
      is_lesson_plan : false,
      is_ebook: false,
      is_online_class: false,
      is_ibook : false,
      erp_id : items?.erp_user?.erp_id,
      erp_user_id: items?.erp_user?.id
    })
    .then((res) => {
      console.log(res);
      setAlert('success',res?.data?.message)
      getUserList();
    })
  }

  const changeLesson = (items) => {
    console.log(items , "items");
    if (items.is_lesson_plan === true) {
      axiosInstance
    .put(`erp_user/user-access-block-list/`,{
      is_lesson_plan : false,
      is_ebook: items?.is_ebook,
      is_online_class: items.is_online_class,
      erp_id : items?.erp_user?.erp_id,
      erp_user_id: items?.erp_user?.id
    })
    .then((res) => {
      console.log(res);
      setAlert('success',res?.data?.message)
      getUserList();
    })
    } else {
      axiosInstance
    .put(`erp_user/user-access-block-list/`,{
      is_lesson_plan : true,
      is_ebook: items?.is_ebook,
      is_online_class: items.is_online_class,
      erp_id : items?.erp_user?.erp_id,
      erp_user_id: items?.erp_user?.id
    })
    .then((res) => {
      console.log(res);
      setAlert('success',res?.data?.message)
      getUserList();
    })
    }
  }

  const changeOnlineClass = (items) => {
    console.log(items , "items");
    if (items.is_online_class === true) {
      axiosInstance
    .put(`erp_user/user-access-block-list/`,{
      is_lesson_plan : items?.is_lesson_plan,
      is_ebook: items?.is_ebook,
      is_online_class: false,
      erp_id : items?.erp_user?.erp_id,
      erp_user_id: items?.erp_user?.id
    })
    .then((res) => {
      console.log(res);
      setAlert('success',res?.data?.message)
      getUserList();
    })
    } else {
      axiosInstance
    .put(`erp_user/user-access-block-list/`,{
      is_lesson_plan : items?.is_lesson_plan,
      is_ebook: items?.is_ebook,
      is_online_class: true,
      erp_id : items?.erp_user?.erp_id,
      erp_user_id: items?.erp_user?.id
    })
    .then((res) => {
      console.log(res);
      setAlert('success',res?.data?.message)
      getUserList();
    })
    }
  }

  const changeEbook = (items) => {
    console.log(items , "items");
    if (items.is_ebook === true) {
      axiosInstance
    .put(`erp_user/user-access-block-list/`,{
      is_lesson_plan : items?.is_lesson_plan,
      is_ebook: false,
      is_online_class: items?.is_online_class,
      erp_id : items?.erp_user?.erp_id,
      erp_user_id: items?.erp_user?.id
    })
    .then((res) => {
      console.log(res);
      setAlert('success',res?.data?.message)
      getUserList();
    })
    } else {
      axiosInstance
    .put(`erp_user/user-access-block-list/`,{
      is_lesson_plan : items?.is_lesson_plan,
      is_ebook: true,
      is_online_class: items?.is_online_class,
      erp_id : items?.erp_user?.erp_id,
      erp_user_id: items?.erp_user?.id
    })
    .then((res) => {
      console.log(res);
      setAlert('success',res?.data?.message)
      getUserList();
    })
    }
  }

  const headers = [
    { label: 'ERP Code', key: 'erp_id' },
    { label: 'Error', key: 'error_msg' },
  ];

  useEffect(() => {
    if (moduleId && selectedAcademicYear) {
      axiosInstance
        .get(`erp_user/branch/?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`)
        .then((res) => {
          // setAcademicYear(res?.data?.data);
          setBranchList(res?.data?.data?.results);
          console.log(res.data.data, 'academic');
          // const defaultValue = res?.data?.data?.[0];
          // handleAcademicYear(defaultValue);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId , selectedAcademicYear]);

  const handleYear = (event, value) => {
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    // setSelectedAcadmeicYear(value);
    setCheckFilter(false);
    if (value?.id) {
      axiosInstance
        .get(`erp_user/branch/?session_year=${value?.id}&module_id=${moduleId}`)
        .then((result) => {
          setBranchList(result?.data?.data?.results);
          console.log(result?.data?.data?.results, 'branch');
        })
        .catch((error) => {
          console.log('');
        });
    }
  };

  const handleBranch = ( event , value ) => {
    console.log(value , "branch");
    setSelectedGrade([]);
    setSelectedSection([]);
    setCheckFilter(false);
    setSelectedBranch(value);
    if (value?.id) {
      axiosInstance
        .get(`erp_user/grademapping/?session_year=${selectedAcademicYear?.id}&branch_id=${value.branch.id}&module_id=${moduleId}`)
        .then((result) => {
          setGradeList(result?.data?.data);
          console.log(result, 'branch');
        })
        .catch((error) => {
          console.log('');
        });
    }
  }

  const handleGrade = ( event , value ) => {
    setSelectedSection([]);
    setCheckFilter(false);
    setSelectedGrade(value);
    if (value?.id) {
      axiosInstance
        .get(`erp_user/sectionmapping/?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch.branch.id}&grade_id=${value.grade_id}&module_id=${moduleId}`)
        .then((result) => {
          setSectionList(result?.data?.data);
          console.log(result, 'section');
        })
        .catch((error) => {
          console.log('');
        });
    }
  }

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleAcademicYear = (value) => {
    // setSelectedAcadmeicYear(value);
    console.log(selectedAcademicYear, 'test');
    if (value?.id) {
      axiosInstance
        .get(`erp_user/branch/?session_year=${value?.id}&module_id=${moduleId}`)
        .then((result) => {
          setBranchList(result?.data?.data?.results);
          console.log(result?.data?.data?.results, 'branch');
        })
        .catch((error) => {
          console.log('');
        });
    }
  };

  const handleFileChange = (event) => {
    const { files } = event.target;
    const fil = files[0] || '';
    if (fil.name.lastIndexOf('.xls') > 0 || fil.name.lastIndexOf('.xlsx') > 0) {
      setFile(fil);
    } else {
      setFile(null);
      fileRef.current.value = null;
      setAlert(
        'error',
        'Only excel file is acceptable either with .xls or .xlsx extension'
      );
    }
  };

  const handleClearAll = () => {
    fileRef.current.value = null;
    // setSelectedAcadmeicYear();
    setSelectedBranch();
  };

  const handleClearAllList = () => {
    // setSelectedAcadmeicYear();
    setSelectedBranch();
    setSelectedGrade();
    setSelectedSection();
    getUserList();
    setCheckFilter(false);
  };

  const checkUpload = () => {
    setSelectedBranch();
    console.log(bulkUpload, 'bulk');
    if (bulkUpload === true) {
      setBulkUpload(false);
    } else {
      setBulkUpload(true);
    }
  };

  const checkLesson = (e) => {
    setIsLesson(e);
    console.log(e, 'event');
  };

  const branchCheck = () => {
    if (selectedBranch.length === 0) {
      setAlert('warning', 'Please select branch');
      console.log(selectedBranch.length);
    } else {
      setAlert('warning', 'mil gya');
    }
  };

  const handleFileUpload = () => {
    let token = JSON.parse(localStorage.getItem('userDetails')).token || {};
    setFailed(false);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('academic_year', selectedAcademicYear?.id);
    formData.append('branch', selectedBranch?.branch?.id);
    console.log(file, 'file');
    if (selectedBranch.length === 0) {
      setAlert('warning', 'Please select branch');
      console.log(selectedBranch.length);
    } else {
      if (file) {
        console.log(formData, 'formdata');
        setUploadFlag(true);
        axiosInstance
          .post(`/erp_user/block-user-bulk-upload/`, formData, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
          .then((result) => {
            setAlert('success', 'Excel file submited successfully');
            getUserList();
            function addDataToExcel(xlsData) {
              xlsData.map((record) => {
                excelData.push({
                  erp_id: Object.keys(record),
                  error_msg: Object.values(record),
                });
              });
            }
            if (result.data?.data.length > 0) {
              setFailed(true);
              setData(result.data.data);
              addDataToExcel(result.data.data);
            }
            setUploadFlag(false);
            fileRef.current.value = null;
            setSelectedBranch([]);
            // setSelectedAcadmeicYear([]);
          })
          .catch((error) => {
            setAlert('error', 'Something Wrong!');
            setUploadFlag(false);
          });
      } else {
        setAlert('warning', 'Please select file');
      }
    }
  };


  // const fileName = 'error_list'
  // const exportType = 'xls'

  // const ExportToExcel = () => {
  //     exportFromJSON({ data, fileName, exportType })
  // }

  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
          <CommonBreadcrumbs
            componentName='User Management'
            childComponentName='Access Blocker'
            isAcademicYearVisible={true}
          />
        <Grid item md={3} xs={12} style={{ margin: '20px 20px' }}>
          {bulkUpload ? (
            <StyledButton onClick={checkUpload}>View List</StyledButton>
          ) : (
            <StyledButton onClick={checkUpload}>Bulk Upload</StyledButton>
          )}
        </Grid>
        {bulkUpload ? (
          <Grid container>
            {/* <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleYear}
                id='branch_id'
                className='dropdownIcon'
                value={selectedAcademicYear || ''}
                options={academicYear || ''}
                getOptionLabel={(option) => option?.session_year || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Academic Year'
                    placeholder='Academic Year'
                  />
                )}
              />
            </Grid> */}

            <Grid item md={3} xs={12} className="bulkBranch" style={{ margin: '0 20px' }}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedBranch([]);
                  if (value) {
                    setSelectedBranch(value);
                    console.log(value, 'branch id');
                  }
                }}
                id='branch_id'
                className='dropdownIcon'
                value={selectedBranch || ''}
                options={branchList || ''}
                getOptionLabel={(option) => option?.branch?.branch_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Branch'
                    placeholder='Branch'
                  />
                )}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Box display='flex' flexDirection='column' style={{ marginLeft: '30px' }}>
                <Input
                  type='file'
                  inputRef={fileRef}
                  inputProps={{ accept: '.xlsx,.xls' }}
                  onChange={handleFileChange}
                />
                <Box display='flex' flexDirection='row' style={{ color: 'gray' }}>
                  <Box p={1}>
                    {`Download Format: `}
                    <a
                      style={{ cursor: 'pointer' }}
                      href='/assets/download-format/access.xlsx'
                      download='format.xlsx'
                    >
                      Download format
                    </a>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid sm={2} xs={6}>
              <StyledClearButton onClick={handleClearAll}>Clear All</StyledClearButton>
            </Grid>
            <Grid sm={2} xs={6}>
              <StyledButton onClick={handleFileUpload}>Upload</StyledButton>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paperStyled}>
                {failed && (
                  <div style={{ marginBottom: '30px' }}>
                    <Typography className={classes.errorText}>
                      Error: <span style={{ color: '#014b7e' }}>Failed records</span>
                    </Typography>
                    <CSVLink
                      data={excelData}
                      headers={headers}
                      filename={'error_list.xls'}
                      className={classes.downloadExcel}
                    >
                      Download Excel
                    </CSVLink>
                    {/* <StyledButton onClick={(e) => ExportToExcel()} style={{float: 'right'}}>Download Excel</StyledButton> */}

                    <TableContainer component={Paper}>
                      <Table className={classes.table} aria-label='simple table'>
                        <TableHead>
                          <TableRow>
                            <TableCell align='left'>ERP Code</TableCell>
                            <TableCell>Error Message</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.map((row) => (
                            <TableRow key={row.name}>
                              <TableCell component='th' scope='row' align='left'>
                                {Object.keys(row)}
                              </TableCell>
                              <TableCell>
                                <span style={{ color: 'red' }}>{Object.values(row)}</span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
                <Typography className={classes.guidelinesText}>Guidelines:</Typography>
                {guidelines.map((val, i) => {
                  return (
                    <div className={classes.guideline}>
                                        {i + 1}. 
                                        <span className = {classes.guidelineval}>
                                            {val.name}
                                        </span>
                      <span>{val.field}</span>
                    </div>
                  );
                })}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <div className="listcontainer">
            <div className='filterStudent'>
              {/* <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleYear}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedAcademicYear || ''}
                  options={academicYear || ''}
                  getOptionLabel={(option) => option?.session_year || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Academic Year'
                      placeholder='Academic Year'
                    />
                  )}
                />
              </Grid> */}

              <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
                <Autocomplete
                  // multiple
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleBranch}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedBranch || ''}
                  options={branchList || ''}
                  getOptionLabel={(option) => option?.branch?.branch_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Branch'
                      placeholder='Branch'
                    />
                  )}
                />
              </Grid>

              <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
                <Autocomplete
                  // multiple
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleGrade}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedGrade || ''}
                  options={gradeList || ''}
                  getOptionLabel={(option) => option?.grade__grade_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Grade'
                      placeholder='Grade'
                    />
                  )}
                />
              </Grid>

              <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
                <Autocomplete
                  // multiple
                  style={{ width: '100%' }}
                  size='small'
                  onChange={(event, value) => {
                    setSelectedSection([]);
                    if (value) {
                      setSelectedSection(value);
                      setCheckFilter(true);
                      console.log(value, 'section id');
                    }
                  }}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedSection || ''}
                  options={sectionList || ''}
                  getOptionLabel={(option) => option?.section__section_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Section'
                      placeholder='Section'
                    />
                  )}
                />
              </Grid>
            </div>
            <div className="filterArea" >
            <Grid sm={2} xs={6}>
              <StyledClearButton onClick={handleClearAllList}>Clear All</StyledClearButton>
            </Grid>
            <Grid sm={2} xs={6}>
              <StyledButton onClick={filterBlockList} >Filter</StyledButton>
            </Grid>
            </div>
            <Paper className={`${classes.root} common-table`} id='singleStudent'>
              <div className="searchArea" >
              <FormControl
                variant='outlined'
                className='searchViewUser'
                size='small'
              >
                <InputLabel>Search ERP</InputLabel>
                <OutlinedInput
                  endAdornment={<SearchOutlined color='primary' />}
                  placeholder='Search erp'
                  label='Search'
                  value={searchText}
                  onChange={handleTextSearch}
                />
              </FormControl>
              </div>
              <TableContainer
                className={`table table-shadow view_users_table ${classes.container}`}
              >
                <Table stickyHeader aria-label='sticky table'>
                  <TableHead className={`${classes.columnHeader} table-header-row`}>
                    <TableRow>
                      <TableCell className={classes.tableCell}>ERP Id</TableCell>
                      <TableCell className={classes.tableCell}>Name</TableCell>
                      <TableCell className={classes.tableCell}>Modules</TableCell>
                      <TableCell className={classes.tableCell}>Action</TableCell>
                      {/* <TableCell className={classes.tableCell}>Edit</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentList.map((items, i) => (
                      <TableRow key={items.id}>
                        <TableCell className={classes.tableCell}>
                          {items?.erp_user?.erp_id}
                        </TableCell>
                        <TableCell className={classes.tableCell}>{items?.erp_user?.name}</TableCell>
                        <TableCell className={classes.tableCell} id="blockArea" >
                          <div className='Module-container'>
                            <div className='lessonPlan'>
                              <p>Lesson Plan</p>
                              {items.is_lesson_plan ? (
                                <StyledButtonUnblock onClick={()=>changeLesson(items)} >UnBlock</StyledButtonUnblock>
                                ) : (
                                <StyledButtonBlock onClick={()=>changeLesson(items)}>Block</StyledButtonBlock>
                              )}
                            </div>
                            <div className='lessonPlan'>
                              <p>Online Class</p>
                              {items.is_online_class ? (
                              <StyledButtonUnblock onClick={()=>changeOnlineClass(items)} >UnBlock</StyledButtonUnblock>
                                ) : (
                              <StyledButtonBlock onClick={()=>changeOnlineClass(items)} >Block</StyledButtonBlock>
                              )}
                            </div>
                            <div className='lessonPlan'>
                              <p>Ebook</p>
                              {items.is_ebook ? (
                                <StyledButtonUnblock onClick={()=>changeEbook(items)} >UnBlock</StyledButtonUnblock>
                                ) : (
                                <StyledButtonBlock onClick={()=>changeEbook(items)} >Block</StyledButtonBlock>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <StyledButton onClick={()=>unblockAll(items)} >Unblock All</StyledButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component='div'
                count={totalCount}
                rowsPerPage={limit}
                page={Number(currentPage) - 1}
                onChangePage={(e, page) => {
                  handlePagination(e, page + 1);
                }}
                rowsPerPageOptions={false}
                className='table-pagination'
                classes={{
                  spacer: classes.tablePaginationSpacer,
                  toolbar: classes.tablePaginationToolbar,
                }}
              />
            </Paper>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AccessBlocker;
