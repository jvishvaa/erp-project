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
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import unfiltered from '../../assets/images/unfiltered.svg';
import Loader from './../../components/loader/loader';
//import exportFromJSON from 'export-from-json';
import { CSVLink } from 'react-csv';
import TablePagination from '@material-ui/core/TablePagination';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { FileExcelTwoTone, UploadOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';

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

const StyledButtonLabel = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF !important',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    width: 'fit-content',
    minWidth: '64px',
    borderRadius: '10px',
    lineHeight: '1.5',
    cursor: 'pointer',
  },
}))(InputLabel);

const OfflineStudentAssessment = () => {
  const history = useHistory();
  const classes = useStyles({});
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

  const [selectedBranchId, setSelectedBranchIds] = useState([]);
  const [gradeList, setGradeList] = useState([]);

  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [bulkUpload, setBulkUpload] = useState(true);
  const [isLesson, setIsLesson] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const filterData = JSON.parse(sessionStorage.getItem('filterData')) || {};
  const createFilterData = JSON.parse(sessionStorage.getItem('createfilterdata')) || {};
  const [selectedBranch, setSelectedBranch] = useState(createFilterData?.branch[0]);
  const [selectedGrade, setSelectedGrade] = useState(createFilterData?.grade);

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
  const [filterClicked, setFilterClicked] = useState(false);
  const [checkBoxFlag, setCheckBoxFlag] = useState(false);
  const [showNewAsses, setShowNewAsses] = useState(true);

  const [bulkMarksUploadFileLoader, setBulkMarksUploadFileLoader] = useState(false);

  const [selectedFile, setSelectedFile] = useState('');

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
    checkOMR();
  }, []);
  const checkOMR = () => {
    axiosInstance
      .get(`${endpoints?.academics?.checkOMR}`)
      .then((result) => {
        setBranchOMR(result?.data?.result);
        // enableOMR(result?.data?.result)
      })
      .catch((error) => {
        console.log('');
      });
  };

  useEffect(() => {
    if (createFilterData?.branch?.length > 0) {
      setBranchList(createFilterData?.branch);
      setGradeList(createFilterData?.grade);
      handleGrade(createFilterData?.grade);
      // enableOMR();
    }
  }, [moduleId]);

  useEffect(() => {
    enableOMR();
  }, [branchOMR]);
  let filterBranch = '';
  const enableOMR = () => {
    filterBranch = branchList.filter((item) => {
      return !branchOMR.includes(item?.value.toString());
    });
    setUploadBranchOMR(filterBranch);
    // setDisplayOMR(filterBranch?.length > 0 ? true : false )
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
    if (e.target.value.length === 0) {
      setIsNewSearch(false);
    }
  };

  const handleBranch = (e, value) => {
    setSelectedBranch(value);
    setSelectedSection(null);
  };
  useEffect(() => {
    handleGrade(createFilterData?.grade);
  }, [selectedBranch, moduleId]);

  const handleGrade = (value) => {
    if (moduleId) {
      let selectedId = [];
      if (value) {
        axiosInstance
          .get(
            `erp_user/sectionmapping/?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.key}&grade_id=${value.value}&module_id=${moduleId}`
          )
          .then((result) => {
            setSectionList(result?.data?.data);
            if (history?.location?.state?.test?.section_mapping[0] != null) {
              const filterSection = result?.data?.data.filter((ele) =>
                history?.location?.state?.test?.section_mapping.includes(ele?.id)
              );
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
    // const secId = selectedSection.map((ele) => ele?.id)
    const payload = {
      branchId: selectedBranch?.value,
      gradeId: selectedGrade?.value,
      subjId: createFilterData.subject[0]?.value,
      testId: history?.location?.state?.test?.id,
      sectionId: selectedSection?.id,
      selectedSection: selectedSection,
    };
    sessionStorage.setItem('filterData', JSON.stringify(payload));
    axiosInstance
      .get(
        `${endpoints.assessment.offlineAssesment}?acad_session=${
          selectedBranch?.value
        }&grade=${selectedGrade?.value}&test_id=${
          history?.location?.state?.test?.id
        }&section_mapping_id=${selectedSection?.id}  ${
          createFilterData?.subject[0]?.value
            ? '&subject_id=' + createFilterData?.subject[0]?.value
            : ''
        }`
      )
      .then((result) => {
        setStudentList(result?.data?.result?.user_reponse);
        setQuesList(result?.data?.result?.questions);
        setLoading(false);
        setFilterClicked(true);
      })
      .catch((error) => {
        console.log('');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (filterClicked) {
      offlineMarks();
    }
  }, [checkBoxFlag]);

  const fetchquesPaperStatus = () => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.doodle.checkDoodle}?config_key=asmt_enhancement`)
      .then((response) => {
        if (response?.data?.result) {
          if (response?.data?.result.includes(String(selectedBranch?.branch?.id))) {
            setShowNewAsses(true);
          } else {
            setShowNewAsses(false);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.msg || error?.message);
      });
  };
  useEffect(() => {
    // fetchquesPaperStatus();
  }, [selectedBranch]);

  const uploadMarks = (data) => {
    let student = [];
    let studentCheck = studentList.map((i) => {
      if (i?.atdnce_status == true) {
        student.push(i);
      }
    });
    history.push({
      pathname: quesList[0].sections?.mandatory_questions
        ? 'student-marks-upload'
        : 'student-mark',
      state: {
        test_id: history?.location?.state?.test?.id,
        user: data?.user_id,
        student: student,
        studentData: data,
        selectedSection: selectedSection,
        branch: createFilterData?.branch,
        gradeList: createFilterData?.grade,
        grade: createFilterData?.grade,
        subject_id: createFilterData?.subject[0]?.subject_id,
        quesList: quesList,
      },
    });
  };

  const updateReUpload = (val) => {
    setLoading(true);
    let testId = history?.location?.state?.test?.id;
    let param = {
      user_id: val?.user_id,
      test_id: testId,
      can_reupload: !val?.can_reupload,
    };
    axiosInstance
      .post(`${endpoints.assessment.reUpload}?`, param)
      .then((result) => {
        setLoading(false);
        setCheckBoxFlag(!checkBoxFlag);
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
        }
      })
      .catch((error) => {
        console.log('');
        setLoading(false);
      });
  };
  useEffect(() => {
    if (filterData?.subjId && !filterClicked) {
      setLoading(true);
      setSelectedSection(filterData?.selectedSection);
      axiosInstance
        .get(
          `${endpoints.assessment.offlineAssesment}?acad_session=${filterData?.branchId}&grade=${filterData?.gradeId}&subject_id=${filterData?.subjId}&test_id=${history?.location?.state?.test?.id}&section_mapping_id=${filterData?.sectionId}`
        )
        .then((result) => {
          setLoading(false);
          setStudentList(result?.data?.result?.user_reponse);
          setQuesList(result?.data?.result?.questions);
        })
        .catch((error) => {
          console.log('');
        });
    }
  }, [checkBoxFlag]);

  const deleteMarks = (item) => {
    setLoading(true);
    axiosInstance
      .delete(`assessment/${item?.test_details?.usresponse_id}/ru-offline-asmnt/`)
      .then((result) => {
        offlineMarks();
        setAlert('success', 'Response Deleted Successfully');
      })
      .catch((error) => {
        console.log('');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBack = () => {
    sessionStorage.removeItem('filterData');
    sessionStorage.removeItem('createfilterdata');
    // history.goBack();
    history.push({ pathname: '/assesment', state: { dataRestore: true } });
  };

  const uploadOMR = () => {
    if (!selectedSection) {
      setAlert('error', 'Please select section');
      return;
    }
    history.push({
      pathname: '/uploadOMR',
      state: {
        data: filterData,
        section: selectedSection,
        test_id: history?.location?.state?.test,
      },
    });
  };

  const excelDownload = (data, filename) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    FileSaver.saveAs(blob, filename);
  };

  const downloadBulkMarksTemplate = () => {
    let param = {
      test_id: history?.location?.state?.test?.id,
      subject_id: filterData?.subjId,
      section_mapping_id: filterData?.sectionId,
    };
    axiosInstance
      .post(`${endpoints.assessment.assessmentMarksDownload}`, param, {
        responseType: 'blob',
      })
      .then((res) => {
        excelDownload(
          res.data,
          `${history?.location?.state?.test?.test_name}_download_report.xlsx`
        );
      })
      .catch((error) => {
        console.log('err', error, error.response);
        setAlert('error', 'Something went wrong');
      });
  };

  const allowedFiles = ['.xls', '.xlsx'];
  const draggerProps = {
    showUploadList: false,
    disabled: false,
    accept: allowedFiles.join(),
    // '.xls,.xlsx',
    multiple: false,
    onRemove: () => {
      setSelectedFile(null);
    },
    onDrop: (e) => {
      const file = e.dataTransfer.files;
      setSelectedFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      console.log(type, allowedFiles);
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file);
        // setFileTypeError(false);
      } else {
        message.error('Only .xls, .xlsx files are allowed!');
        // setFileTypeError(true);
      }

      return false;
    },
    beforeUpload: (...file) => {
      setSelectedFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file[1]);
        // setFileTypeError(false);
      } else {
        message.error('Only .xls, .xlsx files are allowed!');
        // setFileTypeError(true);
      }

      return false;
    },

    selectedFile,
  };

  const uploadBulkMarks = () => {
    if (selectedFile === '') {
      setAlert('error', 'Please select a file to upload');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('test_id', history?.location?.state?.test?.id);
    formData.append('file', selectedFile);

    axiosInstance
      .post(`${endpoints.assessment.assessmentMarksUpload}`, formData, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        if (res?.status === 200) {
          offlineMarks();
          setAlert('success', 'File uploaded successfully');
          setSelectedFile('');
          console.log(res?.data);
          excelDownload(
            res?.data,
            `${history?.location?.state?.test?.test_name}_upload_report.xlsx`
          );
        } else if (res?.status === 201) {
          setSelectedFile('');
          offlineMarks();
          excelDownload(
            res?.data,
            `${history?.location?.state?.test?.test_name}_upload_error_report.xlsx`
          );
          setAlert('error', 'File not uploaded successfully, check error logs');
        }
      })
      .catch((error) => {
        console.log(error, error.response, 'err');
        // setAlert('error', error?.error);
        setAlert(
          'error',
          error?.response?.message ? error?.response?.message : 'Something went wrong'
        );
      })
      .finally(() => {
        setLoading(false);
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
                getOptionLabel={(option) => option?.children || ''}
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
                getOptionLabel={(option) => option?.children || ''}
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

            {studentList?.length > 0 && (
              <>
                <Grid sm={2} xs={4}>
                  <div className='th-upload-input'>
                    <Upload {...draggerProps}>
                      <button
                        className='ant-btn'
                        style={{ width: '100%', height: 40 }}
                        icon={<UploadOutlined />}
                      >
                        <UploadOutlined /> Marks Bulk Upload
                      </button>
                    </Upload>
                  </div>
                  {selectedFile && (
                    <span className='th-fw-300 th-13'>
                      <FileExcelTwoTone className='pr-2' />
                      {selectedFile?.name}
                    </span>
                  )}
                  <p>
                    <span className='text-muted'>
                      <a
                        style={{ cursor: 'pointer', fontWeight: 600, color: '#1890ff' }}
                        onClick={downloadBulkMarksTemplate}
                      >
                        Download marks upload template
                      </a>
                    </span>
                  </p>
                </Grid>
                <Grid sm={2} xs={6} className='mx-2'>
                  <StyledButtonLabel
                    onClick={uploadBulkMarks}
                    style={{ width: '90%', textAlign: 'center' }}
                    htmlFor='bulkMarksUpload'
                  >
                    Upload
                  </StyledButtonLabel>
                </Grid>
              </>
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
                      <TableCell className={classes.tableCell}>
                        {/* Enable Re-Upload */}
                        Attendance
                      </TableCell>
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
                          {/* {items?.atdnce_status == true ? (
                            <>
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
                            </>
                          ) : items?.atdnce_status == null ? (
                            <>
                              <p>Please Mark Attendace First</p>
                            </>
                          ) : (
                            <>
                              <p>Absent</p>
                            </>
                          )} */}

                          {items?.atdnce_status &&
                          Object.keys(items?.test_details).length === 0 ? (
                            <StyledButton
                              onClick={() => uploadMarks(items)}
                              startIcon={<EditIcon style={{ fontSize: '30px' }} />}
                            >
                              Upload Marks
                            </StyledButton>
                          ) : !items?.atdnce_status &&
                            Object.keys(items?.test_details).length > 0 ? (
                            items?.test_details?.total_marks
                          ) : !items?.atdnce_status &&
                            Object.keys(items?.test_details).length === 0 ? (
                            <StyledButton
                              onClick={() => uploadMarks(items)}
                              startIcon={<EditIcon style={{ fontSize: '30px' }} />}
                            >
                              Upload Marks
                            </StyledButton>
                          ) : items?.atdnce_status &&
                            Object.keys(items?.test_details).length > 0 ? (
                            items?.test_details?.total_marks
                          ) : null}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {items?.atdnce_status &&
                          Object.keys(items?.test_details).length === 0 ? (
                            ''
                          ) : !items?.atdnce_status &&
                            Object.keys(items?.test_details).length > 0 ? (
                            <>
                              <StyledButton
                                onClick={() => uploadMarks(items)}
                                startIcon={<EditIcon style={{ fontSize: '30px' }} />}
                              >
                                Edit Marks
                              </StyledButton>
                              <StyledButton
                                onClick={() => deleteMarks(items)}
                                className='ml-3'
                              >
                                <DeleteOutlineIcon style={{ fontSize: '30px' }} />
                              </StyledButton>
                            </>
                          ) : !items?.atdnce_status &&
                            Object.keys(items?.test_details).length === 0 ? (
                            ''
                          ) : items?.atdnce_status &&
                            Object.keys(items?.test_details).length > 0 ? (
                            <>
                              <StyledButton
                                onClick={() => uploadMarks(items)}
                                startIcon={<EditIcon style={{ fontSize: '30px' }} />}
                              >
                                Edit Marks
                              </StyledButton>
                              <StyledButton
                                onClick={() => deleteMarks(items)}
                                className='ml-3'
                              >
                                <DeleteOutlineIcon style={{ fontSize: '30px' }} />
                              </StyledButton>
                            </>
                          ) : null}

                          {/* {items?.atdnce_status == true &&
                          items?.test_details?.total_marks != null ? (
                            <>
                              {items?.test_details?.total_marks != null ? (
                                <>
                                  <StyledButton
                                    onClick={() => uploadMarks(items)}
                                    startIcon={<EditIcon style={{ fontSize: '30px' }} />}
                                  >
                                    Edit Marks
                                  </StyledButton>
                                  <StyledButton
                                    onClick={() => deleteMarks(items)}
                                    className='ml-3'
                                  >
                                    <DeleteOutlineIcon style={{ fontSize: '30px' }} />
                                  </StyledButton>
                                </>
                              ) : (
                                ''
                              )}
                            </>
                          ) : items?.atdnce_status == null &&
                            items?.test_details?.total_marks ? (
                            <>
                              <StyledButton
                                onClick={() => uploadMarks(items)}
                                startIcon={<EditIcon style={{ fontSize: '30px' }} />}
                              >
                                Edit Marks
                              </StyledButton>
                              <StyledButton
                                onClick={() => deleteMarks(items)}
                                className='ml-3'
                              >
                                <DeleteOutlineIcon style={{ fontSize: '30px' }} />
                              </StyledButton>
                            </>
                          ) : items?.atdnce_status == false &&
                            items?.test_details?.total_marks != null ? (
                            <>
                              <StyledButton
                                onClick={() => uploadMarks(items)}
                                startIcon={<EditIcon style={{ fontSize: '30px' }} />}
                              >
                                Edit Marks
                              </StyledButton>
                              <StyledButton
                                onClick={() => deleteMarks(items)}
                                className='ml-3'
                              >
                                <DeleteOutlineIcon style={{ fontSize: '30px' }} />
                              </StyledButton>
                            </>
                          ) : (
                            ''
                          )} */}
                        </TableCell>
                        {/* <TableCell className={classes.tableCell} id='blockArea'>
                          {items?.can_reupload && (
                            <Checkbox
                              checked={items?.can_reupload}
                              iconStyle={{ fill: 'red' }}
                              onChange={(e) => {
                                updateReUpload(items);
                              }}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                          )}
                          {!items?.can_reupload && (
                            <Checkbox
                              iconStyle={{ fill: 'red' }}
                              onChange={(e) => {
                                updateReUpload(items);
                              }}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                          )}
                        </TableCell> */}
                        <TableCell className={classes.tableCell} id='blockArea'>
                          {(items?.atdnce_status &&
                            Object.keys(items?.test_details).length === 0) ||
                          (!items?.atdnce_status &&
                            Object.keys(items?.test_details).length > 0) ||
                          (items?.atdnce_status &&
                            Object.keys(items?.test_details).length > 0)
                            ? 'Present'
                            : 'Absent'}
                          
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
