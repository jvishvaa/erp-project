/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
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
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import styles from './teachersPerformenceCard.style';
import urls from '../../../url';
import Loader from '../../../hoc/loader';
import useFetch from '../../../hoc/useFetch';
import { useAlert } from '../../../hoc/alert/alert';

const TeachersPerformance = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const [rowsPerPage, setRowsPerPage] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const [viewOpen, setViewOpen] = useState(false);
  const [userName, setuserName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [status, setStatus] = useState('induction_trining');
  const [UserId, setUserId] = useState('');
  const [branch, setBranch] = useState([]);

  const [teachersResults, setTeachersReasults] = useState();
  const [loading, setLoader] = useState(false);
  const alert = useAlert();
  const triningList = [
    { id: 'induction_training', name: 'Induction Trining', index: 0 },
    { id: 'self_driven', name: 'Self Driven', index: 1 },
    { id: 'trainer_driven', name: 'Trainer Driven', index: 2 },
  ];

  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  };
  DialogTitle.propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    onClose: PropTypes.func.isRequired,
  };
  const {
    data: teachersData,
    isLoading: gettingTeachersData,
    doFetch: fetchTeachersData,
  } = useFetch(null);

  const {
    data: branchList,
    isLoading: gettingBranch,
    doFetch: fetchBranchList,
  } = useFetch(null);

  const {
    data: teachersScoresData,
    isLoading: gettingTeachersScore,
    doFetch: fetchTeachersScores,
  } = useFetch(null);

  const {
    data: roleList,
    isLoading: gettingRoleList,
    doFetch: fetchRoleList,
  } = useFetch(null);

  useEffect(() => {
    if (branch.length !== 0 && roleId) {
      fetchTeachersData({
        url: `${urls.teachersPerformanceData}?branches=${branch}&role_id=${roleId}&page_size=${rowsPerPage || 10}&page=${page + 1}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`,
        },
      });
    }
  }, [page, rowsPerPage]);

  const getTeachersList = () => {
    setPage(0);
    setRowsPerPage(10);
    if (branch.length !== 0 && roleId) {
      fetchTeachersData({
        url: `${urls.teachersPerformanceData}?branches=${branch}&role_id=${roleId}&page_size=${10}&page=${1}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`,
        },
      });
    }
  };

  useEffect(() => {
    if (auth) {
      fetchBranchList({
        url: `${urls.branchListApi}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`,
        },
      });
      fetchRoleList({
        url: `${urls.assignTeacherRoleList}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`,
        },
      });
    }
  }, [auth]);

  // useEffect(() => {
  //   if (roleId) {
  //     fetchCourseList({
  //       url: `${urls.principalCompletedViewCourseApi}?role_id=${roleId}`,
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${auth.personal_info.token}`,
  //       },
  //     });
  //   }
  // }, [roleId]);

  useEffect(() => {
    if (teachersScoresData) {
      setViewOpen(true);
    }
  }, [teachersScoresData]);

  function functionforGetTeachersDetails(id) {
    fetchTeachersScores({
      url: `${urls.teachersScoreApi}?user_id=${id}&training_type=${status}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
      },
    });
  }
  useEffect(() => {
    if (status && viewOpen === true) {
      functionforGetTeachersDetails(UserId);
    }
  }, [status]);

  function viewTeachersResults(id, name) {
    functionforGetTeachersDetails(id);
    setUserId(id);
    setuserName(name);
    setStatus('induction_training');
    setValue(0);
  }
  function handleChangePage(event, newPage) {
    setPage(newPage);
    if (!rowsPerPage) {
      setRowsPerPage(10);
    }
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setPage(0);
  }

  function firstPageChange() {
    setPage(0);
  }

  function lastPageChange(lastPage) {
    setPage(lastPage);
  }

  let loader = null;
  if (gettingTeachersData || gettingTeachersScore || gettingBranch
     || gettingRoleList || loading) {
    loader = <Loader open />;
  }

  const handleCloseQuestionModule = () => {
    setViewOpen(false);
    setuserName('');
    setUserId('');
    setTeachersReasults('');
    setCourseId('');
    setStatus('induction_training');
    setValue(0);
  };

  function handleChange(event, newValue) {
    setValue(newValue);
    setTeachersReasults('');
    setCourseId('');
    if (triningList[newValue].index === newValue) {
      setStatus(triningList[newValue].id);
    } else if (triningList[newValue].index === newValue) {
      setStatus(triningList[newValue].id);
    } else if (triningList[newValue].index === newValue) {
      setStatus(triningList[newValue].id);
    }
  }

  const functionTogetMarksList = async () => {
    if (!courseId) {
      alert.warning('select Course ');
      return;
    }
    setLoader(true);
    const response = await fetch(`${urls.teachersResultsApi}?user_id=${UserId}&training_type=${status}&course_id=${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
      },
    });
    const getDataInfo = await response.json();
    setTeachersReasults(getDataInfo);
    setLoader(false);
  };

  function tableFunction(information) {
    return (
      information && information.length !== 0
            && (
            <Box border={1}>
              <Grid item md={12} xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell float="left">
                        S.No.
                      </TableCell>
                      <TableCell float="left">
                        Question Paper Title
                      </TableCell>
                      <TableCell float="left">
                        Chapter Name
                      </TableCell>
                      <TableCell float="left">
                        Marks Scored
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {information && information.length !== 0
                && information.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell float="left">
                      {index + 1}
                    </TableCell>
                    <TableCell float="left">
                      {(data.question_paper && data.question_paper.title) || ''}
                      {(data.course_wise_video && data.course_wise_video.title) || ''}
                    </TableCell>
                    <TableCell float="left">
                      {(data.content_related_chapter && data.content_related_chapter.title) || ''}
                    </TableCell>
                    <TableCell float="left">
                      {(data.marks_scored && data.marks_scored) || ''}
                    </TableCell>
                  </TableRow>
                ))}
                  </TableBody>
                </Table>
              </Grid>
            </Box>
            )
    );
  }

  function functionToViewQuestionDialog() {
    let dialoge = null;

    dialoge = (
      <Dialog
        fullWidth
        maxWidth="xl"
        open={viewOpen}
        onClose={handleCloseQuestionModule}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" onClose={handleCloseQuestionModule}>
          View &nbsp;
          <b style={{ color: 'blue' }}>{userName}</b>
            &nbsp;
          Scores
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  color="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  {triningList
                    && triningList.map((statusData) => (
                      <Tab
                        key={statusData.id}
                        style={{ marginRight: '4%', marginLeft: '4%' }}
                        label={statusData.name}
                      />
                    ))}
                </Tabs>
              </AppBar>
            </Grid>
            <Grid item md={12} xs={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} style={{ marginTop: '24px', color: 'blue' }}>
                    <Typography variant="h5">
                      Hours Allotted : &nbsp;
                      {teachersScoresData && teachersScoresData.hours_allotted}
                    </Typography>
                  </Grid>
                  <Grid item md={6} xs={6} style={{ marginTop: '24px', color: 'blue' }}>
                    <Typography variant="h5">
                      Completed Hours : &nbsp;
                      {teachersScoresData && teachersScoresData.pending_duration}
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography>
                      Select course
                      <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Select
                      label="Course"
                      margin="dense"
                      fullWidth
                      value={courseId || ''}
                      onChange={(e) => setCourseId(e.target.value)}
                      className={classes.textField}
                      variant="outlined"
                      style={{ color: 'black' }}
                    >
                      {teachersScoresData
                        && teachersScoresData.modules.length !== 0
                        && teachersScoresData.modules.map((data) => (
                          <MenuItem
                            value={data.id}
                            key={data.id}
                            name={data.course_name}
                          >
                            {data.course_name ? data.course_name : ''}
                          </MenuItem>
                        ))}
                    </Select>
                  </Grid>
                  <Grid item md={2} xs={12} style={{ marginTop: '25px' }}>
                    <Button color="primary" variant="contained" onClick={() => functionTogetMarksList()}>Get</Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Divider className={classes.divider} style={{ color: 'black' }} />
            {teachersResults && teachersResults
            && (
              <>
                <Grid item md={6} xs={12}>
                  <Paper className={classes.paper}>
                    <Typography variant="h5" style={{ color: 'blue', textAlign: 'center' }}> Quiz Details </Typography>
                    {teachersResults && teachersResults.quiz_details
               && teachersResults.quiz_details.length === 0
              && (
              <Box border={1}>
                <Typography style={{ textAlign: 'center' }} variant="h5"> Quiz Details are not Updated </Typography>
              </Box>
              )}
                    {teachersResults && teachersResults.quiz_details
               && teachersResults.quiz_details.length !== 0
              && tableFunction(teachersResults && teachersResults.quiz_details)}
                  </Paper>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Paper className={classes.paper}>
                    <Typography variant="h5" style={{ color: 'blue', textAlign: 'center' }}> Assessment Details </Typography>
                    {teachersResults && teachersResults.assessment_details
              && teachersResults.assessment_details.length === 0
              && (
              <Box border={1}>
                <Typography style={{ textAlign: 'center' }} variant="h5">Assessment Details are not Updated</Typography>
              </Box>
              )}
                    {teachersResults && teachersResults.assessment_details
               && teachersResults.assessment_details.length !== 0
              && tableFunction(teachersResults && teachersResults.assessment_details)}
                  </Paper>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    );
    return dialoge;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          <Typography variant="h4">Teachers Performance</Typography>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid item md={12} xs={12}>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
              <Typography>Select Branch</Typography>
              <Select
                multiple
                margin="dense"
                fullWidth
                value={branch || ''}
                onChange={(e) => setBranch(e.target.value)}
                className={classes.textField}
                variant="outlined"
                style={{ color: 'black' }}
              >
                {branchList
                  && branchList.length !== 0
                  && branchList.map((data) => (
                    <MenuItem
                      value={data.id}
                      key={data.id}
                      name={data.branch_name}
                    >
                      {data.branch_name ? data.branch_name : ''}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography>Select Role</Typography>
              <Select
                margin="dense"
                fullWidth
                value={roleId || ''}
                onChange={(e) => setRoleId(e.target.value)}
                className={classes.textField}
                variant="outlined"
                style={{ color: 'black' }}
              >
                {roleList
                && roleList.map((item) => (
                  item.assigned_positions.map((data) => (
                    <MenuItem
                      key={data.id}
                      value={data.id}
                    >
                      {data.name}
                    </MenuItem>
                  ))
                ))}
              </Select>
            </Grid>
            {/* <Grid item md={3} xs={12}>
              <Typography>Select Course</Typography>
              <Select
                margin="dense"
                fullWidth
                value={courseId || ''}
                onChange={(e) => setCourseId(e.target.value)}
                className={classes.textField}
                variant="outlined"
                style={{ color: 'black' }}
              >
                {courseList
                && courseList.map((item) => (
                  <MenuItem
                    key={item.course.id}
                    value={item.course.id}
                  >
                    {item.course.course_name}
                  </MenuItem>
                ))}
              </Select>
            </Grid> */}
            <Grid item md={3} xs={12}>
              <Button style={{ marginTop: '25px' }} variant="contained" color="primary" onClick={getTeachersList}>Get</Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Divider className={classes.divider} />
      {teachersData && teachersData.results.length === 0 && <Typography variant="h4" style={{ color: 'blue', textAlign: 'center' }}>No Reviews are Added</Typography>}
      {teachersData && teachersData.results.length !== 0
      && (
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell float="left">
                    <Typography>S.No.</Typography>
                  </TableCell>
                  <TableCell float="left">
                    <Typography>Name</Typography>
                  </TableCell>
                  <TableCell float="left">
                    <Typography>ERP</Typography>
                  </TableCell>
                  <TableCell float="left">
                    <Typography>Email Id</Typography>
                  </TableCell>
                  <TableCell float="left">
                    <Typography>View Score</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachersData && teachersData.results.length !== 0
                && teachersData.results.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell float="left">
                      <Typography>{index + 1}</Typography>
                    </TableCell>
                    <TableCell float="left">
                      <Typography>{(item.user && item.user.first_name) || ''}</Typography>
                    </TableCell>
                    <TableCell float="left">
                      <Typography>{(item.erp) || ''}</Typography>
                    </TableCell>
                    <TableCell float="left">
                      <Typography>{(item.email && item.email) || ''}</Typography>
                    </TableCell>
                    <TableCell float="left">
                      <Button variant="contained" color="primary" onClick={() => viewTeachersResults(item.user.id, item.user.first_name)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>
      )}
      {teachersData && teachersData.results.length !== 0 && (
      <Grid item md={12} xs={12}>
        <Paper
          style={{ backgroundColor: 'lightgray', marginTop: '10px' }}
        >
          <Table>
            <TableBody>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  labelDisplayedRows={() => `Page ${page
                                + 1} of ${+teachersData.total_pages}`}
                  rowsPerPageOptions={[10, 20, 30]}
                  count={+teachersData.count}
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
                      teachersData.total_pages - 1,
                    )}
                    disabled={
                                page === +teachersData.total_pages - 1
                              }
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
      {functionToViewQuestionDialog()}
    </>
  );
};
TeachersPerformance.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};
export default withStyles(styles)(TeachersPerformance);
