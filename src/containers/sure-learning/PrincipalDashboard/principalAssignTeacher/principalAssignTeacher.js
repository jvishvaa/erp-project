/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import {
  Grid, TablePagination, IconButton, Typography, Divider, Button, FormControl,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './principalAssignTeacher.style';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import useFetch from '../../hoc/useFetch';
import axios from 'axios';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


function PrincipalLeadTeacher({ classes }) {
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  const [selectedLeadTeacher, setSelectedLeadTeacher] = useState('');
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(null);
  const [page, setPage] = useState(0);
  const { setAlert } = useContext(AlertNotificationContext);
  const [permission, setPermission] = useState([]);
  const [loader, setLoader] = useState(false);
  const [assignTraineeModuleId, setAssignTraineeModuleId] = useState(null);

  const {
    data: leadTeachersList,
    isLoading: gettingLeadteacherList,
    doFetch: fetchLeadLeachersList,
  } = useFetch([]);
  const {
    data: allTeachersList,
    isLoading: gettingAllTeachersList,
    doFetch: fetchAllTecchersList,
  } = useFetch([]);

  const {
    data: assignedTeacherres,
    isLoading: submittingData,
    doFetch: fetchSubmitAssignData,
  } = useFetch([]);

  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Assign_Teacher' && item.module_type === 'Self_Driven') {
        setAssignTraineeModuleId(item.module);
        getPermissonData(item.module);
      }
    })
  }, [])

  useEffect(() => {
    if (assignedTeacherres) {
      setAlert("success", 'Teachers Assignd successfully');
      setSelected([]);
      setSelectedLeadTeacher('');
    }
  }, [assignedTeacherres]);

  useEffect(() => {
    if (assignTraineeModuleId) {
      fetchAllTecchersList({
        url: `${endpoints.sureLearning.asssignTeachesLeadApi}?page_size=${rowsPerPage || 12}&page=${page + 1}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: assignTraineeModuleId
        },
      });
    }

  }, [assignTraineeModuleId, page, rowsPerPage, assignedTeacherres, auth]);

  useEffect(() => {
    if (auth && assignTraineeModuleId) {
      fetchLeadLeachersList({
        url: `${endpoints.sureLearning.leadTeachersListApi}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
          module: assignTraineeModuleId
        },
      });
    }

  }, [auth, assignTraineeModuleId]);

  function handleChangePage(event, newPage) {
    setPage(newPage);
    if (!rowsPerPage) {
      setRowsPerPage(5);
    }
  }

  function lastPageChange(lastPage) {
    setPage(lastPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setPage(0);
  }

  function firstPageChange() {
    setPage(0);
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  function handelSelectAll() {
    if (selected.length === (allTeachersList && allTeachersList.results && allTeachersList.results.length)) {
      setSelected([]);
    } else {
      const array = [];
      const n = allTeachersList && allTeachersList.results.length;
      for (let i = 0; i < n; i += 1) {
        array.push(allTeachersList.results[i].user.id);
      }
      setSelected(array);
    }
  }

  // let loader = null;
  // if (gettingLeadteacherList || gettingAllTeachersList || submittingData) {
  //   loader = <Loader open />;
  // }

  function submitTeacher() {
    if (!selectedLeadTeacher) {
      setAlert("warning", 'select lead teacher');
      return;
    }
    if (selected.length === 0) {
      setAlert("warning", 'select teacher');
      return;
    }
    const data = {
      assigned_by: selectedLeadTeacher,
      assigned_to: selected,
    };
    fetchSubmitAssignData({
      url: `${endpoints.sureLearning.asssignTeachesLeadApi}`,
      method: 'PUT',
      body: data,
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
        module: assignTraineeModuleId
      },
    });
  }

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
  //   getPermissonData(localStorage.getItem('Self_Driven_Training'))
  // }, [])

  return (
    <Layout>
      <div style={{ overflow: 'hidden' }}>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <CommonBreadcrumbs
              componentName='Sure Learning'
              childComponentName=' Assign Teacher'
              isAcademicYearVisible={true}
            />
            {(loader || gettingLeadteacherList || gettingAllTeachersList || submittingData) === true && (
              <Backdrop className={classes.backdrop} open>
                <CircularProgress />
              </Backdrop>
            )}
          </Grid>
        </Grid>
        {/* <Divider className={classes.divider} /> */}
        <Grid item md={12} xs={12}>
          <div style={{ margin: ' 5px 40px 5px 40px' }}>
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <Typography>
                    Select Lead Teacher
                    <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl className={classes.formControl} fullWidth>
                    {/* <InputLabel id="demo-mutiple-name-label">
                  Select Lead Teacher
                </InputLabel> */}
                    <Select
                      fullWidth
                      id="demo-mutiple-name-label"
                      value={selectedLeadTeacher || ''}
                      onChange={(e) => setSelectedLeadTeacher(e.target.value)}
                      MenuProps={MenuProps}
                      variant="outlined"
                      margin="dense"

                    >
                      {leadTeachersList
                        && leadTeachersList.length !== 0
                        && leadTeachersList.map((data) => (
                          <MenuItem
                            value={data.id}
                            key={data.id}
                            name={data.first_name}
                          >
                            {data.id ? data.first_name : ''}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </div>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            {allTeachersList && allTeachersList.results && allTeachersList.results.length === 0
              && <Typography variant="h6" style={{ color: 'blue', marginTop: '20px', textAlign: 'center' }}>Teachers Not Found</Typography>}
            {allTeachersList && allTeachersList.results && allTeachersList.results.length !== 0
              && (
                <Paper className={classes.paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Email</TableCell>
                        <TableCell align="center">Designation</TableCell>
                        <TableCell align="center">Mobile No.</TableCell>
                        <TableCell align="center">ERP No.</TableCell>
                        <TableCell align="center">Allotted Hours</TableCell>
                        <TableCell align="center">Pending Hours</TableCell>
                        <TableCell align="center">Assigned Teacher</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        hover
                        onClick={() => handelSelectAll()}
                        role="checkbox"
                        tabIndex={-1}
                        key="100000"
                        selected={selected.length === (allTeachersList && allTeachersList.results && allTeachersList.results.length)}
                      >
                        <TableCell align="center">
                          <Checkbox
                            checked={selected.length === (allTeachersList && allTeachersList.results && allTeachersList.results.length)}
                            onClick={() => handelSelectAll()}
                          />
                        </TableCell>
                        <TableCell align="center">Select All</TableCell>
                      </TableRow>
                      {allTeachersList
                        && allTeachersList.results
                        && allTeachersList.results.map((item) => {
                          const isItemSelectedId = isSelected(item.user.id);
                          return (
                            <TableRow
                              hover
                              onClick={(event) => handleClick(event, item.user.id)}
                              role="checkbox"
                              tabIndex={-1}
                              key={item.user.id}
                              selected={isItemSelectedId}
                            >
                              <TableCell align="center">
                                {console.log(allTeachersList)}
                                <Checkbox
                                  checked={isItemSelectedId}
                                  id={item.user.first_name + item.user.id}
                                  key={item.user.first_name + item.user.id}
                                />
                              </TableCell>
                              <TableCell align="center">{item.user.first_name}</TableCell>
                              <TableCell align="center">{item.user.email}</TableCell>
                              <TableCell align="center">{item.roles_category.name}</TableCell>
                              <TableCell align="center">{item.phone_number}</TableCell>
                              <TableCell align="center">{item.erp || null}</TableCell>
                              <TableCell align="center">{item.duration.total_duration}</TableCell>
                              <TableCell align="center">{item.duration.pending_duration}</TableCell>
                              <TableCell align="center">{(item.lead_teacher && item.lead_teacher.first_name) || 'Not Assigned'}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </Paper>
              )}
          </Grid>
          <Grid item md={12} xs={12}>
            {allTeachersList
              && allTeachersList.results
              && allTeachersList.results.length !== 0 && (
                <Paper style={{ backgroundColor: 'white', marginTop: '10px' }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TablePagination
                          colSpan={6}
                          labelDisplayedRows={() => `Page ${page + 1} of ${+allTeachersList.total_pages}`}
                          rowsPerPageOptions={[5, 20, 30]}
                          count={+allTeachersList.count}
                          rowsPerPage={rowsPerPage || 5}
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
                            onClick={() => lastPageChange(allTeachersList.total_pages - 1)}
                            disabled={page === +allTeachersList.total_pages - 1}
                          >
                            <LastPageIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              )}
          </Grid>
          {permission.can_update ?
            <>
              <Grid item md={6} xs={12} style={{ textAlign: 'right', marginTop: '30px' }}>
                {allTeachersList && allTeachersList.results && (
                  <Button variant="contained" color="primary" onClick={() => submitTeacher()}>
                    Assign Lead Teacher\ns
                  </Button>
                )}
              </Grid>
            </>
            : null}
        </Grid>
      </div>
      {loader}
    </Layout>
  );
}

PrincipalLeadTeacher.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};
export default withStyles(styles)(PrincipalLeadTeacher);
