/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  FormControl,
  InputLabel,
  OutlinedInput,
  Divider,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import CreateSubjectMapping from './create-subject-mapping';
import Loading from '../../../components/loader/loader';
import '../master-management.css';
import SubjectMappingCard from './subject-mapping-card';
import { SearchOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  container: {
    maxHeight: '70vh',
    width: '100%',
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
  buttonContainer: {
    width: '95%',
    margin: '0 auto',
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
  },
}));

const columns = [
  { id: 'session_year', label: 'Session Year', minWidth: 100 },
  { id: 'branch_name', label: 'Branch', minWidth: 100 },
  { id: 'grade_name', label: 'Grade', minWidth: 100 },
  { id: 'section_name', label: 'Section', minWidth: 100 },
  {
    id: 'subject_name',
    label: 'Subject',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'created_by',
    label: 'Created by',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'desc',
    label: 'Description',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'optional',
    label: 'Optional',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'center',
    labelAlign: 'center',
  },
];

const SubjectMappingTable = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [subjectId, setSubjectId] = useState();
  const [subjectName, setSubjectName] = useState('');
  const [addFlag, setAddFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [desc, setDesc] = useState('');
  const [delFlag, setDelFlag] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchSubject, setSearchSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [opt, setOpt] = useState(false);
  const limit = 15;
  const [goBackFlag, setGoBackFlag] = useState(false);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState();
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [clearAll, setClearAll] = useState(false);
  const [clearAllActive, setClearAllActive] = useState(false);
  const [filterCheck, setFilterCheck] = useState(false);
  const [pageno, setPageno] = useState(1);

  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  const getYearApi = async () => {
    try {
      const result = await axiosInstance.get(
        `/erp_user/list-academic_year/?module_id=${moduleId}`
      );
      if (result.status === 200) {
        setAcademicYearList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getBranchApi = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.branches}?session_year=${selectedYear.id}&module_id=${moduleId}`
      );
      if (result.data.status_code === 200) {
        setBranchList(result.data.data.results);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const getGradeApi = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${selectedBranch?.branch.id}&module_id=${moduleId}`
      );
      if (result.data.status_code === 200) {
        setGradeList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const getSectionApi = async () => {
    try {
      const selectedGradeId = selectedGrades.map((el) => el.id);
      const result = await axiosInstance.get(
        `${endpoints.communication.sections}?session_year=${selectedYear.id}&branch_id=${
          selectedBranch?.branch.id
        }&grade_id=${selectedGradeId.toString()}&module_id=${moduleId}`
      );
      if (result.status === 200) {
        setSectionList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      getBranchApi();
    }
  }, [selectedYear]);

  useEffect(() => {
    if (moduleId) getYearApi();
  }, [moduleId]);

  useEffect(() => {
    if (selectedBranch) {
      getGradeApi();
    }
  }, [selectedBranch]);
  useEffect(() => {
    if (selectedGrades.length) {
      getSectionApi();
    }
  }, [selectedGrades]);

  const handleYear = (event, value) => {
    setSelectedYear('');
    setSelectedBranch('');
    setSelectedGrades([]);
    setSelectedSections([]);
    if (value) {
      setSelectedYear(value);
    }
  };
  const handleBranch = (event, value) => {
    setSelectedBranch('');
    setSelectedGrades([]);
    setSelectedSections([]);
    if (value) {
      setSelectedBranch(value);
    }
  };

  const handleGrades = (event, value) => {
    setSelectedGrades([]);
    setSelectedSections([]);
    if (value.length) {
      const ids = value.map((el) => el);
      setSelectedGrades(ids);
    }
  };

  const handleSections = (event, value) => {
    setSelectedSections([]);
    if (value.length) {
      const ids = value.map((el) => el);
      setSelectedSections(ids);
    }
  };

  const handleClearAll = () => {
    if (clearAllActive) {
      setSearchSubject('');
      setSelectedSections([]);
      setSelectedBranch('');
      setSelectedYear('');
      setSelectedGrades([]);
      setClearAll(true);
      setClearAllActive(false);
    }
  };

  const handleFilterCheck = () => {
    if (
      selectedYear ||
      selectedBranch ||
      selectedGrades.length ||
      selectedSections.length ||
      searchSubject
    ) {
      // setSelectedUsers([]);
      // setSelectAllObj([]);
      // setPageno(1);
      // setTotalPage(0);
      setFilterCheck(true);
      displayUsersList();
    }
  };

  useEffect(() => {
    if (clearAll) {
      setClearAll(false);
    }
    if (filterCheck) {
      setFilterCheck(false);
    }
  }, [clearAll, filterCheck]);

  useEffect(() => {
    if (selectedGrades.length || selectedSections.length || searchSubject) {
      setClearAllActive(true);
    }
  }, [selectedGrades, selectedSections, searchSubject]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Master Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Subject Mapping') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const displayUsersList = async () => {
    let getUserListUrl = `${endpoints.masterManagement.subjectMappingTable}?page=${page}&page_size=${limit}`;
    if (selectedYear) {
      getUserListUrl += `&session_year=${selectedYear.session_year}`;
    }
    if (selectedBranch) {
      getUserListUrl += `&branch_name=${selectedBranch.branch.branch_name}`;
    }
    if (selectedGrades.length) {
      const selectedGradeId = selectedGrades.map((el) => el.grade_name);
      getUserListUrl += `&grade_name=${selectedGradeId.toString()}`;
    }
    if (searchSubject) {
      getUserListUrl += `&subject=${searchSubject}`;
    }
    try {
      const result = await axiosInstance.get(getUserListUrl);
      if (result.status === 200) {
        setTotalCount(result.data?.data?.count);
        setSubjects(result.data?.data?.results);
      } else {
        setAlert('error', result.data?.msg || result.data?.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleAddSubjectMapping = () => {
    setTableFlag(false);
    setAddFlag(true);
  };

  const handleGoBack = () => {
    setPage(1);
    setTableFlag(true);
    setAddFlag(false);
    setSearchSubject('');
    setGoBackFlag(!goBackFlag);
  };

  const handleDeleteSubject = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.deleteSubjectMapping}${subjectId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDelFlag(!delFlag);
          setLoading(false);
          setAlert('success', result.data.msg || result.data.message);
        } else {
          setLoading(false);
          setAlert('error', result.data.msg || result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.response?.data?.message || error.response?.data?.msg);
      });
    setOpenDeleteModal(false);
  };

  const handleOpenDeleteModal = (id, name) => {
    setSubjectId(id);
    setSubjectName(name);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 450);
  }, [goBackFlag, page, delFlag]);

  useEffect(() => {
    let url = `${endpoints.masterManagement.subjectMappingTable}?page=${page}&page_size=${limit}`;
    if (searchSubject) url += `&subject=${searchSubject}`;

    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          setTotalCount(result.data?.data?.count);
          setSubjects(result.data?.data?.results);
        } else {
          setAlert('error', result.data?.msg || result.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.response?.data?.message || error.response?.data?.msg);
      });
  }, [goBackFlag, delFlag, page, searchSubject, clearAll]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Subject Mapping List'
          childComponentNameNext={
            addFlag && !tableFlag
              ? 'Add Subject Mapping'
              : !tableFlag
              ? 'Edit Mapping Subject'
              : null
          }
        />

        {!tableFlag && addFlag && (
          <CreateSubjectMapping
            moduleId={moduleId}
            setLoading={setLoading}
            handleGoBack={handleGoBack}
          />
        )}

        {tableFlag && !addFlag && (
          <>
            <Grid
              container
              spacing={isMobile ? 3 : 5}
              style={{ width: widerWidth, margin: wider }}
            >
              <Grid item xs={12} sm={3}>
                <FormControl
                  variant='outlined'
                  className={classes.formControl}
                  fullWidth
                  size='small'
                >
                  <InputLabel>Search Subject</InputLabel>
                  <OutlinedInput
                    endAdornment={<SearchOutlined color='primary' />}
                    placeholder='Search Subject ..'
                    label='Search Subject'
                    value={searchSubject}
                    onChange={(e) => {
                      setPage(1);
                      setSearchSubject(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <Autocomplete
                  size='small'
                  onChange={handleYear}
                  value={selectedYear || ''}
                  id='message_log-branch'
                  className='message_log_branch'
                  options={academicYearList || []}
                  getOptionLabel={(option) => option?.session_year || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='Academic Year'
                      placeholder='Academic Year'
                    />
                  )}
                />
              </Grid>

              {selectedYear && (
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    size='small'
                    onChange={handleBranch}
                    value={selectedBranch || ''}
                    id='message_log-branch'
                    className='message_log_branch'
                    options={branchList || []}
                    getOptionLabel={(option) => option?.branch?.branch_name || ''}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        className='message_log-textfield'
                        {...params}
                        variant='outlined'
                        label='Branch'
                        placeholder='Branch'
                      />
                    )}
                  />
                </Grid>
              )}
              {selectedBranch && (
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    multiple
                    size='small'
                    onChange={handleGrades}
                    value={selectedGrades || ''}
                    id='message_log-smsType'
                    options={gradeList || []}
                    getOptionLabel={(option) => option?.grade__grade_name || ''}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        className='message_log-textfield'
                        {...params}
                        variant='outlined'
                        label='Grade'
                        placeholder='Grade'
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid
                container
                spacing={isMobile ? 3 : 5}
                style={{ width: widerWidth, margin: wider }}
              >
                <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                  <Button
                    variant='contained'
                    className='labelColor cancelButton'
                    style={{ width: '100%' }}
                    size='medium'
                    onClick={handleClearAll}
                  >
                    Clear All
                  </Button>
                </Grid>
                <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                  <Button
                    variant='contained'
                    style={{ color: 'white', width: '100%' }}
                    color='primary'
                    size='medium'
                    onClick={handleFilterCheck}
                  >
                    Filter
                  </Button>
                </Grid>
                <div>
                  <Divider
                    orientation='vertical'
                    style={{
                      backgroundColor: '#014e7b',
                      height: '40px',
                      marginTop: '1rem',
                      marginLeft: '2rem',
                      marginRight: '1.25rem',
                    }}
                  />
                </div>
                <Grid item xs={12} sm={3} className={isMobile ? '' : 'addButtonPadding'}>
                  <Button
                    startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                    variant='contained'
                    color='primary'
                    style={{ color: 'white', width: '100%' }}
                    size='medium'
                    title='Add Subject Mapping'
                    onClick={handleAddSubjectMapping}
                  >
                    Add Subject Mapping
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}

        <>
          {/* {!isMobile ? ( */}
          <>
            {tableFlag && !addFlag && (
              <Paper className={`${classes.root} common-table`}>
                <TableContainer className={classes.container}>
                  <Table stickyHeader aria-label='sticky table'>
                    <TableHead className='table-header-row'>
                      <TableRow>
                        {columns.map((column) => (
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
                        const {
                          created_by,
                          id,
                          subject: subjectObject = {},
                          section_mapping: subjectMapping = {},
                        } = subject || {};
                        const { subject_name, subject_description, is_optional } =
                          subjectObject || {};
                        const {
                          grade: { grade_name } = {},
                          section: { section_name } = {},
                          acad_session: {
                            branch: { branch_name } = {},
                            session_year: { session_year } = {},
                          } = subjectMapping || {},
                        } = subjectMapping || {};

                        return (
                          <TableRow hover subject='checkbox' tabIndex={-1} key={index}>
                            <TableCell className={classes.tableCell}>
                              {session_year || ''}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {branch_name || ''}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {grade_name || ''}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {section_name || ''}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {subject_name || ''}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {created_by || ''}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {subject_description || ''}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {is_optional ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              <IconButton
                                onClick={(e) => {
                                  handleOpenDeleteModal(id, subject_name);
                                }}
                                title='Delete Subject Mapping'
                              >
                                <DeleteOutlinedIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className='paginateData'>
                  <TablePagination
                    component='div'
                    count={totalCount}
                    className='customPagination'
                    rowsPerPage={limit}
                    page={page - 1}
                    onChangePage={handleChangePage}
                    rowsPerPageOptions={false}
                  />
                </div>
              </Paper>
            )}
          </>
          {/* ) : (
            <>
              <>
                {tableFlag && !addFlag && !editFlag && (
                  <>
                    {subjects.map((subject) => (
                      <SubjectMappingCard
                        data={subject}
                        handleOpenDeleteModal={handleOpenDeleteModal}
                        handleEditSubjectMapping={handleEditSubjectMapping}
                      />
                    ))}
                    <div className='paginateData paginateMobileMargin'>
                      <TablePagination
                        component='div'
                        count={totalCount}
                        rowsPerPage={limit}
                        page={page - 1}
                        onChangePage={handleChangePage}
                        rowsPerPageOptions={false}
                        className='table-pagination'
                      />
                    </div>
                  </>
                )}
              </>
            </>
          )} */}
        </>
        <Dialog
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby='draggable-dialog-title'
        >
          <DialogTitle id='draggable-dialog-title'>Delete Subject</DialogTitle>
          <DialogContent>
            <DialogContentText>{`Confirm Delete Subject Mapping`}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color='primary'
              onClick={handleDeleteSubject}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
};

export default SubjectMappingTable;
