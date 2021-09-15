/* eslint-disable import/no-absolute-path */
/* eslint-disable global-require */
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import axios from '../../config/axios';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { Typography } from '@material-ui/core';
import { connect, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  container: {
    maxHeight: '40vh',
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
  guidelineval: {
    color: theme.palette.primary.main,
    fontWeight: '600',
  },
  guideline: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    padding: '10px',
  },
  guidelinesText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
}));

const columnsGrade = [
  {
    id: 'grade_id',
    label: 'Id',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'grade_name',
    label: 'Grade',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
];

const columnsSection = [
  {
    id: 'section_id',
    label: 'Mapping Id',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'section_name',
    label: 'Section',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
];

const columnsSubject = [
  {
    id: 'subject_id',
    label: 'Id',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'subject_name',
    label: 'Subject',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
];

const BulkUpload = ({ onUploadSuccess }) => {
  const [branch, setBranch] = useState(null);
  const [branchCode, setBranchCode] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [branchDisplay, setBranchDisplay] = useState({});
  const [yearDisplay, setYearDisplay] = useState({});
  const [academicYearVal, setAcademicYearVal] = useState('');
  const [year, setYear] = useState(null);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [yearList, setYearList] = useState([]);
  const [file, setFile] = useState(null);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [uploadFlag, setUploadFlag] = useState(false);
  const classes = useStyles();
  const [searchGrade, setSearchGrade] = useState([]);
  const [searchSection, setSearchSection] = useState([]);
  const [searchGradeId, setSearchGradeId] = useState('');
  const [sectionDisp, setSectionDisp] = useState({});
  const genders = [
    { id: '1', gender: 'Male' },
    { id: '2', gender: 'Female' },
    { id: '3', gender: 'Other' },
  ];
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { role_details } = JSON.parse(localStorage.getItem('userDetails'));
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const fileRef = useRef();

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create User') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const guidelines = [
    {
      name: '',
      field: "Please don't remove or manipulate any header in the file format",
    },
    { name: 'user_first_name', field: ' is a required field, Example: Vikash' },
    { name: 'user_middle_name', field: ' is a non-required field, Example: Kumar' },
    { name: 'user_last_name', field: ' is a required field, Example: Singh' },
    {
      name: 'date_of_birth',
      field: ' is a mandatory field with following format (YYYY-MM-DD)',
    },
    { name: 'contact', field: ' is a mandatory field, Example: 996565xxxx' },
    { name: 'email', field: ' is a mandatory field, Example: john.doe@gmail.com' },
    { name: 'address', field: ' is a mandatory field, Example: Next to Brookfield Mall' },
    {
      name: 'gender',
      field:
        ' is a mandatory field in which ID has to be passed for Male, Female and Others as 0, 1, 2 respectively',
    },
    {
      name: 'How to use Suggestions ?',
      field:
        " From the following dropdowns select grade & section and use the respective Id's for user creation",
    },
    // 'profile',
    // 'Grade',
    // 'Section',
    // 'Subject',
    // 'father_first_name',
    // 'father_middle_name',
    // 'father_last_name',
    // 'father_email',
    // 'father_contact',
    // 'mother_first_name',
    // 'mother_middle_name',
    // 'mother_last_name',
    // 'mother_email',
    // 'mother_contact',
    // 'guardian_first_name',
    // 'guardian_middle_name',
    // 'guardian_last_name',
    // 'guardian_email',
    // 'guardian_mobile',
    // 'parent_address'
  ];

  // const getYears = async () => {
  //   try {
  //     const data = await axios.get(`erp_user/list-academic_year/?module_id=${moduleId}`);
  //     if (data.data?.status_code === 200) {
  //       const {
  //         data: { data: acadYearData = [] },
  //       } = data || {};
  //       setYearList(acadYearData);
  //       const defaultYear = acadYearData?.[0];
  //       if (defaultYear) {
  //         handleYearChange({}, defaultYear);
  //       }

  //       getBranches(acadYearData?.[0]?.id);
  //     } else setYearList([]);
  //   } catch (error) {
  //     console.log('failed to load years');
  //   }
  // };

  useEffect(() => {
    if (moduleId && selectedAcademicYear) getBranches();
    console.log(selectedAcademicYear, 'yesr');
  }, [moduleId, selectedAcademicYear]);

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
    setYearDisplay('');
    setYear(null);
    setBranchDisplay('');
    setBranch(null);
    setBranchList([]);
    setBranchCode('');
    fileRef.current.value = null;
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append('branch', branch);
    formData.append('branch_code', branchCode);
    formData.append('academic_year_value', selectedAcademicYear?.session_year);
    formData.append('academic_year', selectedAcademicYear?.id);
    formData.append('file', file);
    if (branch && selectedAcademicYear && file) {
      setUploadFlag(true);
      axios
        .post('/erp_user/upload_bulk_user/', formData)
        .then((result) => {
          if (result.data.status_code === 200) {
            setBranch(null);
            setYear(null);
            setFile(null);
            onUploadSuccess();
            setAlert('success', result.data.message);
            setUploadFlag(false);
            history.push('/user-management/bulk-upload');
          } else {
            setAlert('error', result.data.deion);
            setUploadFlag(false);
          }
        })
        .catch((error) => {
          // setAlert('error', error.response.data.deion);
          setUploadFlag(false);
        });
    } else {
      if (!branch) {
        setAlert('error', 'Branch is required!');
      } else if (!selectedAcademicYear) {
        setAlert('error', 'Year is required!');
      } else if (!file) {
        setAlert('error', 'File is required!');
      }
    }
  };

  const getBranches = (acadId) => {
    axiosInstance
      .get(
        `erp_user/branch/?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          const modifiedResponse = result?.data?.data?.results.map(
            (obj) => (obj && obj.branch) || {}
          );
          setBranchList(modifiedResponse);
        } else console.log('');
      })
      .catch((error) => {
        console.log('');
      });
  };

  // const handleYearChange = (event = {}, data = '') => {
  //   setYear(data?.id);
  //   setAcademicYearVal(data?.session_year);
  //   setYearDisplay(data);
  //   setBranchList([]);
  //   setBranchDisplay('');
  //   setBranch(null);
  //   if (data) {
  //     getBranches(data?.id);
  //   }
  // };

  const handleBranchChange = (event, data) => {
    setSearchGrade([]);
    setSearchSection([]);
    setSubjects([]);
    setGrades([]);
    setSearchGrade([]);
    setBranch(data?.id);
    setBranchCode(data?.branch_code);
    setBranchDisplay(data);
    if (data?.id > 0 && selectedAcademicYear?.id > 0) {
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${data?.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.status === 200) {
            setGrades(result.data.data);
            // setSearchGrade(result.data.data);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  const handleGrade = (event, value) => {
    if (value) {
      setSearchGrade([value]);
      setSearchGradeId(value.grade_id);
      setSections([]);
      setSubjects([]);
      setSearchSection([]);
      setSectionDisp('');
      axiosInstance
        .get(
          `${endpoints.academics.sections}?session_year=${selectedAcademicYear?.id}&branch_id=${branch}&grade_id=${value.grade_id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSections(result.data.data);
            setSearchSection(result.data.data);
          } else {
            setAlert('error', result.data.message);
            setSections([]);
            setSearchSection([]);
            setSubjects([]);
            setSectionDisp('');
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSections([]);
          setSearchSection([]);
          setSubjects([]);
          setSectionDisp('');
        });
    } else {
      setSearchGrade(grades);
      setSections([]);
      setSearchSection([]);
      setSubjects([]);
      setSearchGradeId('');
      setSectionDisp('');
    }
  };

  const handleSection = (event, value) => {
    if (value) {
      setSectionDisp(value);
      setSearchSection([value]);
      setSubjects([]);
      axiosInstance
        .get(
          `${endpoints.academics.subjects}?session_year=${selectedAcademicYear?.id}&branch=${branch}&grade=${searchGradeId}&section=${value.section_id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSubjects(result.data.data);
          } else {
            setAlert('error', result.data.message);
            setSubjects([]);
            setSectionDisp('');
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSubjects([]);
          setSectionDisp('');
        });
    } else {
      setSearchSection(sections);
      setSubjects([]);
      setSectionDisp('');
    }
  };

  return (
    <>
      <Grid container spacing={4} style={{ marginBottom: 20 }}>
        {/* <Grid item md={3} xs={12}>
          <Autocomplete
            size='small'
            id='create__class-subject'
            className='dropdownIcon'
            options={yearList || []}
            value={yearDisplay || ''}
            getOptionLabel={(option) => option.session_year || ''}
            filterSelectedOptions
            onChange={handleYearChange}
            required
            renderInput={(params) => (
              <TextField
                size='small'
                className='create__class-textfield'
                {...params}
                variant='outlined'
                label='Academic year'
                placeholder='Academic year'
                required
              />
            )}
          />
        </Grid> */}
        <Grid item md={3} xs={12}>
          <Autocomplete
            size='small'
            id='create__class-subject'
            className='dropdownIcon'
            options={branchList || []}
            value={branchDisplay || ''}
            getOptionLabel={(option) => option.branch_name || ''}
            filterSelectedOptions
            onChange={handleBranchChange}
            required
            renderInput={(params) => (
              <TextField
                size='small'
                className='create__class-textfield'
                {...params}
                variant='outlined'
                label='Branch'
                placeholder='Branch'
                required
              />
            )}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Box display='flex' flexDirection='column'>
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
                  href='/assets/download-format/erp_user.xlsx'
                  download='format.xlsx'
                >
                  Download format
                </a>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          md={3}
          xs={0}
          style={isMobile ? { display: 'none' } : { display: 'block' }}
        />
        <Grid item md={2} xs={6}>
          <Button
            variant='contained'
            className='canceButton labelColor'
            style={{ width: '100%' }}
            size='medium'
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </Grid>
        <Grid item md={2} xs={6}>
          {uploadFlag ? (
            <Button
              disabled
              style={{ color: 'white', opacity: '0.7', width: '100%' }}
              size='medium'
            >
              Uploading
            </Button>
          ) : (
            <Button
              variant='contained'
              style={{ color: 'white', width: '100%' }}
              color='primary'
              size='medium'
              onClick={handleFileUpload}
            >
              Upload
            </Button>
          )}
        </Grid>
      </Grid>
      {branch && (
        <>
          <hr style={{ backgroundColor: '#e2e2e2', border: 'none', height: '1px' }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography className={classes.guidelinesText}>Guidelines:</Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.root}>
                {guidelines.map((val, i) => {
                  return (
                    <div className={classes.guideline}>
                      {i + 1}. 
                      <span className={classes.guidelineval}>{val.name}</span>
                      <span>{val.field}</span>
                    </div>
                  );
                })}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.guidelinesText}>Suggestions:</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                size='small'
                onChange={handleGrade}
                style={{ width: '100%' }}
                id='grade'
                options={grades || []}
                className='dropdownIcon'
                getOptionLabel={(option) => option?.grade__grade_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grades'
                    placeholder='Grades'
                    required
                  />
                )}
              />
              <Paper className={`${classes.root} common-table`}>
                <TableContainer className={classes.container}>
                  <Table stickyHeader aria-label='sticky table'>
                    <TableHead className='table-header-row'>
                      <TableRow>
                        {columnsGrade.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            className={classes.columnHeader}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchGrade.map((grade, index) => {
                        return (
                          <TableRow
                            hover
                            grade='checkbox'
                            tabIndex={-1}
                            key={`grade_suggestion_list${index}`}
                          >
                            <TableCell className={classes.tableCell}>
                              {grade.grade_id}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {grade.grade__grade_name}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            {searchGradeId && searchSection && (
              <Grid item xs sm={4}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleSection}
                  id='section'
                  className='dropdownIcon'
                  options={sections || []}
                  value={sectionDisp || ''}
                  getOptionLabel={(option) => option?.section__section_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Sections'
                      placeholder='Sections'
                    />
                  )}
                />
                <Paper className={`${classes.root} common-table`}>
                  <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label='sticky table'>
                      <TableHead className='table-header-row'>
                        <TableRow>
                          {columnsSection.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                              className={classes.columnHeader}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {searchSection.map((section, index) => {
                          return (
                            <TableRow
                              hover
                              section='checkbox'
                              tabIndex={-1}
                              key={`section_suggestion_list${index}`}
                            >
                              <TableCell className={classes.tableCell}>
                                {section.id}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {section.section__section_name}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
            {searchGradeId && sectionDisp && subjects.length > 0 && (
              <Grid item xs sm={4}>
                <Paper
                  className={`${classes.root} common-table`}
                  style={isMobile ? {} : { marginTop: '40px' }}
                >
                  <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label='sticky table'>
                      <TableHead className='table-header-row'>
                        <TableRow>
                          {columnsSubject.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                              className={classes.columnHeader}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subjects.map((subject, index) => {
                          return (
                            <TableRow
                              hover
                              subject='checkbox'
                              tabIndex={-1}
                              key={`subject_suggestion_list${index}`}
                            >
                              <TableCell className={classes.tableCell}>
                                {subject.subject__id}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {subject.subject__subject_name}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </>
  );
};

export default BulkUpload;
