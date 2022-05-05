/* eslint-disable radix */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
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
// import { Editor } from '@tinymce/tinymce-react';
import styles from './dashboard.style';
import useFetch from '../../../hoc/useFetch';
import { useAlert } from '../../../hoc/alert/alert';
import Loader from '../../../hoc/loader';
import urls from '../../../url';

const Dashboard = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
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
  const [bottomHRef, setBottomHRef] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);
  const [tableStage, setTableStage] = useState(0);
  const [roleName, setRoleSelected] = useState('');
  const alert = useAlert();
  const {
    data: branchList,
    isLoading: branchListLoading,
    doFetch: fetchBranches,
  } = useFetch(null);
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



  useEffect(() => {
    fetchModulePermission({
      url: `${urls.getPermissons}/${module}/details`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: localStorage.getItem('Branch_level_detailed_report')
      },
    });
  },[])
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
  ]);

  const [trainingType, setTrainingType] = useState('');
  let isRoleChosen = false;
  // let isTrainingTypeChosen = false;

  useEffect(() => {
    if (trainingType && roleId && branch) {
      fetchBranchWiseData({
        url: `${urls.getBranchWiseVisualReport}?course_type=${trainingType}&role=${roleId}&branch=${branch}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`,
          module_id: localStorage.getItem('Branch_level_detailed_report')
        },
      });
    }
  }, [searchClicked, fetchreport, auth.personal_info.token]);

  useEffect(() => {
    // fetchreport({
    //   url: `${urls.userDashboardApi}?course_id=${courseId}`,
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${auth.personal_info.token}`,
    //   },
    //   fetchreport,
    // });

    fetchRoles({
      url: urls.getRolesChangeUserStatusAPI,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module_id: localStorage.getItem('Branch_level_detailed_report')
      },
    });
    fetchBranches({
      url: urls.getBranchNamesApi,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module_id: localStorage.getItem('Branch_level_detailed_report')
      },
    });
  }, [fetchRoles, fetchreport, fetchBranches, auth.personal_info.token]);

  let loader = null;
  if (detailedVisualReportLoading || branchWiseListLoading || reportListLoading || checkLoader || roleListLoading || courseListLoading) {
    loader = <Loader open />;
  }

  const getDashboards = () => {
    setTableStage(1);
    setSearchClicked(!searchClicked);
    setPage(0);
    if (!roleId || !trainingType) {
      alert.warning('Select all fields');
    }
  };

  const roleChosen = () => {
    isRoleChosen = true;
    setCourseId('');
    setTrainingType('');
  };

  const clickHandleTable1 = (dataID) => {
    setTableStage(tableStage + 1);
    fetchBranchWiseData({
      url: `${urls.getBranchWiseVisualReport}?course_type=${trainingType}&role=${roleId}&branch=${dataID}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module_id: localStorage.getItem('Branch_level_detailed_report')
      },
    });
    // second table is shown, hide other 2 tables
  };

  const clickHandleTable2 = (data) => {
    setTableStage(tableStage + 1);

    fetchDetailedVisualReport({
      url: `${urls.getDetailedVisualReport}?user=${data.user}&role=${roleId}&course_type=${trainingType}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module_id: localStorage.getItem('Branch_level_detailed_report')

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
    setTableStage(tableStage - 1);
  };

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
                  Branch Names
                </TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="left">
                  Total
                  {' '}
                  {roleName}
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
                <TableCell style={{ fontWeight: 'bold' }}>Totle Modules</TableCell>
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
                      colSpan={obj.chapters.length !== 0 && obj.chapters.length !== 1 ? obj.chapters.length : Object.values(obj.chapters[0])[0].length}
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

  return (
    <>
      <div className={classes.root}>
        <div className={classes.tableMargin}>
          <Typography variant="h4">Branch level detailed report </Typography>
          <Divider className={classes.divider} />
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
                  {roleList
                  && roleList.length !== 0
                  && roleList.map((data) => (
                    <MenuItem
                      value={data.id}
                      key={data.id}
                      name={data.assigned_positions[0].name}
                    >
                      {data.id ? data.assigned_positions[0].name : ''}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item md={3} xs={12}>
                <Typography>
                  Select Training Type
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
                  && trainingTypeList.map((data, i) => (
                    <MenuItem
                      value={data.id}
                      key={data.id}
                      name={data.name}
                    >
                      {data.id ? data.name : ''}
                    </MenuItem>
                  ))}

                </Select>
              </Grid>
              <Grid item md={3} xs={12} style={{ display: 'none' }}>
                <Typography>
                  Select Branch
                  <b style={{ color: 'red' }}>*</b>
                </Typography>
                <Select
                  margin="dense"
                  fullWidth
                  value={branch || ''}
                  onChange={(e) => setBranch(e.target.value)}
                  className={classes.textField}
                  variant="outlined"
                  style={{ color: 'black' }}
                >
                  {branchList && branchList.length !== 0 && branchList.map((data) => (
                    <MenuItem
                      value={data.id}
                      key={data.id}
                      name={data.branch_name}
                    >
                      {data.id ? data.branch_name : ''}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              {/* <Grid item md={4} xs={12} /> */}
              <Grid item md={1} xs={12}>
                <Button
                  style={{ marginTop: '24px' }}
                  className={classes.updateButton}
                  color="primary"
                  variant="contained"
                  onClick={() => getDashboards()}
                  size="small"
                >
                  Search
                </Button>
              </Grid>
              <Grid item md={1} xs={12}>
                <Button
                  style={{ marginTop: '24px' }}
                  className={classes.updateButton}
                  color="primary"
                  variant="contained"
                  disabled={tableStage < 1}
                  onClick={() => backButtonHandler()}
                  size="small"
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
      <>
        {/* {tableStage === 1 ? reportTable() : (
          tableStage === 2 ? secondTableData() : (tableStage === 3 ? thirdTableData() : null)
        )} */}
        {tableStage === 1 ? secondTableData() : (
          tableStage === 2 ? thirdTableData() : null
        )}
      </>
      <div />
      {/* <div style={{ display: 'none' }}>
        <Editor
          id="courseDesc"
          apiKey="avuvy4c3g10sluz8vrm03j34cawyl6ajjms52nhfulk40aeb"
        // initialValue={(landingPageFetchResponse && landingPageFetchResponse.course_description) || (description) || ''}
        // value={(landingPageFetchResponse && landingPageFetchResponse.course_description) || (description) || ''}
          init={{
            height: 200,
            images_upload_url: 'postAcceptor.php',
            automatic_uploads: false,
            language_url: '/languages/fi.js',
            language: 'hi_IN',
            browser_spellcheck: true,
            contextmenu: false,
            video_template_callback(data) {
            // eslint-disable-next-line no-useless-concat
              return `<video width="${data.width}" height="${data.height}"${data.poster ? ` poster="${data.poster}"` : ''} controls="controls">\n` + `<source src="${data.source1}"${data.source1mime ? ` type="${data.source1mime}"` : ''} />\n${data.source2 ? `<source src="${data.source2}"${data.source2mime ? ` type="${data.source2mime}"` : ''} />\n` : ''}</video>`;
            },
            spellchecker_rpc_url: 'spellchecker.php',
            plugins: [
              'lists link image paste help wordcount',
              'spellchecker',
              'media',
            ],
            toolbar: 'undo redo | spellchecker | formatselect | fontselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image media| help',
          }}
        />
      </div> */}
      {loader}
    </>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(Dashboard);
