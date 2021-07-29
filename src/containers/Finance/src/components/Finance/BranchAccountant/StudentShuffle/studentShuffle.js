import React, { useEffect, useState } from 'react';
import {
  withStyles,
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core/';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { apiActions } from '../../../../_actions';
// import RequestShuffle from './requestShuffle'
import '../../../css/staff.css';
import * as actionTypes from '../../store/actions';
// import classes from './feeStructure.module.css'
// import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress';
import Layout from '../../../../../../Layout';

const styles = (theme) => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    border: '1px solid black',
    borderRadius: 4,
  },
  item: {
    margin: '15px',
  },
  btn: {
    backgroundColor: '#800080',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B008B',
    },
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  approve: {
    backgroundColor: '#008000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#006400',
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9',
    },
  },
  reject: {
    backgroundColor: '#FF0000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B0000',
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9',
    },
  },
});

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

let moduleId;
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'student' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Student Shuffle') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
          moduleId = item.child_id;
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}

const StudentShuffle = ({
  classes,
  session,
  history,
  dataLoading,
  branchList,
  fetchBranchAtAcc,
  studentShuffle,
  alert,
  user,
  fetchStudentShuffle,
  sendApproveReject,
}) => {
  const [sessionYear, setSession] = useState({ value: '2019-20', label: '2019-20' });
  const [shuffleStatus, setShuffleStatus] = useState({ label: 'Pending', value: 1 });
  const [accReasonToApprove, setAccReason] = useState({});
  const [branch, setBranch] = useState('');

  useEffect(() => {
    // Update the document title using the browser API
    if (sessionYear && shuffleStatus && branch) {
      fetchStudentShuffle(
        sessionYear.value,
        shuffleStatus.label,
        alert,
        user,
        branch && branch.value
      );
    }
  }, [alert, fetchStudentShuffle, sessionYear, shuffleStatus, user]);

  const requestHandler = (e) => {
    history.push({
      pathname: '/finance/Requestshuffle',
      state: {
        branch: branch && branch.value,
      },
    });
  };

  const handleSession = (e) => {
    setSession(e);
    // fetchStudentShuffle(alert, user)
    fetchBranchAtAcc(e && e.value, user, alert, moduleId);
  };
  const branchChangeHandler = (e) => {
    setBranch(e);
  };
  const handleShuffleStatus = (e) => {
    setShuffleStatus(e);
  };

  const accReason = (e, id) => {
    const newReason = { ...accReasonToApprove };
    newReason[id] = e.target.value;
    setAccReason(newReason);
  };

  const approveShufflingHandler = (id) => {
    let data = {
      branch: branch.value,
      id: id,
      to_approve_status: 'Approved',
      to_approve_status_date: new Date().toISOString().substr(0, 10),
      to_approve_status_remarks: accReasonToApprove[id],
    };
    // make approve/reject call
    sendApproveReject(data, alert, user);
    // setAccReason({})
  };

  const rejectShufflingHandler = (id) => {
    let data = {
      branch: branch.value,
      id: id,
      to_approve_status: 'Rejected',
      to_approve_status_date: new Date().toISOString().substr(0, 10),
      to_approve_status_remarks: accReasonToApprove[id],
    };
    // make approve/reject callsetAccReason
    sendApproveReject(data, alert, user);
    // setAccReason({})
  };

  const pendingShuffleTable = () => {
    if (studentShuffle && studentShuffle.length) {
      return (
        <div>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align='right'>ERP</TableCell>
                  <TableCell align='right'>Student Name</TableCell>
                  <TableCell align='right'>Branch Name</TableCell>
                  <TableCell align='right'>Class Name</TableCell>
                  <TableCell align='right'>Section</TableCell>
                  <TableCell align='right'>Request Branch</TableCell>
                  <TableCell align='right'>Request SentBy</TableCell>
                  <TableCell align='right'>Request SentDate</TableCell>
                  <TableCell align='right'>Remarks</TableCell>
                  <TableCell align='right'>Status</TableCell>
                  <TableCell align='right'>Accountants Remarks</TableCell>
                  <TableCell align='right'>Approve</TableCell>
                  <TableCell align='right'>Reject</TableCell>
                  {/* <TableCell align='right'>Approved Date</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {console.log(studentShuffle, 'studentShuffle')} */}
                {studentShuffle.map((row) => (
                  <TableRow>
                    <TableCell align='right'>{row.erp ? row.erp : ''}</TableCell>
                    <TableCell align='right'>
                      {row.student && row.student.name ? row.student.name : ''}
                    </TableCell>
                    <TableCell align='right'>
                      {row.branch_from && row.branch_from.branch_name
                        ? row.branch_from.branch_name
                        : ''}
                    </TableCell>
                    <TableCell align='right'>
                      {row.grade_from && row.grade_from.grade ? row.grade_from.grade : ''}
                    </TableCell>
                    <TableCell align='right'>
                      {row.section_from && row.section_from.section_name
                        ? row.section_from.section_name
                        : ''}
                    </TableCell>
                    <TableCell align='right'>
                      {row.branch_to && row.branch_to.branch_name
                        ? row.branch_to.branch_name
                        : ''}
                    </TableCell>
                    <TableCell align='right'>
                      {row.shuffle_initiated_by && row.shuffle_initiated_by.first_name
                        ? row.shuffle_initiated_by.first_name
                        : null}
                    </TableCell>
                    <TableCell align='right'>
                      {row.shuffle_initiation_date ? row.shuffle_initiation_date : ''}
                    </TableCell>
                    <TableCell align='right'>
                      <div style={{ width: 150 }}>{row.reason ? row.reason : ''}</div>
                    </TableCell>
                    <TableCell align='right'>
                      {row.to_approve_status ? row.to_approve_status : ''}
                    </TableCell>
                    <TableCell align='right'>
                      <div style={{ width: 150 }}>
                        <TextField
                          id='accreason'
                          value={accReasonToApprove[row.id]}
                          // label='Date to be Changed:'
                          type='text'
                          variant='outlined'
                          // defaultValue={this.state.todayDate}
                          className={classes.textField}
                          onChange={(e) => {
                            accReason(e, row.id);
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell align='right'>
                      <Button
                        onClick={() => {
                          approveShufflingHandler(row.id);
                        }}
                        // disabled={!accReasonToApprove[row.id]}
                        className={classes.approve}
                      >
                        Approve
                      </Button>
                    </TableCell>
                    <TableCell align='right'>
                      <Button
                        onClick={() => {
                          rejectShufflingHandler(row.id);
                        }}
                        // disabled={!accReasonToApprove[row.id]}
                        className={classes.reject}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      );
    } else {
      return (
        <div style={{ margin: '20px', fontSize: '16px' }}>
          <p>No Records</p>{' '}
        </div>
      );
    }
  };

  const approvedShuffleTable = () => {
    if (studentShuffle && studentShuffle.length) {
      return (
        <div>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align='right'>ERP</TableCell>
                  <TableCell align='right'>Student Name</TableCell>
                  <TableCell align='right'>Class Name</TableCell>
                  <TableCell align='right'>Section</TableCell>
                  <TableCell align='right'>Request Branch</TableCell>
                  <TableCell align='right'>Request SentBy</TableCell>
                  <TableCell align='right'>Request SentDate</TableCell>
                  <TableCell align='right'>Remarks</TableCell>
                  <TableCell align='right'>Admin Approval Status</TableCell>
                  <TableCell align='right'>Status</TableCell>
                  <TableCell align='right'>Approved By</TableCell>
                  <TableCell align='right'>Approved Remarks</TableCell>
                  <TableCell align='right'>Approved Date</TableCell>
                  {/* <TableCell align='right'>Approved Date</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {console.log(studentShuffle, 'studentShuffle')} */}
                {studentShuffle &&
                  studentShuffle.map((row) => (
                    <TableRow>
                      <TableCell align='right'>{row.erp ? row.erp : ''}</TableCell>
                      <TableCell align='right'>
                        {row.student && row.student.name ? row.student.name : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.grade_from && row.grade_from.grade
                          ? row.grade_from.grade
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.section_from && row.section_from.section_name
                          ? row.section_from.section_name
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.branch_to && row.branch_to.branch_name
                          ? row.branch_to.branch_name
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.shuffle_initiated_by && row.shuffle_initiated_by.first_name
                          ? row.shuffle_initiated_by.first_name
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.shuffle_initiation_date ? row.shuffle_initiation_date : ''}
                      </TableCell>
                      <TableCell align='right'>
                        <div style={{ width: 120 }}>{row.reason ? row.reason : ''}</div>
                      </TableCell>
                      <TableCell align='right'>
                        {row.admin_approve_status ? row.admin_approve_status : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.to_approve_status ? row.to_approve_status : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.to_approve_status_updated_by
                          ? row.to_approve_status_updated_by.first_name
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.to_approve_status_remarks
                          ? row.to_approve_status_remarks
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.to_approve_status_date ? row.to_approve_status_date : ''}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      );
    } else {
      return <div style={{ margin: '20px', fontSize: '16px' }}>No Records</div>;
    }
  };

  const rejectedShuffleTable = () => {
    if (studentShuffle && studentShuffle.length) {
      return (
        <div>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align='right'>ERP</TableCell>
                  <TableCell align='right'>Student Name</TableCell>
                  <TableCell align='right'>Class Name</TableCell>
                  <TableCell align='right'>Section</TableCell>
                  <TableCell align='right'>Request Branch</TableCell>
                  <TableCell align='right'>Request SentBy</TableCell>
                  <TableCell align='right'>Request SentDate</TableCell>
                  <TableCell align='right'>Remarks</TableCell>
                  <TableCell align='right'>Status</TableCell>
                  <TableCell align='right'>Rejected By</TableCell>
                  <TableCell align='right'>Rejected Remarks</TableCell>
                  <TableCell align='right'>Rejected Date</TableCell>
                  {/* <TableCell align='right'>Approved Date</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentShuffle &&
                  studentShuffle.map((row) => (
                    <TableRow>
                      <TableCell align='right'>{row.erp ? row.erp : ''}</TableCell>
                      <TableCell align='right'>
                        {row.student && row.student.name ? row.student.name : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.grade_from && row.grade_from.grade
                          ? row.grade_from.grade
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.section_from && row.section_from.section_name
                          ? row.section_from.section_name
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.branch_to && row.branch_to.branch_name
                          ? row.branch_to.branch_name
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.shuffle_initiated_by && row.shuffle_initiated_by.first_name
                          ? row.shuffle_initiated_by.first_name
                          : null}
                      </TableCell>
                      <TableCell align='right'>
                        {row.shuffle_initiation_date ? row.shuffle_initiation_date : ''}
                      </TableCell>
                      <TableCell align='right'>
                        <div style={{ width: 150 }}>{row.reason ? row.reason : ''}</div>
                      </TableCell>
                      <TableCell align='right'>
                        {row.to_approve_status ? row.to_approve_status : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.to_approve_status_updated_by
                          ? row.to_approve_status_updated_by.first_name
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.to_approve_status_remarks
                          ? row.to_approve_status_remarks
                          : ''}
                      </TableCell>
                      <TableCell align='right'>
                        {row.to_approve_status_date ? row.to_approve_status_date : ''}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      );
    } else {
      return <div style={{ margin: '20px', fontSize: '16px' }}>No Records</div>;
    }
  };

  return (
    <Layout>
      <React.Fragment>
        <Grid container direction='row' justify='flex-end' spacing={1}>
          <Grid item className={classes.item} xs={3}>
            <Button variant='contained' onClick={requestHandler} className={classes.btn}>
              Request Shuffle
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item className={classes.item} xs={3}>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={sessionYear || ''}
              options={
                session
                  ? session.session_year.map((session) => ({
                      value: session,
                      label: session,
                    }))
                  : []
              }
              onChange={(e) => handleSession(e)}
            />
          </Grid>
          <Grid item className={classes.item} xs={3}>
            <label>To Branch* </label>
            <Select
              placeholder='Select Branch'
              value={branch || ''}
              options={
                branchList
                  ? branchList.map((g) => ({
                      value: g.branch && g.branch.id ? g.branch.id : '',
                      label: g.branch && g.branch.branch_name ? g.branch.branch_name : '',
                    }))
                  : []
              }
              onChange={branchChangeHandler}
            />
          </Grid>
          <Grid item className={classes.item} xs={3}>
            <label>Shuffle Status*</label>
            <Select
              placeholder='Status'
              value={shuffleStatus || ''}
              options={[
                {
                  label: 'Pending',
                  value: 1,
                },
                {
                  label: 'Approved',
                  value: 2,
                },
                {
                  label: 'Rejected',
                  value: 3,
                },
              ]}
              onChange={(e) => handleShuffleStatus(e)}
            />
          </Grid>
        </Grid>
        {shuffleStatus && shuffleStatus.value === 1
          ? pendingShuffleTable()
          : shuffleStatus && shuffleStatus.value === 2
          ? approvedShuffleTable()
          : rejectedShuffleTable()}
        {dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    </Layout>
  );
};

StudentShuffle.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  // session: PropTypes.array.isRequired,
  // studentShuffle: PropTypes.array.isRequired
  // props: PropTypes.isRequired
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  studentShuffle: state.finance.accountantReducer.studentShuffle.shuffleDetails,
  branchList: state.finance.common.branchPerSession,
});

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranchAtAcc: (session, user, alert, moduleId) =>
    dispatch(actionTypes.fetchBranchPerSession({ session, user, alert, moduleId })),
  fetchStudentShuffle: (session, status, alert, user, branch) =>
    dispatch(actionTypes.fetchStudentShuffle({ session, status, alert, user, branch })),
  sendApproveReject: (data, alert, user) =>
    dispatch(actionTypes.sendApproveReject({ data, alert, user })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(StudentShuffle)));
