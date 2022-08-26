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
import { useHistory } from 'react-router-dom';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { Divider, TextField } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axiosInstance from 'config/axios';
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
import EditIcon from '@material-ui/icons/Edit';
import unfiltered from '../../assets/images/unfiltered.svg';
import Loader from './../../components/loader/loader';
//import exportFromJSON from 'export-from-json';
import { CSVLink } from 'react-csv';
import TablePagination from '@material-ui/core/TablePagination';
import axios from 'axios';

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
    color: theme.palette.secondary.main,
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
  guidelineval: {
    color: theme.palette.primary.main,
    fontWeight: '600',
  },
  guideline: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    padding: '10px',
  },
  omrButton: {
    color: theme.palette.secondary.main,
    right: '30px',
    top: '-50px',
  },
}));

const guidelines = [
  {
    name: '',
    field: "Please Don't Erase or Edit any header in the file format",
  },
  { name: 'Erp Code', field: ' is a mandatory field, Example: 2003970002_OLV' },
  { name: 'Is_lesson_plan', field: ' is a mandatory field' },
  { name: 'Is_online_class', field: ' is a mandatory field' },
  { name: 'Is_ebook', field: ' is a mandatory field' },
  { name: 'Is_ibook', field: ' is a mandatory field' },
  { field: 'To Allow Access to the user, Input value as " 0 ".' },
  { field: 'To Block Access to the user, Input value as " 1 ".' },
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

const StyledClearButton = withStyles((theme) => ({
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

const OfflineStudentAssessment = () => {
  const history = useHistory();
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
  const [selectedBranch, setSelectedBranch] = useState(
    history?.location?.state?.data?.branch[0]
  );

  const [selectedBranchId, setSelectedBranchIds] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(
    history?.location?.state?.data?.grade
  );
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [bulkUpload, setBulkUpload] = useState(true);
  const [isLesson, setIsLesson] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const filterData = JSON.parse(sessionStorage.getItem('filterData')) || {};
  const [isNewSeach, setIsNewSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [studentList, setStudentList] = useState([]);
  const [page, setPage] = useState('1');
  const [checkFilter, setCheckFilter] = useState(false);
  const [quesList, setQuesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchOMR, setBranchOMR] = useState([]);
  const [displayOMR, setDisplayOMR] = useState(false);
  const [uploadBranchOMR, setUploadBranchOMR] = useState('');
  const [filterClicked,setFilterClicked] = useState(false)
  const [checkBoxFlag,setCheckBoxFlag] = useState(false)

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create Test') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
    console.log(filterData);
    checkOMR();
  }, []);
  const checkOMR = () => {
    axiosInstance
      .get(`${endpoints?.academics?.checkOMR}`)
      .then((result) => {
        console.log(result);
        setBranchOMR(result?.data?.result);
        // enableOMR(result?.data?.result)
      })
      .catch((error) => {
        console.log('');
      });
  };

  useEffect(() => {
    if (history?.location?.state?.data?.branch?.length > 0) {
      setBranchList(history?.location?.state?.data?.branch);
      setGradeList(history?.location?.state?.data?.grade);
      handleGrade(history?.location?.state?.data?.grade);
      // enableOMR();
    }
  }, [moduleId]);

  useEffect(() => {
    enableOMR();
  }, [branchOMR]);
  let filterBranch = '';
  const enableOMR = () => {
    filterBranch = branchList.filter((item) => {
      return !branchOMR.includes(item?.id.toString());
    });
    setUploadBranchOMR(filterBranch);
    // setDisplayOMR(filterBranch?.length > 0 ? true : false )
    console.log(filterBranch);
    console.log(branchList);
    console.log(branchOMR);
  };

  useEffect(() => {
    setDisplayOMR(uploadBranchOMR?.length > 0 ? false : true);
  }, [uploadBranchOMR]);

  useEffect(() => {
    // getUserList();
  }, [currentPage]);

  useEffect(() => {
    // getUserList();
  }, [searchText]);

  const handleTextSearch = (e) => {
    setIsNewSearch(true);
    setSearchText(e.target.value);
    console.log(e.target.value.length, 'event');
    if (e.target.value.length === 0) {
      setIsNewSearch(false);
    }
  };

  const handleBranch = (e, value) => {
    setSelectedBranch(value);
    setSelectedSection(null);
  };
  useEffect(() => {
    handleGrade(history?.location?.state?.data?.grade);
  }, [selectedBranch, moduleId]);

  const handleGrade = (value) => {
    if (moduleId) {
      console.log(value);
      let selectedId = [];
      if (value?.id) {
        axiosInstance
          .get(
            `erp_user/sectionmapping/?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${value.grade_id}&module_id=${moduleId}`
          )
          .then((result) => {
            setSectionList(result?.data?.data);
            console.log(result?.data?.data);
            if (history?.location?.state?.test?.section_mapping[0] != null) {
              const filterSection = result?.data?.data.filter((ele) =>
                history?.location?.state?.test?.section_mapping.includes(ele?.id)
              );
              console.log(filterSection);
              // setSelectedSection(filterSection)
              setSectionList(filterSection);
            }
          })
          .catch((error) => {
            console.log('');
          });
      }
    }
  };

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleClearAllList = () => {
    // setSelectedAcadmeicYear();
    setSelectedBranch();
    setSelectedGrade();
    setSelectedSection(null);
  };

  const offlineMarks = () => {
    setLoading(true);
    console.log(history?.location?.state?.test, 'test');
    console.log(selectedGrade);
    // const secId = selectedSection.map((ele) => ele?.id)
    const payload = {
      branchId: selectedBranch?.id,
      gradeId: selectedGrade?.grade_id,
      subjId: history?.location?.state?.data?.subject[0].subject_id,
      testId: history?.location?.state?.test?.id,
      sectionId: selectedSection?.id,
      selectedSection: selectedSection,
    };
    sessionStorage.setItem('filterData', JSON.stringify(payload));
    axiosInstance
      .get(
        `${endpoints.assessment.offlineAssesment}?acad_session=${selectedBranch?.id}&grade=${selectedGrade?.grade_id}&subject_id=${history?.location?.state?.data?.subject[0].subject_id}&test_id=${history?.location?.state?.test?.id}&section_mapping_id=${selectedSection?.id}`
      )
      .then((result) => {
        console.log(result);
        setStudentList(result?.data?.result?.user_reponse);
        setQuesList(result?.data?.result?.questions);
        setLoading(false);
        setFilterClicked(true)
      })
      .catch((error) => {
        console.log('');
      });
  };

  useEffect(()=>{
    if(filterClicked){
      offlineMarks()
    }
  },[checkBoxFlag])

  const uploadMarks = (data) => {
    console.log(data);
    history.push({
      pathname: 'student-mark',
      state: {
        test_id: history?.location?.state?.test?.id,
        user: data?.user_id,
        student: studentList,
        studentData: data,
        selectedSection: selectedSection,
        branch: history?.location?.state?.data?.branch,
        gradeList: history?.location?.state?.data?.grade,
        grade: history?.location?.state?.data?.grade,
        subject_id: history?.location?.state?.data?.subject[0].subject_id,
        quesList: quesList,
      },
    });
  };

  const updateReUpload = (val) =>{
    setLoading(true)
    let testId = history?.location?.state?.test?.id
    let param = {
      user_id:val?.user_id,
      test_id : testId,
      can_reupload: !val?.can_reupload
    }
    axiosInstance
      .post(
        `${endpoints.assessment.reUpload}?`,param
      )
      .then((result) => {
        setLoading(false)
        console.log(result);
        setCheckBoxFlag(!checkBoxFlag)
        if(result?.data?.status_code === 200){
          setAlert('success', result?.data?.message);
        }
      })
      .catch((error) => {
        console.log('');
        setLoading(false)
      });
  }
  useEffect(() => {
    if (filterData?.subjId && !filterClicked) {
      setLoading(true);
      setSelectedSection(filterData?.selectedSection);
      axiosInstance
        .get(
          `${endpoints.assessment.offlineAssesment}?acad_session=${filterData?.branchId}&grade=${filterData?.gradeId}&subject_id=${filterData?.subjId}&test_id=${filterData?.testId}&section_mapping_id=${filterData?.sectionId}`
        )
        .then((result) => {
          console.log(result);
          setLoading(false);
          setStudentList(result?.data?.result?.user_reponse);
          setQuesList(result?.data?.result?.questions);
        })
        .catch((error) => {
          console.log('');
        });
    }
  }, [checkBoxFlag]);

  const handleBack = () => {
    sessionStorage.removeItem('filterData');
    // history.goBack();
    history.push({pathname : '/assesment',state :{ dataRestore : true}})
  };

  const uploadOMR = () => {
    if (!selectedSection) {
      setAlert('error', 'Please select section');
      return;
    }
    // console.log("data12378",history?.location?.state?.test);
    history.push({
      pathname: '/uploadOMR',
      state: {
        data: filterData,
        section: selectedSection,
        test_id: history?.location?.state?.test,
      },
    });
  };

  return (
    <Layout className='accessBlockerContainer'>
      {loading && <Loader />}
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Assessment'
          childComponentName='Offline Marks Upload'
          isAcademicYearVisible={true}
        />

        <div className='listcontainer'>
          <div className='filterStudent'>
            <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleBranch}
                id='branch_id'
                className='dropdownIcon'
                value={selectedBranch || []}
                options={branchList || []}
                getOptionLabel={(option) => option?.branch?.branch_name || ''}
                // getOptionSelected={(option, value) =>
                //     option?.branch?.id == value?.branch?.id
                // }
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
                disabled
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
                  setSelectedSection(null);
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
                // disabled={history?.location?.state?.test?.section_mapping?.length > 1 ? "true" : "false"}
                // disabled='true'
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
          <div className='filterArea'>
            <Grid sm={2} xs={6}>
              <StyledClearButton
                onClick={handleBack}
                style={{ fontWeight: '600', width: '80%' }}
              >
                Back
              </StyledClearButton>
            </Grid>
            <Grid sm={2} xs={6}>
              <StyledButton style={{ width: '90%' }} onClick={offlineMarks}>
                Filter
              </StyledButton>
            </Grid>
            {displayOMR ? (
              <Grid sm={2} xs={6}>
                <StyledButton style={{ width: '80%' }} onClick={uploadOMR}>
                  Upload OMR
                </StyledButton>
              </Grid>
            ) : (
              ''
            )}
          </div>
          <Paper className={`${classes.root} common-table`} id='singleStudent'>
            <div className='searchArea'>
              {/* <FormControl
                                variant='outlined'
                                className='searchViewUser'
                                size='small'
                            >
                                <InputLabel>Search</InputLabel>
                                <OutlinedInput
                                    endAdornment={<SearchOutlined color='primary' />}
                                    placeholder='Search erp'
                                    label='Search'
                                    value={searchText}
                                    onChange={handleTextSearch}
                                />
                            </FormControl> */}
            </div>
            {console.log(studentList)}
            {studentList?.length > 0 ? (
              <TableContainer
                className={`table table-shadow view_users_table ${classes.container}`}
              >
                <Table stickyHeader aria-label='sticky table'>
                  <TableHead className={`${classes.columnHeader} table-header-row`}>
                    <TableRow>
                      <TableCell className={classes.tableCell}>Serial No.</TableCell>
                      <TableCell className={classes.tableCell}>ERP Id</TableCell>
                      <TableCell className={classes.tableCell}>Name</TableCell>
                      <TableCell className={classes.tableCell}>Total Marks</TableCell>
                      <TableCell className={classes.tableCell}>Action</TableCell>
                      <TableCell className={classes.tableCell}>Enable Re-Upload</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentList?.map((items, i) => (
                      <TableRow key={items.id}>
                        <TableCell className={classes.tableCell}>{i + 1}</TableCell>
                        <TableCell className={classes.tableCell}>
                          {items?.erp_id}
                        </TableCell>
                        <TableCell className={classes.tableCell} id='blockArea'>
                          {items?.name}
                        </TableCell>
                        <TableCell className={classes.tableCell} id='blockArea'>
                          {items?.test_details?.total_marks != null ? (
                            items?.test_details?.total_marks.toFixed(2)
                          ) : (
                            <StyledButton
                              onClick={() => uploadMarks(items)}
                              startIcon={<EditIcon style={{ fontSize: '30px' }} />}
                            >
                              Upload Marks
                            </StyledButton>
                          )}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {items?.test_details?.total_marks != null ? (
                            <StyledButton
                              onClick={() => uploadMarks(items)}
                              startIcon={<EditIcon style={{ fontSize: '30px' }} />}
                            >
                              Edit Marks
                            </StyledButton>
                          ) : (
                            ''
                          )}
                        </TableCell>
                        <TableCell className={classes.tableCell} id='blockArea'>
                          {items?.can_reupload && <Checkbox
                            checked={items?.can_reupload}
                            iconStyle={{ fill: 'red' }}
                            onChange={(e) => {
                              updateReUpload(items)
                            }
                            }
                            inputProps={{ 'aria-label': 'controlled' }}
                          />}
                           {!items?.can_reupload && <Checkbox
                            iconStyle={{ fill: 'red' }}
                            onChange={(e) => {
                              updateReUpload(items)
                            }
                            }
                            inputProps={{ 'aria-label': 'controlled' }}
                          />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <img src={unfiltered} alt='placeholder' />
                  <p className='select-filter-text'>
                    Please select the filter to display reports
                  </p>
                </div>
              </div>
            )}
            {/* <TablePagination
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
                        /> */}
          </Paper>
        </div>
      </div>
    </Layout>
  );
};

export default OfflineStudentAssessment;
