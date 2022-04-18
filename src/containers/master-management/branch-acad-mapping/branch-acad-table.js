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
import CreateBranchAcad from './create-branch-acad';
import Loading from '../../../components/loader/loader';
import '../master-management.css';
import BranchAcadCard from './branch-acad-card';

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
}));

const columns = [
  {
    id: 'session_year',
    label: 'Session Year',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'branch_name',
    label: 'Branch',
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
    id: 'branch_code',
    label: 'Branch Code',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'address',
    label: 'Address',
    minWidth: 100,
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

const BranchAcadTable = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = useState(1);
  const [branches, setBranches] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [branchId, setBranchId] = useState();
  const [branchName, setBranchName] = useState('');
  const [addFlag, setAddFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [desc, setDesc] = useState('');
  const [delFlag, setDelFlag] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const session_year = JSON.parse(sessionStorage.getItem('acad_session'))
  const [searchYear, setSearchYear] = useState(session_year?.id);
  const [yearDisplay, setYearDisplay] = useState(session_year);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [searchBranch, setSearchBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const limit = 15;
  const [goBackFlag, setGoBackFlag] = useState(false);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

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
            if (item.child_name === 'Branch Acad Mapping') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleAcademicYear = (event, value) => {
    setSearchYear('');
    setYearDisplay(value);
    if (value) {
      setPage(1);
      setSearchYear(value.id);
    }
  };

  const handleAddBranchMapping = () => {
    setTableFlag(false);
    setAddFlag(true);
  };

  const handleGoBack = () => {
    setPage(1);
    setTableFlag(true);
    setAddFlag(false);
    setBranchName('');
    // setSearchYear('');
    setSearchBranch('');
    setGoBackFlag(!goBackFlag);
  };

  const handleDeleteBranch = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.deleteBranch}${branchId}`)
      .then((result) => {
        if (result.data.status_code === 204) {
          setDelFlag(!delFlag);
          setBranchName('');
          setBranchId('');
          setLoading(false);
          setAlert('success', result.data.msg || result.data.message);
        } else {
          setLoading(false);
          setAlert('error', result.data.msg || result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.response.data.message || error.response.data.msg);
      });
    setOpenDeleteModal(false);
  };

  const handleOpenDeleteModal = (branch) => {
    setBranchName(branch?.branch?.branch_name);
    setBranchId(branch?.id);
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
    if (moduleId) {
      axiosInstance
        .get(`${endpoints.masterManagement.academicYear}?module_id=${moduleId}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setAcademicYearList(result.data?.result?.results);
          } else {
            setAlert('error', result.data.message || result.data.msg);
          }
        })
        .catch((error) => {
          setAlert('error', error.response.data.message || error.response.data.msg);
        });
    }
  }, [moduleId]);

  useEffect(() => {
    if (moduleId) {
      setLoading(true)
      let url = `${endpoints.masterManagement.branchMappingTable}?page=${page}&page_size=${limit}&module_id=${moduleId}&session_year=${searchYear}`;
      if (searchBranch) url += `&branch_name=${searchBranch}`;
      if (searchYear) {
      axiosInstance
        .get(url)
        .then((result) => {
          setLoading(false)
          if (result.data.status_code === 200) {
            setTotalCount(result.data.data?.count);
            setBranches(result.data.data?.results);
          } else {
            setAlert('error', result.data.message || result.data.msg);
          }
        })
        .catch((error) => {
          setLoading(false)
          setAlert('error', error.response.data.message || error.response.data.msg);
        });
      }else{
        setLoading(false)
      }
    }
  }, [moduleId, goBackFlag, delFlag, searchYear, searchBranch, page]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Branch Acad Mapping List'
          childComponentNameNext={
            addFlag && !tableFlag ? 'Add Mapping' : !tableFlag ? 'Edit Mapping' : null
          }
        />

        {!tableFlag && addFlag && (
          <CreateBranchAcad
            moduleId={moduleId}
            academicYearList={academicYearList}
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
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                  style={{ width: '100%' }}
                  id='branchname'
                  label='Branch Name'
                  variant='outlined'
                  size='small'
                  name='branchname'
                  autoComplete='off'
                  onChange={(e) => {
                    setPage(1);
                    setSearchBranch(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <Autocomplete
                  size='small'
                  onChange={handleAcademicYear}
                  style={{ width: '100%' }}
                  id='session-year'
                  options={academicYearList}
                  value={yearDisplay}
                  getOptionLabel={(option) => option?.session_year}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Session Year'
                      placeholder='Session Year'
                    />
                  )}
                />
              </Grid>
              <Grid item xs sm={6} className={isMobile ? 'hideGridItem' : ''} />
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                  startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                  variant='contained'
                  color='primary'
                  size='medium'
                  style={{ color: 'white' }}
                  title='Add Branch Mapping'
                  onClick={handleAddBranchMapping}
                >
                  Add Branch Mapping
                </Button>
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
                      {branches.map((branch, index) => {
                        return (
                          <TableRow hover subject='checkbox' tabIndex={-1} key={index}>
                            <TableCell className={classes.tableCell}>
                              {branch?.session_year?.session_year}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {branch?.branch?.branch_name}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {branch?.branch?.created_by}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {branch?.branch?.branch_code}
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={{ maxWidth: '250px' }}
                            >
                              {branch?.branch?.address}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              <IconButton
                                onClick={(e) => {
                                  handleOpenDeleteModal(branch);
                                }}
                                title='Delete Branch'
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
                      {branches.map((branch) => (
                        <BranchAcadCard
                          data={branch}
                          handleOpenDeleteModal={handleOpenDeleteModal}
                          handleEditBranchMapping={handleEditBranchMapping}
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
          <DialogTitle id='draggable-dialog-title'>Delete Branch</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Confirm Delete Branch Acad Mapping ${branchName}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color='primary'
              onClick={handleDeleteBranch}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
};

export default BranchAcadTable;
