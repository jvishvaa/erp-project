import React, {
  useEffect,
  useState,
  // useCallback,
  useMemo,
} from 'react';
import { TextField, Button, withStyles, Grid } from '@material-ui/core/';
import Select from 'react-select';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { apiActions } from '../../../../_actions';
import * as actionTypes from '../../store/actions';
import Student from '../../Profiles/studentProfile';
// import { student } from '../../../../_reducers/student.reducer'
import AutoSuggest from '../../../../ui/AutoSuggest/autoSuggest';
// import { debounce } from '../../../../utils'
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
    marginTop: theme.spacing * 3,
    overflowX: 'auto',
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

const RequestShuffle = ({
  classes,
  session,
  history,
  redirectPageStatus,
  initiateShuffleRequest,
  fetchGradesPerBranch,
  fetchErpSuggestions,
  ErpSuggestions,
  sectionList,
  fetchSections,
  gradeList,
  fetchBranchAtAcc,
  branchList,
  dataLoading,
  user,
  alert,
}) => {
  const [displayErp, setDisplayErp] = useState(null);
  const [erp, setErp] = useState(null);
  const [studentName, setStudentName] = useState(null);
  const [sessionYear, setSessionYear] = useState(null);
  const [branch, setBranch] = useState('');
  const [branches, setBranches] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [reason, setReason] = useState('');
  // const [searchBy, setSearchBy] = useState('')

  // useEffect(() => {

  // })

  useEffect(() => {}, [displayErp]);

  useEffect(() => {
    if (sessionYear) {
      setBranch('');
      setGrade('');
      setSection('');
    }
  }, [alert, fetchBranchAtAcc, sessionYear, user]);

  useEffect(() => {
    // Update the document title using the browser API
    if (branch && sessionYear) {
      fetchGradesPerBranch(sessionYear.value, branch.value, alert, user, moduleId);
      setGrade('');
      setSection('');
    }
  }, [alert, branch, fetchGradesPerBranch, sessionYear, user]);

  useEffect(() => {
    if (branch && sessionYear && grade) {
      fetchSections(grade.value, sessionYear.value, branch.value, alert, user, moduleId);
      setSection('');
    }
  }, [sessionYear, branch, grade, fetchSections, alert, user]);

  useEffect(() => {
    if (redirectPageStatus) {
      history.push({
        pathname: '/finance/StudentShuffleRequest',
      });
    }
  }, [history, redirectPageStatus]);

  useEffect(() => {
    if (studentName) {
      const selectedStudent =
        ErpSuggestions && ErpSuggestions.length > 0
          ? ErpSuggestions.filter((item) => item.name === studentName)[0]
          : null;
      setDisplayErp(
        selectedStudent && selectedStudent.erp ? selectedStudent.erp : displayErp
      );
    }
    if (erp) {
      const selectedStudent =
        ErpSuggestions && ErpSuggestions.length > 0
          ? ErpSuggestions.filter((item) => item.erp === erp)[0]
          : null;
      setDisplayErp(
        selectedStudent && selectedStudent.erp ? selectedStudent.erp : displayErp
      );
    }
  }, [ErpSuggestions, displayErp, erp, studentName]);

  //   const nameDebounceFunc = debounce(() => {
  //     fetchErpSuggestions(
  //       'student',
  //       sessionYear.value,
  //       'all',
  //       'all',
  //       3,
  //       studentName,
  //       alert,
  //       user
  //     )
  //   }, 500)
  const nameDebounceFunc = (studentName1) => {
    fetchErpSuggestions(
      'student',
      sessionYear.value,
      'all',
      'all',
      3,
      studentName1,
      alert,
      user,
      branches && branches.value
    );
  };

  //   const erpDebounceFunc = debounce(() => {
  //     fetchErpSuggestions(
  //       'erp',
  //       sessionYear.value,
  //       'all',
  //       'all',
  //       3,
  //       erp,
  //       alert,
  //       user
  //     )
  //   }, 500)

  const erpDebounceFunc = (erp1) => {
    console.log(erp1.length, 'erp');
    if (erp1.length > 2 ) {
    fetchErpSuggestions(
      'erp',
      sessionYear.value,
      'all',
      'all',
      3,
      erp1,
      alert,
      user,
      branches && branches.value
    );
    }
  };
  const erpHandler = (e) => {
    // let searchBox = null
    console.log(e , "seterp");

    if (!sessionYear || !branches) {
      alert.warning('Select Academic Year and Branch!');
    } else {
      // console.log('erp', e.target.value);
      console.log(isNaN(Number(e.target.value)), 'true or false');

      setErp(e.target.value)
      if (e.target.value && e.target.value.length > 2) {
        console.log(e.target.value, 'erp2');
        console.log(erp, 'erp3');
        erpDebounceFunc(e.target.value);
      }

      // if (isNaN(Number(e.target.value))) {
      //   // console.log('erp', e.target.value);
      //   console.log('1');
      //   setErp(null);
      //   setStudentName(e.target.value);
      //   if (e.target.value && e.target.value.length > 2) {
      //     nameDebounceFunc(e.target.value);
      //   }
      // } else if (isFinite(Number(e.target.value))) {
      //   console.log('2');
      //   // console.log('erp', e.target.value);
      //   setStudentName(null);
      //   setErp(e.target.value);
        // if (e.target.value && e.target.value.length > 2) {
        //   console.log(e.target.value, 'erp2');
        //   console.log(erp, 'erp3');
        //   erpDebounceFunc(e.target.value);
        // }
      // }
    }
  };

  const academicYearChangeHandler = (e) => {
    setSessionYear(e);
    fetchBranchAtAcc(e && e.value, user, alert, moduleId);
  };

  const branchChangeHandler = (e) => {
    setBranch(e);
  };

  const gradeChangeHandler = (e) => {
    setGrade(e);
  };

  const sectionChangeHandler = (e) => {
    setSection(e);
  };

  const reasonChangeHandler = (e) => {
    setReason(e.target.value);
  };

  const branchHandler = (e) => {
    setBranches(e);
  };

  const handleSug = (e) => {
    if (ErpSuggestions && studentName) {
      return ErpSuggestions.map((item) => ({
        value: item.name ? item.name : null,
        label: item.name ? item.name : null,
      }));
    } else if (ErpSuggestions && erp) {
      return ErpSuggestions.map((item) => ({
        value: item.erp ? item.erp : null,
        label: item.erp ? item.erp : null,
      }));
    }
  };

  const postDetailsHandler = (e) => {
    console.log(displayErp , "display erp");
    let data = {
      erp: displayErp,
      academic_year: sessionYear.value,
      branch_id: branches && branches.value,
      reason: reason,
      branch_to: branch.value,
      grade_to: grade.value,
      section_to: section.value,
    };
    initiateShuffleRequest(data, alert, user);
  };

  const studentInfoHandler = useMemo(() => {
    if (studentName || erp) {
      return (
        <Student
          erp={displayErp}
          branch={branches && branches.value}
          session={sessionYear && sessionYear.value}
          user={user}
          alert={alert}
        />
      );
    }
  }, [studentName, displayErp, alert, user]);

  return (
    <Layout>
      <React.Fragment>
        <Grid container className={classes.item} spacing={3}>
          <Grid item className={classes.item} xs={3}>
            <label>Academic Year*</label>
            <Select
              className={classes.select}
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
              onChange={academicYearChangeHandler}
            />
          </Grid>
          <Grid item className={classes.item} xs={3}>
            <label>Branch* </label>
            <Select
              placeholder='Select Branch'
              value={branches || ''}
              options={
                branchList
                  ? branchList.map((g) => ({
                      value: g.branch && g.branch.id ? g.branch.id : '',
                      label: g.branch && g.branch.branch_name ? g.branch.branch_name : '',
                    }))
                  : []
              }
              onChange={branchHandler}
            />
          </Grid>
          <Grid item className={classes.item} xs={3}>
            <AutoSuggest
              style={{ width: '100%' }}
              // style={{ display: 'absolute', top: '10px', width: '240px' }}
              id='outlined-name'
              label='ERP '
              margin='dense'
              type='text'
              // variant='outlined'
              value={erp || studentName || ''}
              onChange={(e) => {
                erpHandler(e);
              }}
              data={ErpSuggestions && ErpSuggestions.length > 0 ? handleSug() : []}
            />
          </Grid>
          <Grid item className={classes.item} xs={12}>
            {studentInfoHandler}
            {/* {displayErp ? <Student erp={displayErp} user={user} alert={alert} /> : null} */}
            {/* {studentName ? <Student erp={studentName} user={user} alert={alert} /> : erp ? <Student erp={studentName} user={user} alert={alert} /> : null} */}
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
            <label>To Grade* </label>
            <Select
              placeholder='Select Grade'
              value={grade || ''}
              options={
                gradeList && gradeList
                  ? gradeList.map((g) => ({
                      value: g.grade.id,
                      label: g.grade.grade,
                    }))
                  : []
              }
              onChange={gradeChangeHandler}
            />
          </Grid>
          <Grid item className={classes.item} xs={3}>
            <label>To Section* </label>
            <Select
              placeholder='Select Section'
              value={section || ''}
              options={
                sectionList && sectionList
                  ? sectionList.map((g) => ({
                      value: g.section && g.section.id,
                      label: g.section && g.section.section_name,
                    }))
                  : []
              }
              onChange={sectionChangeHandler}
            />
          </Grid>
          <Grid item className={classes.item} xs={10}>
            <label>Reason</label>
            <TextField
              id='utlined-helperText'
              multiline
              rowsMax='4'
              style={{ width: '100%' }}
              // style={{ marginRight: '15px', fontSize: '16px'}}
              value={reason || ''}
              // label='Reason'
              // fullWidth
              margin='normal'
              variant='outlined'
              onChange={reasonChangeHandler}
            />
          </Grid>
          <Grid item className={classes.item} xs={3}>
            <Button
              variant='contained'
              onClick={postDetailsHandler}
              disabled={
              !displayErp || !sessionYear || !reason || !branch || !grade || !section
              }
              className={classes.btn}
            >
              Initiate Shuffle
            </Button>
          </Grid>
        </Grid>
        {dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    </Layout>
  );
};

RequestShuffle.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  session: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  gradeList: state.finance.common.gradesPerBranch,
  branchList: state.finance.common.branchPerSession,
  sectionList: state.finance.common.sectionsPerGradeAdmin,
  ErpSuggestions: state.finance.makePayAcc.erpSuggestions,
  redirectPageStatus: state.finance.accountantReducer.studentShuffle.redirect,
});

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchGradesPerBranch: (session, branch, alert, user, moduleId) =>
    dispatch(
      actionTypes.fetchGradesPerBranch({ session, branch, alert, user, moduleId })
    ),
  fetchBranchAtAcc: (session, user, alert, moduleId) =>
    dispatch(actionTypes.fetchBranchPerSession({ session, user, alert, moduleId })),
  fetchSections: (gradeId, session, branchId, alert, user, moduleId) =>
    dispatch(
      actionTypes.fetchAllSectionsPerGradeAsAdmin({
        gradeId,
        session,
        branchId,
        alert,
        user,
        moduleId,
      })
    ),
  initiateShuffleRequest: (data, alert, user) =>
    dispatch(actionTypes.initiateShuffleRequest({ data, alert, user })),
  fetchErpSuggestions: (
    type,
    session,
    grade,
    section,
    status,
    erp,
    alert,
    user,
    branch
  ) =>
    dispatch(
      actionTypes.fetchErpSuggestions({
        type,
        session,
        grade,
        section,
        status,
        erp,
        alert,
        user,
        branch,
      })
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(RequestShuffle)));
