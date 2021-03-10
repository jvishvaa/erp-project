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
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
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
import EditSubjectMapping from './edit-subject-mapping';
import Loading from '../../../components/loader/loader';
import '../master-management.css';
import SubjectMappingCard from './subject-mapping-card';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '0 auto',
    boxShadow: 'none',
  },
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
  const [editFlag, setEditFlag] = useState(false);
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

  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleAddSubjectMapping = () => {
    setTableFlag(false);
    setAddFlag(true);
    setEditFlag(false);
  };

  const handleEditSubjectMapping = (id, name, desc, optional) => {
    setTableFlag(false);
    setAddFlag(false);
    setEditFlag(true);
    setSubjectId(id);
    setSubjectName(name);
    setDesc(desc);
    setOpt(optional);
  };

  const handleGoBack = () => {
    setPage(1);
    setTableFlag(true);
    setAddFlag(false);
    setEditFlag(false);
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

  const handleOpenDeleteModal = (id,name) => {
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
          setTotalCount(result.data?.data?.count)
          setSubjects(result.data?.data?.results);
        } else {
          setAlert('error', result.data?.msg || result.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.response?.data?.message || error.response?.data?.msg);
      });
  }, [goBackFlag, delFlag, page, searchSubject]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Master Management'
              childComponentName='Subject Mapping List'
              childComponentNameNext={
                addFlag && !tableFlag
                  ? 'Add Subject Mapping'
                  : editFlag && !tableFlag
                  ? 'Edit Mapping Subject'
                  : null
              }
            />
          </div>
        </div>

        {!tableFlag && addFlag && !editFlag && (
          <CreateSubjectMapping setLoading={setLoading} handleGoBack={handleGoBack} />
        )}
        {!tableFlag && !addFlag && editFlag && (
          <EditSubjectMapping
            id={subjectId}
            desc={desc}
            name={subjectName}
            setLoading={setLoading}
            handleGoBack={handleGoBack}
            opt={opt}
          />
        )}

        {tableFlag && !addFlag && !editFlag && (
          <>
            <Grid
              container
              spacing={isMobile ? 3 : 5}
              style={{ width: widerWidth, margin: wider }}
            >
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                  style={{ width: '100%' }}
                  id='subname'
                  label='Subject Name'
                  variant='outlined'
                  size='small'
                  name='subname'
                  autoComplete='off'
                  onChange={(e) => {
                    setPage(1);
                    setSearchSubject(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs sm={9} className={isMobile ? 'hideGridItem' : ''} />
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                  startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                  variant='contained'
                  color='primary'
                  size='small'
                  style={{ color: 'white' }}
                  title='Add Subject Mapping'
                  onClick={handleAddSubjectMapping}
                >
                  Add Subject Mapping
                </Button>
              </Grid>
            </Grid>
          </>
        )}

        <>
          {/* {!isMobile ? ( */}
            <>
              {tableFlag && !addFlag && !editFlag && (
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
                            subject: { subject_name, subject_description, is_optional },
                            section_mapping: {
                              grade: { grade_name },
                              section: {section_name},
                              acad_session: {
                                branch: { branch_name },
                                session_year: { session_year },
                              },
                            },
                          } = subject;
                          return (
                            <TableRow hover subject='checkbox' tabIndex={-1} key={index}>
                              <TableCell className={classes.tableCell}>
                                {session_year}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {branch_name}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {grade_name}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {section_name}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {subject_name}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {created_by}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {subject_description}
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
                                  <DeleteOutlinedIcon style={{ color: '#fe6b6b' }} />
                                </IconButton>

                                {/* <IconButton
                                  onClick={e => handleEditSubjectMapping(subject.subject.id, subject.subject.subject_name, subject.subject.subject_description, subject.subject.is_optional)}
                                  title='Edit Subject'
                                >
                                  <EditOutlinedIcon style={{ color: '#fe6b6b' }} />
                                </IconButton> */}
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
          <DialogTitle
            style={{ cursor: 'move', color: '#014b7e' }}
            id='draggable-dialog-title'
          >
            Delete Subject
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Confirm Delete Subject Mapping`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button color='primary' onClick={handleDeleteSubject}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
};

export default SubjectMappingTable;
