/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import { Grid, TextField, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';
import TablePagination from '@material-ui/core/TablePagination';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import CreateGrade from './create-grade';
import EditGrade from './edit-grade';
import '../master-management.css';
import Loading from '../../../components/loader/loader';
import GradeCard from './grade-card';
import axios from 'axios';
import { Modal } from 'antd';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  container: {
    maxHeight: '70vh',
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

const columns = [
  { id: 'grade_name', label: 'School Grade', minWidth: 100 },
  { id: 'grade_by', label: 'Eduvate Grade Name', minWidth: 100 },
  { id: 'created_by', label: 'Created by', minWidth: 100 },
  // {
  //   id: 'actions',
  //   label: 'Actions',
  //   minWidth: 170,
  //   align: 'right',
  //   labelAlign: 'center',
  // },
];

const GradeTable = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = React.useState(1);
  const [grades, setGrades] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [gradeId, setGradeId] = useState();
  const [gradeName, setGradeName] = useState('');
  const [gradeType, setGradeType] = useState('');
  const [addFlag, setAddFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [delFlag, setDelFlag] = useState(false);
  const [searchGrade, setSearchGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 15;
  const [goBackFlag, setGoBackFlag] = useState(false);
  const [centralGrades, setCentralGrades] = useState()

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  // const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleAddGrade = () => {
    setTableFlag(false);
    setAddFlag(true);
    setEditFlag(false);
  };

  const handleEditGrade = (id, name, type) => {
    // setTableFlag(false);
    // setAddFlag(false);
    setEditFlag(true);
    setGradeId(id);
    setGradeName(name);
    setGradeType(type);
    setOpen(true)
  };

  const handleGoBack = () => {
    setPage(1);
    setTableFlag(true);
    setAddFlag(false);
    setEditFlag(false);
    setSearchGrade('');
    setGoBackFlag(!goBackFlag);
  };

  const handleDeleteGrade = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.updateGrade}${gradeId}`)
      .then((result) => {
        if (result.data.status_code > 199 && result.data.status_code < 300) {
          setDelFlag(!delFlag);
          setLoading(false);
          setAlert('success', `Grade ${result.data.message || result.data.msg}`);
        } else {
          setLoading(false);
          setAlert('error', result.data.message || result.data.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.response.data.message || error.response.data.msg);
      });
    setOpenDeleteModal(false);
  };

  const handleOpenDeleteModal = (id) => {
    setGradeId(id);
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
    let url = `${endpoints.masterManagement.grades}?page=${page}&page_size=${limit}`;
    if (searchGrade) url += `&grade_name=${searchGrade}`;

    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          setTotalCount(result.data.result.count);
          setGrades(result.data.result.results);
        } else {
          setAlert('error', result?.data?.msg || result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.response?.data.message || error?.response?.data.msg);
      });
    getCentralGrades()
  }, [delFlag, goBackFlag, page, searchGrade]);

  const getCentralGrades = () => {
    axiosInstance
      .get(`${endpoints.masterManagement.centralGrades}`)
      .then((result) => {
        console.log(result);
        setCentralGrades(result?.data?.result)
      })
      .catch((error) => {
        setAlert('error', error?.response?.data.message || error?.response?.data.msg);
      });
  }

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Grade List'
          childComponentNameNext={
            addFlag && !tableFlag
              ? 'Add Grade'
              : editFlag && !tableFlag
                ? 'Edit Grade'
                : null
          }
        />
        {!tableFlag && addFlag && !editFlag && (
          <CreateGrade setLoading={setLoading} handleGoBack={handleGoBack} centralGrades={centralGrades} />
        )}
        {/* {!tableFlag && !addFlag && editFlag && (
          <EditGrade
            id={gradeId}
            name={gradeName}
            type={gradeType}
            handleGoBack={handleGoBack}
            setLoading={setLoading}
            loading={loading}
            open={open}
            showModal={showModal}
            handleCancel={handleCancel}
            handleOk={handleOk}
          />
        )} */}

        {tableFlag && !addFlag && (
          <Grid
            container
            spacing={isMobile ? 3 : 5}
            style={{ width: widerWidth, margin: wider }}
          >
            <Grid item xs={12} sm={3}>
              <TextField
                id='gradename'
                style={{ width: '100%' }}
                label='Grade Name'
                variant='outlined'
                size='small'
                name='gradename'
                autoComplete='off'
                onChange={(e) => {
                  setPage(1);
                  setSearchGrade(e.target.value);
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
                title='Add Grade'
                onClick={handleAddGrade}
              >
                Add Grade
              </Button>
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
                  {grades.map((grade, index) => {
                    return (
                      <TableRow hover grade='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell} style={{display: 'flex' , justifyContent: 'center'}} >
                          <div style={{display: 'flex' , justifyContent: 'space-between' , width: '20%'}} >
                          <span style={{display: 'flex' , alignItems: 'center' , minWidth: '100px'}}>{grade?.grade_name}</span>
                            <IconButton
                              onClick={(e) =>
                                handleEditGrade(
                                  grade.id,
                                  grade.grade_name,
                                  grade.grade_type
                                )
                              }
                              title='Edit Grade'
                              style={{marginLeft: '10%'}}
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {grade?.grade_type}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {grade?.created_by || ''}
                        </TableCell>
                        {/* <TableCell className={classes.tableCell}>
                          <IconButton
                            onClick={(e) => {
                              setGradeName(grade.grade_name);
                              handleOpenDeleteModal(grade.id);
                            }}
                            title='Delete Grade'

                          >
                            <DeleteOutlinedIcon />
                          </IconButton>

                          <IconButton
                            onClick={(e) =>
                              handleEditGrade(
                                grade.id,
                                grade.grade_name,
                                grade.grade_type
                              )
                            }
                            title='Edit Grade'
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                        </TableCell> */}
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
        {/* {isMobile && !addFlag && !editFlag && (
          <>
            <Container className={classes.cardsContainer}>
              {grades.map((grade, i) => (
                <GradeCard
                  grade={grade}
                  onEdit={(grade) => {
                    handleEditGrade(grade.id, grade.grade_name, grade.grade_type);
                  }}
                  onDelete={(grade) => {
                    setGradeName(grade.grade_name);
                    handleOpenDeleteModal(grade.id);
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
          <DialogTitle id='draggable-dialog-title'>Delete Grade</DialogTitle>
          <DialogContent>
            <DialogContentText>{`Confirm Delete Grade ${gradeName}`}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleDeleteGrade}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
      {gradeName && gradeId && (
        <EditGrade
          id={gradeId}
          name={gradeName}
          type={gradeType}
          handleGoBack={handleGoBack}
          setLoading={setLoading}
          loading={loading}
          open={open}
          showModal={showModal}
          handleCancel={handleCancel}
          handleOk={handleOk}
          setOpen={setOpen}
        />
      )}
    </>
  );
};

export default GradeTable;
