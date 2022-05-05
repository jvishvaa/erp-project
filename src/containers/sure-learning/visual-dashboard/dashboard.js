/* eslint-disable radix */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useContext } from 'react';
import {
  withStyles,
  Typography,
  Divider,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  // Modal,
  // Fade,
  // Backdrop,
  IconButton,
  // TextField,
  TableFooter,
  TablePagination,
  MenuItem,
  Select,
} from '@material-ui/core';
import PropTypes from 'prop-types';
// import FirstPageIcon from '@material-ui/icons/FirstPage';
// import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
// import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
// import LastPageIcon from '@material-ui/icons/LastPage';
import TinyTextEditor from '../hoc/tinyMce/tinyTextEditor';
import styles from './dashboard.style';
import useFetch from '../hoc/useFetch';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loader from '../hoc/loader';
import endpoints from 'config/endpoints';
import axios from 'axios';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';


let link1
let link2
let link3
let link4
let finalUrl

const BranchReport = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  // const [level, setLevel] = useState('');
  const [checkLoader] = useState(false);
  // const [levelUpdate, setLevelUpdate] = useState('');
  // const [levelId, setlevelId] = useState('');
  // const [open, setOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [roleId, setRoleId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [branch, setBranch] = useState('');
  const [bottomHRef, setButtonRef] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);
  const [tableStage, setTableStage] = useState(0);
  const [roleName, setRoleSelected] = useState('');
  const [access, setAccess] = useState([]);
  const [branchReportModuleId, setBranchReportModuleId] = useState(null);

  const [branchId, setBranchId] = useState('');

  // const verifyEmail = auth 
  // && auth.academic_profile 
  // && auth.academic_profile.user.email;

  // const verify=verifyEmail.includes("@orchids.edu.in")
  const loginData = JSON.parse(localStorage.getItem('udaanDetails'))
  var verify = loginData.role_permission.is_orchids;

  const { setAlert } = useContext(AlertNotificationContext);
  const {
    data: reportList,
    isLoading: reportListLoading,
    doFetch: fetchreport,
  } = useFetch([]);
  const {
    data: roleList,
    isLoading: roleListLoading,
    doFetch: fetchRoles,
  } = useFetch(null);

  const {
    data: courseList,
    isLoading: courseListLoading,
    doFetch: fetchcourseList,
  } = useFetch(null);
  const {
    data: branchList,
    isLoading: branchListLoading,
    doFetch: fetchBranches,
  } = useFetch(null);
  const {
    data: branchWiseList,
    isLoading: branchWiseListLoading,
    doFetch: fetchBranchWiseData,
  } = useFetch([]);

  const {
    data: detailedVisualReport,
    isLoading: detailedVisualReportLoading,
    doFetch: fetchDetailedVisualReport,
  } = useFetch([]);

  const {
    data: modulePermission,
    isLoading: modulePermissionLoading,
    doFetch: fetchModulePermission,
  } = useFetch(null)

  const getModuleId = () => {
    if (localStorage.getItem('Branch_Wise_Report') !== "null") {
      return localStorage.getItem('Branch_Wise_Report')
    } else if (localStorage.getItem('Branch_level_detailed_report') !== "null") {
      return localStorage.getItem('Branch_level_detailed_report')
    } else if (localStorage.getItem('Reports') !== "null") {
      return localStorage.getItem('Reports')
    }
  }

  const getAccess = (id) => {
    axios.get(endpoints.sureLearning.getPermissons, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: id
      },
    }).then(response => {
      setAccess(response.data.response);
    }).catch(error => {
      console.log(error);
    })
  }



  // console.log(reportList.total_pages);
  // const {
  //   data: UpdateLevelResponse,
  //   isLoading: updateLevelLoading,
  //   doFetch: fetchupdateLevel,
  // } = useFetch([]);

  const [trainingTypeList] = useState([
    {
      id: '1',
      name: 'Induction Training',
    },
    {
      id: '2',
      name: 'Self Driven',
    },
    {
      id: '3',
      name: 'Trainer Driven',
    },
    {
      id: '4',
      name: 'Subject Training',
    },
  ]);

  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Branch_Wise_Report' && item.module_type === 'Reports') {
        setBranchReportModuleId(item.module);
        getAccess(item.module);
      }
    })
  }, [])

  const [trainingType, setTrainingType] = useState('');
  let isRoleChosen = false;
  // let isTrainingTypeChosen = false;

  useEffect(() => {
    if (trainingType && roleId && branchReportModuleId) {
      fetchreport({
        url: `${endpoints.sureLearning.getVisualReportSearchAPI}?role=${roleId}&course_type=${trainingType}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: branchReportModuleId

        },
      });
    }
  }, [searchClicked, page, fetchreport, rowsPerPage, auth.personal_info.token, branchReportModuleId]);
  // useEffect(() => {
  //   // if (page || rowsPerPage) {
  //   if (trainingType && roleId) {
  //     if (startDate && endDate) {
  //       fetchreport({
  //         url: `${endpoints.sureLearning.userDashboardApi}?page=${page + 1}&page_size=${rowsPerPage || 10}&course_type=${trainingType}&course_id=${courseId}&start_date=${startDate}&end_date=${endDate}&branch=${branch}`,
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${auth.personal_info.token}`,
  //         },
  //       });
  //     } else if (startDate) {
  //       fetchreport({
  //         url: `${endpoints.sureLearning.userDashboardApi}?page=${page + 1}&page_size=${rowsPerPage || 10}&course_type=${trainingType}&course_id=${courseId}&start_date=${startDate}&branch=${branch}`,
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${auth.personal_info.token}`,
  //         },
  //       });
  //     } else if (endDate) {
  //       fetchreport({
  //         url: `${endpoints.sureLearning.userDashboardApi}?page=${page + 1}&page_size=${rowsPerPage || 10}&course_type=${trainingType}&course_id=${courseId}&end_date=${endDate}&branch=${branch}`,
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${auth.personal_info.token}`,
  //         },
  //       });
  //     } else {
  //       fetchreport({
  //         url: `${endpoints.sureLearning.userDashboardApi}?page=${page + 1}&page_size=${rowsPerPage || 10}&course_type=${trainingType}&course_id=${courseId}&branch=${branch}`,
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${auth.personal_info.token}`,
  //         },
  //       });
  //     }
  //   }
  // }, [searchClicked, page, fetchreport, rowsPerPage, auth.personal_info.token]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (!rowsPerPage) {
      setRowsPerPage(10);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  function firstPageChange() {
    setPage(0);
  }

  function lastPageChange(lastPage) {
    setPage(lastPage);
  }
  useEffect(() => {
    // fetchreport({
    //   url: `${endpoints.sureLearning.userDashboardApi}?course_id=${courseId}`,
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${auth.personal_info.token}`,
    //   },
    //   fetchreport,
    // });
    link1 = `${endpoints.sureLearning.getRoleRegistration}?search=orchids&user_type=USER`
    link2 = `${endpoints.sureLearning.getRoleRegistration}?search=other&user_type=USER`
    link3 = `${endpoints.sureLearning.getRoleRegistration}?search=orchids&user_type=ADMIN`
    link4 = `${endpoints.sureLearning.getRoleRegistration}?search=other&user_type=ADMIN`

    finalUrl = auth.role_permission.user_type === "USER" ? verify ? link1 : link2 :
      auth.role_permission.user_type === "ADMIN" ? verify ? link3 : link4 : null
    // const roleApi = (auth.personal_info.role === 'Principal' || auth.personal_info.role === 'Coordinator') ? endpoints.sureLearning.getRolesChangeUserStatusAPI : endpoints.sureLearning.courseRoleApi;
    fetchRoles({
      url: finalUrl,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: branchReportModuleId
      },
    });
    // fetchBranches({
    //   url: endpoints.sureLearning.consolidatedDashboardBranchApi,
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${auth.personal_info.token}`,
    //   },
    // });
  }, [fetchRoles, fetchreport, fetchBranches, auth.personal_info.token, branchReportModuleId]);

  let loader = null;
  if (detailedVisualReportLoading || branchWiseListLoading || reportListLoading || checkLoader || roleListLoading || courseListLoading || modulePermissionLoading) {
    loader = <Loader open />;
  }

  const getDashboards = () => {
    setTableStage(1);
    setSearchClicked(!searchClicked);
    setPage(0);
    if (!roleId) {
      setAlert('warning', 'Select a role');
      return;
    }
    if (!trainingType) {
      setAlert('warning', 'Select a training type');
    }
  };

  const roleChosen = () => {
    isRoleChosen = true;
    setCourseId('');
    setTrainingType('');
  };

  const clickHandleTable1 = (dataID) => {
    // console.log('data');
    // console.log(dataID);
    setBranchId(dataID);
    setTableStage(tableStage + 1);
    fetchBranchWiseData({
      url: `${endpoints.sureLearning.getBranchWiseVisualReport}?course_type=${trainingType}&role=${roleId}&branch=${dataID}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: branchReportModuleId
      },
    });
    // second table is shown, hide other 2 tables
  };

  const clickHandleTable2 = (data) => {
    // console.log('data');
    // console.log(data);
    setTableStage(tableStage + 1);

    fetchDetailedVisualReport({
      url: `${endpoints.sureLearning.getDetailedVisualReport}?user=${data.user}&role=${roleId}&course_type=${trainingType}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: branchReportModuleId

      },
    });
    // third table is shown, hide other 2 tables
    // api call based on id
  };

  // const clickHandleTest3 = () => {
  //   setHideWholeTable1ForTest(false);
  //   // api call based on id
  // };

  const backButtonHandler = () => {
    // console.log(tableStage);
    if (tableStage !== 0)
      setTableStage(tableStage - 1);
  };
  const sampleArray = [
    {
      branch: {
        id: 5,
        name: 'OIS Jalahalli',
      },
      total_teacher: 60,
      complete_all_modules: 50,
      not_completed_all_modules: 10,
    },
    {
      branch: {
        id: 6,
        name: 'OIS Yalhanka',
      },
      total_teacher: 40,
      complete_all_modules: 30,
      not_completed_all_modules: 10,
    },
    {
      branch: {
        id: 7,
        name: 'OIS Kurla',
      },
      total_teacher: 20,
      complete_all_modules: 19,
      not_completed_all_modules: 1,
    },
  ];

  const reportTableData = () => {
    let reportTable = null;
    if (reportList && reportList.result && reportList.result.length) {
      // console.log(reportList.results);
      reportTable = (
        <>
          <TableBody>
            {
              reportList.result.map((data, i) => (
                <TableRow key={data.branch}>
                  <TableCell align="left">{i + 1}</TableCell>
                  <TableCell align="left" style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={() => clickHandleTable1(data.branch)}>{data.branch__branch_name}</TableCell>
                  <TableCell align="left">{data.total_users}</TableCell>
                  <TableCell align="left">{data.all_modules_completed_users}</TableCell>
                  <TableCell align="left">{data.in_completed_module}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </>
      );
    } else {
      reportTable = (<Typography>No Records Found</Typography>);
    }
    return reportTable;
  };

  const reportTable = () => {
    let reportElements = null;
    reportElements = (
      <>
        <Paper className={classes.paper}>
          <Table
            className={classes.table}
            size="small"
            aria-label="spanning table"
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }} align="left">
                  S. No.
                </TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="left">
                  Branch Name
                </TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="left">
                  Total
                  {' '}
                  {roleName}
                  {' '}
                </TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="left">
                  Completed
                  {' '}
                </TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="left">
                  Incomplete
                  {' '}
                </TableCell>
              </TableRow>
            </TableHead>
            <>
            </>
            {reportTableData()}
          </Table>
        </Paper>
      </>
    );

    return reportElements;
  };

  const secondTableData = () => {
    let secondTable = null;
    secondTable = (
      <>
        <Paper className={classes.paper}>
          <Table
            className={classes.table}
            size="small"
            aria-label="spanning table"
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>{roleName}</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Total Modules</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Assigned Modules</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Completed Modules</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Incomplete Modules</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                // sampleArray2.map((data, i) => (
                branchWiseList && branchWiseList.result && branchWiseList.result.length !== 0 && branchWiseList.result.map((data, i) => (
                  <TableRow key={data.erp}>
                    <TableCell
                      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                      onClick={() => clickHandleTable2(data)}
                    >
                      {data.name}
                    </TableCell>
                    <TableCell>{data.total_module}</TableCell>
                    <TableCell>{data.assigned_modules}</TableCell>
                    <TableCell>{data.completed_module}</TableCell>
                    <TableCell>{data.in_completed_module}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Paper>
      </>
    );
    return secondTable;
  };

  const thirdTableData = () => {
    let thirdTable = null;
    thirdTable = (
      <>
        <Paper className={classes.paper}>
          <Typography variant="div">
            Name:
          </Typography>
          <Typography variant="div">
            {detailedVisualReport ? detailedVisualReport.name : ''}
          </Typography>
          <div />
          <Typography variant="div">
            ERP:
          </Typography>
          <Typography variant="div">
            {detailedVisualReport ? detailedVisualReport.erp : ''}
          </Typography>
          {
            detailedVisualReport && detailedVisualReport.result && detailedVisualReport.result.length !== 0 && detailedVisualReport.result.map((obj, i) => (
              <Table
                key={i}
                className={classes.table}
                size="small"
                aria-label="spanning table"
                style={{ border: '1.5px solid' }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: 'bold', border: '1.5px solid' }}
                      colSpan={obj.chapters.length !== 0 && obj.chapters.length !== 1 ? obj.chapters.length : Object.values(obj.chapters && obj.chapters.length !== 0 && obj.chapters[0]) && Object.values(obj.chapters && obj.chapters.length !== 0 && obj.chapters[0]).length !== 0 && Object.values(obj.chapters && obj.chapters.length !== 0 && obj.chapters[0])[0].length}
                    >
                      {obj.name}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {
                      obj.chapters.map((chapter) => (
                        <>
                          {Object.values(chapter)[0].map((res) => (
                            <>
                              {
                                Object.entries(res).map(([key, value]) => {
                                  if (key.toString().startsWith('title')) {
                                    return (
                                      <TableCell>
                                        {`${Object.values(chapter)[1]}`}
                                      </TableCell>
                                    );
                                  }
                                  return null;
                                })
                              }
                            </>
                          ))}
                        </>
                      ))
                    }
                  </TableRow>
                  <TableRow>
                    {
                      obj.chapters.map((chapter) => (
                        <>
                          {Object.values(chapter)[0].map((res) => (
                            <>
                              {
                                Object.entries(res).map(([key, value]) => {
                                  if (key.toString().startsWith('title')) {
                                    return (
                                      <TableCell>
                                        {value !== '' ? `${value}` : `Quiz ${parseInt(key.split('title')[1], 10) + 1}`}
                                      </TableCell>
                                    );
                                  }
                                  return null;
                                })
                              }
                            </>
                          ))}
                        </>
                      ))
                    }
                  </TableRow>
                  <TableRow>
                    {
                      obj.chapters.map((chapter) => (
                        <>
                          {Object.values(chapter)[0].map((res) => (
                            <>
                              {
                                Object.entries(res).map(([key, value]) => {
                                  if (key.toString().startsWith('quiz')) {
                                    return (
                                      <TableCell>
                                        {value}
                                      </TableCell>
                                    );
                                  }
                                  return null;
                                })
                              }
                            </>
                          ))}
                        </>
                      ))
                    }
                  </TableRow>
                </TableBody>
              </Table>
            ))
          }
        </Paper>
      </>
    );
    return thirdTable;
  };
  function handleDownloadReport() {
    // console.log("branch"+branchId.length)
    if ((auth && auth.personal_info.role && (auth.personal_info.role === 'Principal' || auth.personal_info.role === 'Coordinator' || auth.personal_info.role === 'academicmanagers'))) {

      if (!roleId) {
        setAlert('warning', 'Select Role');
        return;
      }
      if (!trainingType) {
        setAlert('warning', 'Select Training type');
        return;
      }
      if (branchId.length === 0) {
        setAlert('warning', 'Select branch');
        return;
      }
      document.getElementById('downloadButton').click();
    }
    else {
      setAlert('warning', 'You are not autorize person');
      return;
    }
  }

  useEffect(() => {
    setButtonRef([
      {
        csv: `${endpoints.sureLearning.getBranchWiseVisualReport}?course_type=${trainingType}&role=${roleId}&branch=${branchId}&Authorization=${`Bearer ${auth.personal_info.token}`}&module=${localStorage.getItem('Branch_Wise_Report')}&csv=True`,
      },
    ]);
  }, [branchId, roleId, trainingType]);


  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Sure Learning'
        childComponentName='Branch level Detailed Report'
        isAcademicYearVisible={true}
      />
      <div className={classes.root} style={{ margin: ' 5px 40px 5px 40px' }}>
        <div className={classes.tableMargin}>
          {/* <Typography variant="h4">Branch level detailed report</Typography>
          <Divider className={classes.divider} /> */}
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <Typography>
                  Select Role
                  <b style={{ color: 'red' }}>*</b>
                </Typography>
                <Select
                  margin="dense"
                  fullWidth
                  value={roleId || ''}
                  onChange={(e, actionMeta) => { setRoleId(e.target.value); roleChosen(); setRoleSelected(actionMeta.props.name); }}
                  className={classes.textField}
                  variant="outlined"
                  style={{ color: 'black' }}
                >
                  {/* <MenuItem
                      value={data.id}
                      key={data.id}
                      name={data.assigned_positions[0].name}
                    >
                      {data.id ? data.assigned_positions[0].name : ''}
                    </MenuItem> */}
                  {roleList
                    && roleList.length !== 0
                    && roleList.response.map((data) => (
                      <MenuItem
                        value={data.role_id}
                        key={data.role_id}
                        name={data.role_name}
                      >
                        {data ? data.role_name : ''}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>

              <Grid item md={3} xs={12}>
                <Typography>
                  Select Training
                  <b style={{ color: 'red' }}>*</b>
                </Typography>
                <Select
                  margin="dense"
                  fullWidth
                  value={trainingType || ''}
                  onChange={(event) => setTrainingType(event.target.value)}
                  className={classes.textField}
                  variant="outlined"
                  style={{ color: 'black' }}
                >
                  {trainingTypeList
                    && trainingTypeList.length !== 0
                    && trainingTypeList.map((data, i) => ((verify || data.id === '4') ? (
                      <MenuItem
                        value={data.id}
                        key={data.id}
                        name={data.name}
                      >
                        {data.id ? data.name : ''}
                      </MenuItem>) : '')
                    )
                  }

                </Select>
              </Grid>

              <Grid item md={6} xs={12} style={{ marginTop: '11px' }}>
                {access && access.can_view ?
                  <Button
                    style={{ marginTop: '20px', marginRight: '1%' }}
                    className={classes.updateButton}
                    color="primary"
                    variant="contained"
                    onClick={() => getDashboards()}
                    size="small"
                  >
                    Search
                  </Button> : null}
                <Button
                  style={{ marginTop: '20px', marginRight: '1%' }}
                  className={classes.updateButton}
                  color="primary"
                  variant="contained"
                  // disabled={tableStage < 1}
                  onClick={() => backButtonHandler()}
                  size="small"
                >
                  Back
                </Button>
                {access && access.can_export ?
                  <Button
                    style={{ marginTop: '20px', marginRight: '1%' }}
                    className={classes.updateButton}
                    color="primary"
                    variant="contained"
                    // disabled={tableStage < 1}
                    onClick={() => handleDownloadReport()}
                    size="small"
                  >
                    Download
                  </Button> : null}
                <Button style={{ display: 'none' }} href={bottomHRef && bottomHRef[0].csv} id="downloadButton" />
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
      <>
        {tableStage === 1 ? reportTable() : (
          tableStage === 2 ? secondTableData() : (tableStage === 3 ? thirdTableData() : null)
        )}
      </>
      <div style={{ display: 'none' }}>
        <TinyTextEditor
          id="courseDesc"
        />
      </div>
      <div />
      {loader}
    </Layout>
  );
};

BranchReport.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(BranchReport);
