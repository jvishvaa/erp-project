/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import CreateSectionMapping from './create-section-mapping';
import Loading from '../../../components/loader/loader';
import '../master-management.css';
import SectionMappingCard from './section-mapping-card';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  container: {
    maxHeight: '70vh',
  },
  centerInMobile: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
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

const columns = [
  { id: 'session_year', label: 'Session Year', minWidth: 100 },
  { id: 'branch_name', label: 'Branch', minWidth: 100 },
  { id: 'grade_name', label: 'Grade', minWidth: 100 },
  { id: 'section_name', label: 'Section', minWidth: 100 },
  { id: 'created_by', label: 'Created by', minWidth: 100 },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
    labelAlign: 'center',
  },
];

const SectionTable = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = React.useState(1);
  const [sections, setSections] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [sectionId, setSectionId] = useState();
  const [addFlag, setAddFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [delFlag, setDelFlag] = useState(false);
  const [searchSection, setSearchSection] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [yearDisplay, setYearDisplay] = useState([]);
  const [sectionData, setSectionData] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [academicYearList, setAcademicYearList] = useState([]);
  const limit = 15;
  const [goBackFlag, setGoBackFlag] = useState(false);

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [clearAll, setClearAll] = useState(false);
  const [clearAllActive, setClearAllActive] = useState(false);
  const [filterCheck, setFilterCheck] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [searchBranch, setSearchBranch] = useState();
  const [searchGrades, setSearchGrades] = useState([]);
  const [searchSections, setSearchSections] = useState([]);
  const [sectionList, setSectionList] = useState([]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Master Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Section Mapping') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (searchBranch) {
      getGradeApi();
    }
  }, [searchBranch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };
  const displayUsersList = async () => {
    let getUserListUrl = `${endpoints.masterManagement.sectionMappingTable}?page=${page}&page_size=${limit}`;
    if (selectedYear) {
      getUserListUrl += `&session_year=${selectedYear}`;
    }
    if (searchBranch) {
      getUserListUrl += `&branch_name=${searchBranch.branch.branch_name}`;
    }
    if (searchGrades.length) {
      const selectedGradeId = searchGrades.map((el) => el.grade_name);
      getUserListUrl += `&grade_name=${selectedGradeId.toString()}`;
    }
    if (searchSection) {
      getUserListUrl += `&section_name=${searchSection}`;
    }
    try {
      const result = await axiosInstance.get(getUserListUrl);
      if (result.status === 200) {
        setTotalCount(result.data?.data?.count);
        setSections(result.data?.data?.results);
      } else {
        setAlert('error', result.data?.msg || result.data?.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleAcademicYear = (event, value) => {
    setSelectedYear('');
    setSearchBranch('');
    setSearchGrades([]);
    setYearDisplay(value);
    if (value) {
      setPage(1);
      setSelectedYear(value.id);
    }
  };

  const handleClearAll = () => {
    setYearDisplay([]);
    setAcademicYearList([]);
    setSearchSection('');
    // setSelectedSection([]);
    setSelectedYear('');
    setBranchList([]);
    setGradeList([]);
    setGradeList([]);
    setSearchBranch('');
    setSelectedYear('');
    setSearchGrades([]);
    if (clearAllActive) {
      setSearchSection('');
      // setSelectedSection([]);
      setSelectedYear('');
      setBranchList([]);
      setGradeList([]);
      setGradeList([]);
      setSearchBranch('');
      setSelectedYear('');
      setSearchGrades([]);
      setClearAll(true);
      setClearAllActive(false);
    }
    AcademicYearApi();
  };

  const handleFilterCheck = () => {
    if (selectedYear || searchBranch || searchGrades.length || searchSections) {
      setFilterCheck(true);
      displayUsersList();
    }
  };

  const handleBranch = (event, value) => {
    setSearchBranch('');
    setSearchGrades([]);
    if (value) {
      setSearchBranch(value);
    }
  };

  const handleGrades = (event, value) => {
    setSearchGrades([]);
    if (value.length) {
      const ids = value.map((el) => el);
      setSearchGrades(ids);
    }
  };

  const handleAddSection = () => {
    setTableFlag(false);
    setAddFlag(true);
    setSearchSection('');
  };

  const handleGoBack = () => {
    setPage(1);
    setTableFlag(true);
    setAddFlag(false);
    setGoBackFlag(!goBackFlag);
    setSearchSection('');
    setSelectedYear('');
    setSectionData({});
  };

  const handleDeleteSection = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.deleteSectionMapping}${sectionId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDelFlag(!delFlag);
          setLoading(false);
          setAlert(
            'success',
            `Mapped Section ${result.data?.message || result.data?.msg}`
          );
        } else {
          setLoading(false);
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.response.data.msg);
      });
    setOpenDeleteModal(false);
  };

  const handleOpenDeleteModal = (id, sec) => {
    setSectionId(id);
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
  }, [page, delFlag, goBackFlag]);

  useEffect(() => {
    if (clearAll) {
      setClearAll(false);
    }
    if (filterCheck) {
      setFilterCheck(false);
    }
  }, [clearAll, filterCheck]);

  useEffect(() => {
    if (searchSection) {
      setClearAllActive(true);
    }
  }, [searchSection]);

  useEffect(() => {
    if (selectedYear) {
      getBranchApi();
    }
  }, [selectedYear]);

  const AcademicYearApi = () => {
    axiosInstance
      .get(`${endpoints.masterManagement.academicYear}?module_id=${moduleId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAcademicYearList(result.data?.result?.results);
        } else {
          setAlert('error', result?.data?.message || result?.data?.msg);
        }
      })
      .catch((error) => {
        setAlert('error', error?.response?.data?.message || error?.response?.data?.msg);
      });
  };

  useEffect(() => {
    if (moduleId) {
      AcademicYearApi();
    }
  }, [moduleId]);

  useEffect(() => {
    let url = `${endpoints.masterManagement.sectionMappingTable}?page=${page}&page_size=${limit}`;
    if (searchSection) url += `&section_name=${searchSection.toLowerCase()}`;
    if (selectedYear) url += `&session_year=${selectedYear}`;
    if (searchGrades) url += `&grade_name=${searchGrades}`;
    if (searchBranch) url += `&branch_name=${searchBranch}`;

    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          setTotalCount(result.data?.data?.count);
          setSections(result.data?.data?.results);
        } else {
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, [delFlag, goBackFlag, page, searchSection, selectedYear]);
  const getBranchApi = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.branches}?session_year=${selectedYear}&module_id=${moduleId}`
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
        `${endpoints.communication.grades}?session_year=${selectedYear}&branch_id=${searchBranch?.branch.id}&module_id=${moduleId}`
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

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Section Mapping List'
          childComponentNameNext={
            addFlag && !tableFlag
              ? 'Add Section Mapping'
              : !tableFlag
              ? 'Edit Section Mapping'
              : null
          }
        />
        {!tableFlag && addFlag && (
          <CreateSectionMapping
            moduleId={moduleId}
            setLoading={setLoading}
            handleGoBack={handleGoBack}
          />
        )}

        {tableFlag && !addFlag && (
          <Grid
            container
            spacing={isMobile ? 3 : 5}
            style={{ width: widerWidth, margin: wider }}
          >
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Box className={classes.centerInMobile}>
                <TextField
                  id='secname'
                  style={{ width: '100%' }}
                  label='Section Name'
                  variant='outlined'
                  size='small'
                  autoComplete='off'
                  name='secname'
                  onChange={(e) => setSearchSection(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                size='small'
                onChange={handleAcademicYear}
                // style={{ width: '100%' }}
                id='session-year'
                options={academicYearList || []}
                value={yearDisplay || ''}
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
            </Grid>
            {selectedYear && (
              <Grid item xs={12} md={3}>
                <Autocomplete
                  size='small'
                  onChange={handleBranch}
                  value={searchBranch || ''}
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
            {searchBranch && (
              <Grid item xs={12} md={3}>
                <Autocomplete
                  multiple
                  size='small'
                  onChange={handleGrades}
                  value={searchGrades || ''}
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
            <Grid item xs sm={6} className={isMobile ? 'hideGridItem' : ''} />
            <Grid
              container
              spacing={isMobile ? 3 : 5}
              style={{ width: widerWidth, margin: wider }}
            >
              <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                  variant='contained'
                  size='medium'
                  style={{ width: '100%' }}
                  className='labelColor cancelButton'
                  onClick={handleClearAll}
                >
                  CLEAR ALL
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
                  FILTER
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
                  size='medium'
                  style={{ color: 'white', width: '100%' }}
                  title='Add Section Mapping'
                  onClick={handleAddSection}
                >
                  Add Section Mapping
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}

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
                  {sections.map((sect, index) => {
                    const {
                      id,
                      section,
                      grade: { grade_name },
                      acad_session: {
                        branch: branchObj = {},
                        session_year: sessionObj = {},
                      },
                    } = sect;
                    const { branch_name = 'Branch not found' } = branchObj || {};
                    const { session_year = 'Session not found' } = sessionObj || {};
                    return (
                      <TableRow hover section='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell}>
                          {session_year || ''}
                        </TableCell>
                        <TableCell className={classes.tableCell}>{branch_name}</TableCell>
                        <TableCell className={classes.tableCell}>{grade_name}</TableCell>
                        <TableCell className={classes.tableCell}>
                          {section?.section_name}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {section?.created_by}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <IconButton
                            onClick={() => handleOpenDeleteModal(id, section)}
                            title='Delete Section Mapping'
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
                rowsPerPage={limit}
                page={page - 1}
                onChangePage={handleChangePage}
                rowsPerPageOptions={false}
              />
            </div>
          </Paper>
        )}
        {/* {isMobile && tableFlag && !addFlag && (
          <>
            <Container className={classes.cardsContainer}>
              {sections.map((section, i) => (
                <SectionMappingCard
                  section={section.section}
                  onEdit={(section) => {
                    handleEditSection(section.id, section.section_name);
                  }}
                  onDelete={(section) => {
                    handleOpenDeleteModal(section.id);
                  }}
                />
              ))}
            </Container>
            <div className='paginateData paginateMobileMargin'>
              <TablePagination
                component='div'
                count={totalCount}
                rowsPerPage={limit}
                page={page - 1}
                onChangePage={handleChangePage}
                rowsPerPageOptions={false}
              />
            </div>
          </>
        )} */}
        <Dialog
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby='draggable-dialog-title'
        >
          <DialogTitle id='draggable-dialog-title'>Delete Section</DialogTitle>
          <DialogContent>
            <DialogContentText>{`Confirm Delete Section Mapping`}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color='primary'
              onClick={handleDeleteSection}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
};

export default SectionTable;
