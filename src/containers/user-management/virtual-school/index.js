import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  Box,
  Typography,
  TextField,
  Input
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import axiosInstance from '../../../config/axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
//import exportFromJSON from 'export-from-json';
import { CSVLink } from 'react-csv';
import TablePagination from '@material-ui/core/TablePagination';
// import UploadExcel from 'components/excel_upload/excelUpload';
import NoFilterData from 'components/noFilteredData/noFilterData';
import Loader from 'components/loader/loader';
// import './access.scss';

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
    field: "Please Don't Erase or Edit any header in the file format",
  },
  { name: 'Erp', field: ' is a mandatory field, Example: 2003970002_OLV' },
  { name: 'Grade', field: ' is a mandatory field' },
  { name: 'Present Branch', field: ' is a mandatory field' },
  { name: 'Section', field: ' is a mandatory field' },
  { name: 'New Branch', field: ' is a mandatory field' },
  { field: 'Acad Session, is a mandatory field, Example : 2022-2023' },
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

const VirtualSchool = () => {
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
  const [studentList, setStudentList] = useState([]);
  const [page, setPage] = useState('1');
  const [checkFilter, setCheckFilter] = useState(false);
  const [loading , setLoading] = useState(false)
  const [actualBranch , setActualBranch] = useState()
  const [virtualBranch , setVirtualBranch] = useState()


  useEffect(() => {
    setLoading(true)
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Virtual School') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }

    axiosInstance
      .get(`/erp_user/virtual-school-details/?page=${currentPage}&page_size=${limit}`)
      .then((res) => {
        setLoading(false)
        console.log(res);
        setStudentList(res.data.result.results);
        setTotalCount(res.data.result.count);
      })
      .catch((error) => {
        setLoading(false)
        setAlert('error', 'Something Wrong!');
      });
  }, []);

  useEffect(() => {
    getUserList();
  }, [currentPage,searchText]);

  const handleTextSearch = (e) => {
    setIsNewSearch(true);
    setSearchText(e.target.value);
    console.log(e.target.value.length, 'event');
    if (e.target.value.length === 0) {
      setIsNewSearch(false);
    }
  };

  const getUserList = () => {
    setLoading(true)
    if (isNewSeach) {
      axiosInstance
        .get(
          `/erp_user/virtual-school-details/?page=${currentPage}&page_size=${limit}&erp_id=${searchText}`
        )
        .then((res) => {
          setLoading(false)
          console.log(res);
          setStudentList(res.data.result.results);
          setTotalCount(res.data.result.count);
        })
        .catch((error) => {
          setLoading(false)
          setAlert('error', 'Something Wrong!');
        });
    } else {
      axiosInstance
      .get(
        `/erp_user/virtual-school-details/?page=${currentPage}&page_size=${limit}`
      ).then((res) => {
        setLoading(false)
          console.log(res);
          setStudentList(res.data.result.results);
          setTotalCount(res.data.result.count);
        })
        .catch((error) => {
          setLoading(false)
          setAlert('error', 'Something Wrong!');
        });
    }
  };

  const filterList = () => {
    setLoading(true)
    if (actualBranch || virtualBranch) {
      let url = `/erp_user/virtual-school-details/?page=${currentPage}&page_size=${limit}`
      if(virtualBranch){
        url += `&virtual_branch=${virtualBranch?.branch?.id}`
      }
      if(actualBranch){
        url += `&actual_branch=${actualBranch?.branch?.id}`
      }
      axiosInstance
        .get(url)
        .then((res) => {
          setLoading(false)
          console.log(res);
          setStudentList(res.data.result.results);
          setTotalCount(res.data.result.count);
        })
        .catch((error) => {
          setLoading(false)
          setAlert('error', 'Something Wrong!');
        });
    } else {
      setLoading(false)
      setAlert('error', 'All fields are mandatory');
    }
  };

  const headers = [
    { label: 'ERP Code', key: 'erp_id' },
    { label: 'Error', key: 'error_msg' },
  ];

  useEffect(() => {
    if (moduleId && selectedAcademicYear) {
      axiosInstance
        .get(
          `erp_user/branch/?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
        )
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
  }, [moduleId, selectedAcademicYear]);

  const handleActualBranch = (e , value) => {
    setActualBranch()
    if(value){
      setActualBranch(value)
    }
  }
  const handleVirtualBranch = (e , value) => {
    setVirtualBranch()
    if(value)  {
      setVirtualBranch(value)
    }  

      }

  const handlePagination = (event, page) => {
    setCurrentPage(page);
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
    setFile(null);
    fileRef.current.value = null;
    // setSelectedAcadmeicYear();
    setSelectedBranch([]);
  };

  const handleClearAllList = () => {
    // setSelectedAcadmeicYear();
    setActualBranch();
    setVirtualBranch();
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

const handleFileDelete = () => {
  setLoading(true)
  let token = JSON.parse(localStorage.getItem('userDetails')).token || {};
  setFailed(false);
  const formData = new FormData();
  formData.append('file', file);

  var config = {
    method: 'delete',
    url: `/erp_user/virtual-school-bulk-remove/?academic_year=${selectedAcademicYear?.id}&branch=${selectedBranch?.branch?.id}`,
    headers: {
      Authorization: 'Bearer ' + token,
    },
    data : formData
  };
  // formData.append('academic_year', selectedAcademicYear?.id);
  // formData.append('branch', selectedBranch?.branch?.id);
  if (selectedBranch.length === 0) {
    setAlert('warning', 'Please select branch');
    console.log(selectedBranch.length);
  } else {
    if (file) {
      console.log(formData, 'formdata');
      setUploadFlag(true);
      axiosInstance(config)
        .then((result) => {
          setLoading(false)
          setAlert('success', 'Excel file Deleted successfully');
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
          setFile(null);
          fileRef.current.value = null;
          setSelectedBranch([]);
          // setSelectedAcadmeicYear([]);
        })
        .catch((error) => {
          setLoading(false)
          setAlert('error', 'Uploaded Format is Incorrect');
          setUploadFlag(false);
        });
    } else {
      setLoading(false)
      setAlert('warning', 'Please select file');
    }
  }
}

  const handleFileUpload = () => {
    setLoading(true)
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
          .put(`/erp_user/virtual-school-bulk-upload/`, formData, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
          .then((result) => {
            setLoading(false)
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
            setFile(null);
            fileRef.current.value = null;
            setSelectedBranch([]);
            // setSelectedAcadmeicYear([]);
          })
          .catch((error) => {
            setLoading(false)
            setAlert('error', 'Uploaded Format is Incorrect');
            setUploadFlag(false);
          });
      } else {
        setLoading(false)
        setAlert('warning', 'Please select file');
      }
    }
  };

  return (
    <Layout className='accessBlockerContainer'>

      <div className={classes.parentDiv}>
      {loading && <Loader />}
          <CommonBreadcrumbs
            componentName='User Management'
            childComponentName='Virtual School'
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
            <Grid item md={3} xs={12} className='bulkBranch' style={{ margin: '0 20px' }}>
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
            <Grid item sm={3} xs={12}>
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
                      href='/assets/download-format/upload_virtual_student.xlsx'
                      download='format.xlsx'
                    >
                      Download format
                    </a>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid sm={2} xs={6}>
              <StyledClearButton onClick={handleClearAll} style={{fontWeight: '600'}} >Clear All</StyledClearButton>
            </Grid>
            <Grid sm={2} xs={6}>
              <StyledButton onClick={handleFileUpload}>Upload</StyledButton>
            </Grid>
            <Grid sm={1} xs={6}>
              <StyledButton onClick={handleFileDelete}>Delete</StyledButton>
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
          <div className='listcontainer'>
            <div className='filterStudent'>
              <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
                <Autocomplete
                  // multiple
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleActualBranch}
                  id='branch_id'
                  className='dropdownIcon'
                  value={actualBranch || ''}
                  options={branchList || ''}
                  getOptionLabel={(option) => option?.branch?.branch_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Actual Branch'
                      placeholder='Actual Branch'
                    />
                  )}
                />
              </Grid>
              <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
                <Autocomplete
                  // multiple
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleVirtualBranch}
                  id='branch_id'
                  className='dropdownIcon'
                  value={virtualBranch || ''}
                  options={branchList || ''}
                  getOptionLabel={(option) => option?.branch?.branch_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Virtual Branch'
                      placeholder='Virtual Branch'
                    />
                  )}
                />
              </Grid>


              
            </div>
            <div className='filterArea'>
              <Grid sm={2} xs={6}>
                <StyledClearButton onClick={handleClearAllList} style={{fontWeight: '600'}} >
                  Clear All
                </StyledClearButton>
              </Grid>
              <Grid sm={2} xs={6}>
                <StyledButton onClick={filterList}>Filter</StyledButton>
              </Grid>
            </div>
            <Paper className={`${classes.root} common-table`} id='singleStudent'>
              <div className='searchArea'>
                <FormControl variant='outlined' className='searchViewUser' size='small'>
                  <InputLabel>Search</InputLabel>
                  <OutlinedInput
                    endAdornment={<SearchOutlined color='primary' />}
                    placeholder='Search Erp'
                    label='Search Erp'
                    value={searchText}
                    onChange={handleTextSearch}
                  />
                </FormControl>
              </div>
              {studentList && studentList.length > 0 && <TableContainer
                className={`table table-shadow view_users_table ${classes.container}`}
              >
                <Table stickyHeader aria-label='sticky table'>
                  <TableHead className={`${classes.columnHeader} table-header-row`}>
                    <TableRow>
                      <TableCell className={classes.tableCell}>ERP Id</TableCell>
                      <TableCell className={classes.tableCell}>Name</TableCell>
                      <TableCell className={classes.tableCell}>Actual Branch</TableCell>
                      <TableCell className={classes.tableCell}>Virtual Branch</TableCell>

                      {/* <TableCell className={classes.tableCell}>Action</TableCell> */}
                      {/* <TableCell className={classes.tableCell}>Edit</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentList && studentList.map((items, i) => (
                      <TableRow key={items.id}>
                        <TableCell className={classes.tableCell}>
                          {items?.erp_user__erp_id}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {items?.erp_user__name}
                        </TableCell>
                        <TableCell className={classes.tableCell}>{items?.actual_branch__branch_name}</TableCell>
                        <TableCell className={classes.tableCell}>
                          {items?.virtual_branch__branch_name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>}
              {studentList.length === 0 && <NoFilterData data = 'No Data Found'/>}
              {studentList && <TablePagination
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
              />}
            </Paper>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VirtualSchool;
