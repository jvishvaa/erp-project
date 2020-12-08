/* eslint-disable import/no-absolute-path */
/* eslint-disable global-require */
import React, { useEffect, useState, useContext } from 'react';
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '40vh'
  },
  buttonContainer: {
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
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
    label: 'Id',
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

const columnsGender = [
  {
    id: 'gender_id',
    label: 'Id',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'gender',
    label: 'Gender',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
]

const BulkUpload = ({ onUploadSuccess }) => {
  const [branch, setBranch] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [year, setYear] = useState(null);
  const [yearList, setYearList] = useState([]);
  const [file, setFile] = useState(null);
  const [grades, setGrades] = useState([])
  const [subjects, setSubjects] = useState([])
  const [sections, setSections] = useState([]);
  const [uploadFlag, setUploadFlag] = useState(false);
  const classes = useStyles();
  const [searchGrade, setSearchGrade] = useState([])
  const [searchSection, setSearchSection] = useState([])
  const [searchGradeId, setSearchGradeId] = useState('')
  const [sectionDisp, setSectionDisp] = useState({})
  const genders = [{ 'id': '1', 'gender': 'Male' }, { 'id': '2', 'gender': 'Female' }, { 'id': '3', 'gender': 'Other' }]
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'))
  const { role_details } = JSON.parse(localStorage.getItem('userDetails'))
  const history = useHistory()
  const { setAlert } = useContext(AlertNotificationContext);

  const getBranches = async () => {
    try {
      const data = await axios.get('erp_user/branch/');
      setBranchList(data.data.data);
    } catch (error) {
      console.log('failed to load branches');
    }
  };

  const getYears = async () => {
    try {
      const data = await axios.get('erp_user/list-academic_year/');
      setYearList(data.data.data);
    } catch (error) {
      console.log('failed to load years');
    }
  };

  useEffect(() => {
    getBranches();
    getYears();
  }, []);

  useEffect(() => {
    if (branch)
      axiosInstance.get(`${endpoints.academics.grades}?branch_id=5`)
        .then(result => {
          if (result.status === 200) {
            setGrades(result.data.data);
            setSearchGrade(result.data.data)
          } else {
            setAlert('error', result.data.message)
            setGrades([])
            setSearchGrade([])
          }
        })
        .catch((error) => {
          setAlert('error', error.message)
          setGrades([])
          setSearchGrade([])
        })
  }, [branch]);

  const handleFileChange = (event) => {
    const { files } = event.target;
    const file = files[0];
    setFile(file);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append('branch', branch);
    formData.append('academic_year', year);
    formData.append('file', file);
    if (branch && year && file) {
      setUploadFlag(true)
      axios.post('/erp_user/upload_bulk_user/', formData)
        .then(result => {
          if (result.data.status_code === 200) {
            setBranch(null);
            setYear(null);
            setFile(null);
            onUploadSuccess();
            setAlert('success', result.data.message);
            setUploadFlag(false)
            history.push('/user-management/bulk-upload')
          } else {
            setAlert('error', result.data.description);
            setUploadFlag(false)
          }
        })
        .catch(error => {
          setAlert('error', error.response.data.description);
          setUploadFlag(false)
        })
    }
    else {
      if (!branch) {
        setAlert('error', 'Branch is required!')
      }
      else if (!year) {
        setAlert('error', 'Year is required!')
      }
      else if (!file) {
        setAlert('error', 'File is required!')
      }
    }
  };

  const handleBranchChange = (event, data) => {
    setBranch(data?.id);
    setSearchGrade([])
    setSearchSection([])
    setSubjects([])
  };

  const handleYearChange = (event, data) => {
    setYear(data?.id);
  };

  const handleGrade = (event, value) => {
    if (value) {
      setSearchGrade([value])
      setSearchGradeId(value.grade_id)
      setSections([])
      setSubjects([])
      setSearchSection([])
      setSectionDisp('')
      axiosInstance.get(`${endpoints.academics.sections}?branch_id=${role_details.branch[0]}&grade_id=${value.grade_id}`)
        .then(result => {
          if (result.data.status_code === 200) {
            setSections(result.data.data)
            setSearchSection(result.data.data)
          }
          else {
            setAlert('error', result.data.message)
            setSections([])
            setSearchSection([])
            setSubjects([])
            setSectionDisp('')
          }
        })
        .catch(error => {
          setAlert('error', error.message);
          setSections([])
          setSearchSection([])
          setSubjects([])
          setSectionDisp('')
        })
    }
    else {
      setSearchGrade(grades)
      setSections([])
      setSearchSection([])
      setSubjects([])
      setSearchGradeId('')
      setSectionDisp('')
    }
  }

  const handleSection = (event, value) => {

    if (value) {
      setSectionDisp(value)
      setSearchSection([value])
      setSubjects([])
      axiosInstance.get(`${endpoints.academics.subjects}?branch=${role_details.branch[0]}&grade=${searchGradeId}&section=${value.section_id}`)
        .then(result => {
          if (result.data.status_code === 200) {
            setSubjects(result.data.data)
          }
          else {
            setAlert('error', result.data.message)
            setSubjects([])
            setSectionDisp('')
          }
        })
        .catch(error => {
          setAlert('error', error.message);
          setSubjects([])
          setSectionDisp('')
        })
    }
    else {
      setSearchSection(sections)
      setSubjects([])
      setSectionDisp('')
    }
  }

  return (
    <>
      <Grid container spacing={4} style={{ marginBottom: 20 }}>
        <Grid item md={3} xs={12}>
          <Autocomplete
            size='small'
            id='create__class-subject'
            options={branchList}
            getOptionLabel={(option) => option.branch_name}
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
          <Autocomplete
            size='small'
            id='create__class-subject'
            options={yearList}
            getOptionLabel={(option) => option.session_year}
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
        </Grid>
        <Grid item md={3} xs={12}>
          <Box display='flex' flexDirection='column'>
            <Input type='file' required onChange={handleFileChange} />
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
        <Grid item md={3} xs={12}>
          {uploadFlag ?
            <Button disabled style={{ color: 'white', opacity: '0.7' }}>Uploading</Button>
            : <Button variant='contained' color='primary' onClick={handleFileUpload}>Upload</Button>}
        </Grid>
      </Grid>
      {branch &&
        <>
          <hr />
          <Grid container spacing={isMobile ? 3 : 5}>
            <Grid item xs={12} className={isMobile ? '' : 'addButtonPadding'}>
              <h2 style={{ color: '#014B7e' }}>Suggestions:</h2>
            </Grid>
            <Grid item xs={12}>
              <Paper>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3} >
              <Autocomplete
                size='small'
                onChange={handleGrade}
                style={{ width: '100%' }}
                id='grade'
                options={grades}
                getOptionLabel={(option) => option?.grade__grade_name}
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
                          <TableRow hover grade='checkbox' tabIndex={-1} key={`grade_suggestion_list${index}`}>
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
            {searchGrade.length === 1 && searchSection &&
              <Grid item xs sm={3}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleSection}
                  id='section'
                  options={sections}
                  value={sectionDisp}
                  getOptionLabel={(option) => option?.section__section_name}
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
                            <TableRow hover section='checkbox' tabIndex={-1} key={`section_suggestion_list${index}`}>
                              <TableCell className={classes.tableCell}>
                                {section.section_id}
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
            }
            {searchGradeId && sectionDisp && subjects.length > 0 &&
              <Grid item xs sm={3}>
                <Paper className={`${classes.root} common-table`}>
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
                            <TableRow hover subject='checkbox' tabIndex={-1} key={`subject_suggestion_list${index}`}>
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
            }
            {searchGradeId && sectionDisp && subjects.length > 0 &&
              <Grid item xs sm={3}>
                <Paper className={`${classes.root} common-table`}>
                  <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label='sticky table'>
                      <TableHead className='table-header-row'>
                        <TableRow>
                          {columnsGender.map((column) => (
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
                        {genders.map((row, index) => {
                          return (
                            <TableRow hover gender='checkbox' tabIndex={-1} key={`gender_list${index}`}>
                              <TableCell className={classes.tableCell}>
                                {row.id}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {row.gender}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            }
          </Grid>
        </>
      }
    </>
  );
};

export default BulkUpload;
