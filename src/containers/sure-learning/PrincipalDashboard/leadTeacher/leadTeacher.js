/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import {
  Paper,
  Grid,
  Typography,
  withStyles,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableCell,
  IconButton,
  TableRow,
  TablePagination,
  Button,
  Tab,
  Tabs,
  Select,
  MenuItem,
  AppBar,
  Box,
  TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import styles from './leadTeacher.style';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import useFetch from '../../hoc/useFetch';
import axios from 'axios';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Autocomplete } from '@material-ui/lab';

const LeadTeacher = ({ classes }) => {
  const [searchERP, setSearchERP] = useState();
  const [userList, setUserList] = useState();
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  const [rowsPerPage, setRowsPerPage] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [permission, setPermission] = useState([]);
  const [loader, setLoader] = useState(false);
  const [assignTraineeModuleId, setAssignTraineeModuleId] = useState(null);


  const {
    data: roleList,
    isLoading: gettingRoleList,
    doFetch: fetchRoleList,
  } = useFetch(null);

  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Assign_Lead_Teacher' && item.module_type === 'Self_Driven') {
        setAssignTraineeModuleId(item.module);
        getPermissonData(item.module);
      }
    })
  }, [])

  useEffect(() => {
    if (assignTraineeModuleId) {
      setLoading(true);
      const link = searchERP ? `${endpoints.sureLearning.leadTeachersAPI}?search=${searchERP}&page_size=${rowsPerPage || 10}&page=${page + 1}` : `${endpoints.sureLearning.leadTeachersAPI}?page_size=${rowsPerPage || 10}&page=${page + 1}`;
      fetch(`${link}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: assignTraineeModuleId
        },
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            // setAlert('success','Successfully Fetched');
            return res.json();
          }
          // if (res.status !== 200) {
          //   setAlert('warning','something went wrong please try again ');
          // }
          return 0;
        })
        .then((data) => {
          setUserList(data);
        });
    }

  }, [page, rowsPerPage, assignTraineeModuleId]);

  useEffect(() => {
    if (auth && assignTraineeModuleId) {
      fetchRoleList({
        url: `${endpoints.sureLearning.leadTeacherRoleAPI}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assignTraineeModuleId
        },
      });
      fetch(`${endpoints.sureLearning.leadTeachersAPI}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: assignTraineeModuleId
        },
      })
        .then((res) => {
          if (res.status === 200) {
            // setAlert('success','Successfully Fetched');
            return res.json();
          }
          // if (res.status !== 200) {
          //   setAlert('warning','something went wrong please try again ');
          // }
          return 0;
        })
        .then((data) => {
          setUserList(data);
        });
    }
  }, [auth, assignTraineeModuleId]);

  // For Permissions
  function getPermissonData(id) {
    axios.get(endpoints.sureLearning.getPermissons, {
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
        module: id
      },
    }).then(response => {
      setPermission(response.data.response)
    }).catch(error => {
      console.log(error);
    })
  }

  // useEffect(() => {
  //   getPermissonData()
  // }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (!rowsPerPage) {
      setRowsPerPage(10);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const firstPageChange = () => {
    setPage(0);
  };

  const lastPageChange = (lastPage) => {
    setPage(lastPage);
  };

  // let loader = null;
  // if (gettingRoleList || loading) {
  //   loader = <Loader open />;
  // }

  const search = (searchString) => {
    setSearchERP(searchString);
    console.log(searchString);
    setLoading(true);
    fetch(`${endpoints.sureLearning.leadTeachersAPI}?search=${searchString || ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
        module: assignTraineeModuleId
      },
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          // setAlert('success','Successfully Fetched');
          return res.json();
        }
        // if (res.status !== 200) {
        //   setAlert('warning','somthing went wrong please try again ');
        // }
        return 0;
      })
      .then((data) => {
        setUserList(data);
      });
  };
  const updateRole = (user, chosenRoleId) => {
    if (assignTraineeModuleId) {
      setLoading(true);
      fetch(`${endpoints.sureLearning.updatePositionMapping}${user.id}/retrieve_assign_lead_teachers/`, {
        method: 'PUT',
        body: JSON.stringify({ role: chosenRoleId?.id }),
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: assignTraineeModuleId
        },
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            setAlert('success', `Successfully Updated Role for user : ${user.user.username}`);
            const link = searchERP ? `${endpoints.sureLearning.leadTeachersAPI}?search=${searchERP}&page_size=${rowsPerPage || 10}&page=${page + 1}` : `${endpoints.sureLearning.leadTeachersAPI}?page_size=${rowsPerPage || 10}&page=${page + 1}`;
            fetch(`${link}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${auth.personal_info.token}`,
                'Content-Type': 'application/json',
                module: assignTraineeModuleId
              },
            })
              .then((output) => {
                setLoading(false);
                if (output.status === 200) {
                  // setAlert('success','Successfully Fetched');
                  return output.json();
                }
                // if (res.status !== 200) {
                //   setAlert('warning','something went wrong please try again ');
                // }
                return 0;
              })
              .then((data) => {
                setUserList(data);
              });
            return res.json();
          }
          // if (res.status !== 200) {
          //   setAlert('warning','somthing went wrong please try again ');
          // }
          return 0;
        })
        .then((data) => {
          console.log(data);
          // setUserList(data);
        });
    }

  };
  return (
    <Layout>

      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          <CommonBreadcrumbs
            componentName='Sure Learning'
            childComponentName='Assign Lead Teacher'
            isAcademicYearVisible={true}
          />
          {(loader || gettingRoleList) === true && (
            <Backdrop className={classes.backdrop} open>
              <CircularProgress />
            </Backdrop>
          )}
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid item md={12} xs={12}>
        <Paper className={classes.paper}>
          <Grid container spacing={3} className={classes.root}>
            <Grid item md={4} xs={12}>
              <TextField
                label="Type ERP No. or Name"
                margin="dense"
                fullWidth
                required
                onChange={(e) => e.target.value.length >= 4
                  && e.target.value.length <= 12
                  && search(e.target.value)}
                variant="outlined"
              />
            </Grid>
            {/* <Grid item md={4} xs={12}>
              <Button
                style={{ marginTop: '10px' }}
                variant="contained"
                color="primary"
                onClick={runModule5}
              >
                Go
              </Button>
            </Grid> */}
          </Grid>
        </Paper>
      </Grid>
      <Divider className={classes.divider} />
      {userList && userList.results.length === 0
        && <Typography variant="h4" style={{ color: 'blue', textAlign: 'center' }}>No Data Found</Typography>}
      {userList && userList.results.length !== 0
        && (
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell float="left">
                        <Typography>Name</Typography>
                      </TableCell>
                      <TableCell float="left">
                        <Typography>Email</Typography>
                      </TableCell>
                      <TableCell float="left">
                        <Typography>ERP</Typography>
                      </TableCell>
                      <TableCell float="left">
                        <Typography>Role</Typography>
                      </TableCell>
                      <TableCell float="left">
                        <Typography>Course Type</Typography>
                      </TableCell>
                      <TableCell float="left">
                        <Typography>Course Subtype</Typography>
                      </TableCell>
                      <TableCell float="left">
                        <Typography>Experience (Years)</Typography>
                      </TableCell>
                      <TableCell float="left">
                        <Typography>Gender</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userList && userList.results.length !== 0
                      && userList.results.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell float="left">
                            <Typography>{(item.user && item.user.first_name) || ''}</Typography>
                          </TableCell>
                          <TableCell float="left">
                            <Typography>{(item.user && item.user.email) || ''}</Typography>
                          </TableCell>
                          <TableCell float="left">
                            <Typography>{(item.user && item.user.username) || ''}</Typography>
                          </TableCell>
                          <TableCell float="left">
                            {permission.can_update ?
                              // <Select
                              //   margin="dense"
                              //   fullWidth
                              //   value={item.role_category.id || ''}
                              //   onChange={(e) => updateRole(item, e.target.value)}
                              //   className={classes.textField}
                              //   variant="outlined"
                              //   style={{ color: 'black' }}
                              // >
                              //   {roleList && roleList.length !== 0 && roleList.map((data) => (
                              //     <MenuItem
                              //       value={data.id}
                              //       key={data.id}
                              //       name={data.branch_name}
                              //     >
                              //       {data.id ? data.name : ''}
                              //     </MenuItem>
                              //   ))}
                              // </Select>
                              <Autocomplete
                              size='small'
                              id='create__class-subject'
                              className='dropdownIcon'
                              options={roleList || []}
                              value={item.role_category || ''}
                              getOptionLabel={(option) => option.name}
                              filterSelectedOptions
                              onChange={(event,value) => updateRole(item, value)}
                              required
                              fullWidth
                              renderInput={(params) => (
                                <TextField
                                  size='small'
                                  className='create__class-textfield'
                                  {...params}
                                  variant='outlined'
                                  required
                                />
                              )}
                            />
                              : null}

                          </TableCell>
                          <TableCell float="left">
                            <Typography>{(item.course_type && item.course_type.type_name) || ''}</Typography>
                          </TableCell>
                          <TableCell float="left">
                            <Typography>{(item.course_sub_type && item.course_sub_type.sub_type_name) || ''}</Typography>
                          </TableCell>
                          <TableCell float="left">
                            <Typography>
                              {(item.total_experience && item.total_experience)}
                            </Typography>
                          </TableCell>
                          <TableCell float="left">
                            <Typography>{(item.gender && item.gender) || ''}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>
        )}
      {userList && userList.results.length !== 0 && (
        <Grid item md={12} xs={12}>
          <Paper
            style={{ backgroundColor: 'white', marginTop: '10px' }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    labelDisplayedRows={() => `Page ${page + 1} of ${+userList.total_pages}`}
                    rowsPerPageOptions={[10, 20, 30]}
                    count={+userList.count}
                    rowsPerPage={rowsPerPage || 10}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'Rows per page' },
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                  <TableCell style={{ marginTop: '13px' }}>
                    <IconButton
                      onClick={firstPageChange}
                      disabled={page === 0 || page === 1}
                    >
                      <FirstPageIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => lastPageChange(
                        userList.total_pages - 1,
                      )}
                      disabled={page === +userList.total_pages - 1}
                    >
                      <LastPageIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      )}
      {loader}
    </Layout>
  );
};
LeadTeacher.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};
export default withStyles(styles)(LeadTeacher);
