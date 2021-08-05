/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../../config/axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {
  Grid,
  Button,
  Paper,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import EditChapterType from './edit-chapter-type';

import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import CreateChapterType from './create-chapter-type';
import ChapterTypeCard from './chapter-type-card';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  container: {
    maxHeight: '70vh',
  },
  buttonContainer: {
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
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
  { id: 'chapter_type', label: 'Chapter', minWidth: 100 },
  // { id: 'topic_type', label: 'Topic', minWidth: 100 },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
    labelAlign: 'center',
  },
];

const ChapterTypeTable = (setCentralSubjectName) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [addFlag, setAddFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(1);
  const [goBackFlag, setGoBackFlag] = useState(false);
  const limit = 15;
  const [delFlag, setDelFlag] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [messageType, setMessageType] = useState([]);
  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [overviewSynopsis, setOverviewSynopsis] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [centralGsMappingId, setCentralGsMappingId] = useState();
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [messageTypeId, setMessageTypeId] = useState();
  const [categoryName, setCategoryName] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Master Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Chapter Creation') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const themeContext = useTheme();

  const [filterData, setFilterData] = useState({
    year: '',
    branch: [],
    grade: [],
    section: [],
    role: '',
  });
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const handleAddChapterType = () => {
    setTableFlag(false);
    setAddFlag(true);
    setEditFlag(false);
  };

  const handleGoBack = () => {
    setPage(1);
    setTableFlag(true);
    setAddFlag(false);
    setEditFlag(false);
    setGoBackFlag(!goBackFlag);
  };

  useEffect(() => {
    if (moduleId) {
      axiosInstance
        .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
        .then((result) => {
          if (result.status === 200) {
            setAcademicYear(result.data.data);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [moduleId]);

  useEffect(() => {
    if (filterData?.year && filterData?.subject) {
      handleFilter();
    }
  }, [delFlag, goBackFlag, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleAcademicYear = (event, value) => {
    setFilterData({ ...filterData, year: '' });
    if (value) {
      setFilterData({ ...filterData, year: value });
      axiosInstance
        .get(
          `${endpoints.academics.branches}?session_year=${value.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.status === 200) {
            setBranchDropdown(result.data.data.results);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  useEffect(() => {
    if (academicYear.length > 0) {
      academicYear.map((option) => {
        if (option.session_year === '2021-22') {
          handleAcademicYear('', option);
        }
      });
    }
  }, [academicYear]);

  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '', grade: '', subject: '', chapter: '' });
    setOverviewSynopsis([]);
    if (value) {
      setFilterData({
        ...filterData,
        branch: value,
        grade: '',
        subject: '',
        chapter: '',
      });
      axiosInstance
        .get(
          `${endpoints.communication.grades}?session_year=${filterData.year.id}&branch_id=${value.branch.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            setGradeDropdown([]);
            setSubjectDropdown([]);
            setChapterDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setGradeDropdown([]);
          setSubjectDropdown([]);
          setChapterDropdown([]);
        });
    } else {
      setGradeDropdown([]);
      setSubjectDropdown([]);
      setChapterDropdown([]);
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '', section: '', subject: '' });
    if (value) {
      setFilterData({ ...filterData, grade: value });
      axiosInstance
        .get(
          `${endpoints.lessonReport.subjects}?branch=${filterData.branch.branch.id}&grade=${value.grade_id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSubjectDropdown(result.data.result);
          } else {
            setAlert('error', result.data.message);
            setSubjectDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSubjectDropdown([]);
        });

      axiosInstance
        .get(
          `${endpoints.masterManagement.sections}?session_year=${filterData.year.id}&branch_id=${filterData.branch.branch.id}&grade_id=${value.grade_id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            // setSubjectDropdown(result.data.result);
            setSectionDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            // setSubjectDropdown([]);
            setSectionDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSectionDropdown([]);
        });
    } else {
      setSubjectDropdown([]);
      setSectionDropdown([]);
    }
  };

  const handleSubject = (event, value) => {
    setFilterData({ ...filterData, subject: '', chapter: '' });
    setOverviewSynopsis([]);
    if (filterData.grade && filterData.year && value) {
      setFilterData({ ...filterData, subject: value, chapter: '' });
      if (value && filterData.branch && filterData.year && filterData.volume) {
        axiosInstance
          .get(
            `${endpoints.lessonPlan.chapterList}?gs_mapping_id=${value.id}&academic_year=${filterData.year.id}&grade_id=${filterData.grade.grade_id}`
          )
          .then((result) => {
            if (result.data.status_code === 200) {
              setChapterDropdown(result.data.result.chapter_list);
              setCentralGsMappingId(result.data.result?.central_gs_mapping_id);
              setCentralSubjectName(result.data.result?.central_subject_name);
              // setCentralGradeName(result.data.result?.central_grade_name);
            } else {
              setAlert('error', result.data.message);
              setChapterDropdown([]);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setChapterDropdown([]);
          });
      }
    } else {
      setChapterDropdown([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 450);
  }, [page, delFlag, goBackFlag]);

  const handleFilter = () => {
    axiosInstance
      .get(
        //   `${endpoints.masterManagement.ViewChapter}?page=${page}&page_size=${limit}&academic_year=${1}&subject=${166}`
        `${endpoints.masterManagement.ViewChapter}?page=${page}&page_size=${limit}&academic_year=${filterData?.year.id}&subject=${filterData?.subject.subject_id}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setTotalCount(result.data.result.count);
          setMessageType(result.data.result.results);
        } else {
          setAlert('error', result.data.error_msg);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  const handleClear = () => {
    setFilterData({
      year: '',
      branch: [],
      grade: [],
      section: [],
      role: '',
    });
  };
  const handleSection = (event, value) => {
    setFilterData({ ...filterData, section: '' });
    if (value) {
      setFilterData({ ...filterData, section: value });
    }
  };
  const handleEditMessageType = (id, name) => {
    setTableFlag(false);
    setAddFlag(false);
    setEditFlag(true);
    setMessageTypeId(id);
    setCategoryName(name);
  };

  const handleDeleteMessageType = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.editChapter}${messageTypeId}/delete-chapter/`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDelFlag(!delFlag);
          setLoading(false);
          setAlert('success', result.data.message);
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
    setOpenDeleteModal(false);
  };
  const handleDelete = (msgtype) => {
    setCategoryName(msgtype.chapter_name);
    handleOpenDeleteModal(msgtype.id);
  };

  const handleOpenDeleteModal = (id) => {
    setMessageTypeId(id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  return (
    <>
      <Layout>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Chapter List'
          childComponentNameNext={
            addFlag && !tableFlag
              ? 'Add Chapter'
              : editFlag && !tableFlag
              ? 'Edit Chapter'
              : null
          }
        />
        {!tableFlag && addFlag && !editFlag && (
          <CreateChapterType setLoading={setLoading} handleGoBack={handleGoBack} />
        )}
        {!tableFlag && !addFlag && editFlag && (
          <EditChapterType
            id={messageTypeId}
            category={categoryName}
            handleGoBack={handleGoBack}
            setLoading={setLoading}
          />
        )}

        {tableFlag && !addFlag && !editFlag && (
          <div>
            <Grid
              container
              spacing={isMobile ? 3 : 5}
              style={{ width: widerWidth, margin: wider }}
            >
              <Grid
                item
                xs={12}
                sm={4}
                className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
              >
                <Autocomplete
                  size='small'
                  style={{ width: '100%' }}
                  onChange={handleAcademicYear}
                  id='year'
                  className='dropdownIcon'
                  value={filterData.year}
                  options={academicYear}
                  getOptionLabel={(option) => option?.session_year}
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
              <Grid
                item
                xs={12}
                sm={4}
                className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
              >
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleBranch}
                  id='branch'
                  className='dropdownIcon'
                  value={filterData?.branch || ''}
                  options={branchDropdown || []}
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
              <Grid
                item
                xs={12}
                sm={4}
                className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
              >
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleGrade}
                  id='grade'
                  className='dropdownIcon'
                  value={filterData?.grade || ''}
                  options={gradeDropdown || []}
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

              <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleSection}
                  id='Section'
                  className='dropdownIcon'
                  value={filterData?.section || ''}
                  options={sectionDropdown || []}
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
              <Grid
                item
                xs={12}
                sm={4}
                className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
              >
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleSubject}
                  id='subject'
                  className='dropdownIcon'
                  value={filterData?.subject || ''}
                  options={subjectDropdown || []}
                  getOptionLabel={(option) => option?.subject_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Subject'
                      placeholder='Subject'
                    />
                  )}
                />
              </Grid>
              <Grid
                container
                spacing={isMobile ? 3 : 5}
                style={{ width: widerWidth, margin: wider }}
              >
                <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                  <Button
                    variant='contained'
                    className='labelColor buttonModifiedDesign'
                    size='medium'
                    onClick={handleClear}
                  >
                    CLEAR ALL
                  </Button>
                </Grid>
                <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                  <Button
                    variant='contained'
                    style={{ color: 'white' }}
                    color='primary'
                    className='buttonModifiedDesign'
                    size='medium'
                    onClick={handleFilter}
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
                <Grid
                  item
                  xs={8}
                  sm={3}
                  className={isMobile ? 'createButton' : 'createButton addButtonPadding'}
                >
                  <Button
                    startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                    variant='contained'
                    color='primary'
                    size='medium'
                    className='buttonModifiedDesign'
                    style={{ color: 'white' }}
                    title='Add Chapter'
                    onClick={handleAddChapterType}
                  >
                    Add Chapter
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}

        {!isMobile && tableFlag && !addFlag && !editFlag && (
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
                  {messageType.map((msgtype, index) => {
                    return (
                      <TableRow hover messagetype='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell}>
                          {msgtype.chapter_name}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <IconButton
                            onClick={(e) => {
                              handleDelete(msgtype);
                            }}
                            title='Delete Chapter'
                          >
                            <DeleteOutlinedIcon />
                          </IconButton>

                          <IconButton
                            onClick={(e) =>
                              handleEditMessageType(msgtype.id, msgtype.chapter_name)
                            }
                            title='Edit Chapter'
                          >
                            <EditOutlinedIcon />
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
        {isMobile && !addFlag && !editFlag && (
          <>
            {messageType.map((msgtype) => (
              <ChapterTypeCard
                msgtype={msgtype}
                handleDelete={handleDelete}
                handleEditMessageType={handleEditMessageType}
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
              />
            </div>
          </>
        )}
        <Dialog
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby='draggable-dialog-title'
        >
          <DialogTitle
            style={{ cursor: 'move', color: '#014b7e' }}
            id='draggable-dialog-title'
          >
            Delete Chapter
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{`Confirm Delete Chapter ${categoryName}`}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color='primary'
              onClick={handleDeleteMessageType}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
};

export default ChapterTypeTable;
