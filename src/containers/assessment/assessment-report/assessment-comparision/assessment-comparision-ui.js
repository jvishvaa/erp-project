/* eslint-disable no-nested-ternary */
import React, {useState , useEffect , useContext } from 'react';
import { makeStyles, Button, Grid, Box, Paper, Divider } from '@material-ui/core';
import Loading from 'components/loader/loader';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import { AssessmentComparisionContext } from './assessment-comparision-context';
import {
  TestCardDropdown,
  TestComparisionReportTable,
  UserSpecificSubjectDropdown,
} from './assessment-comparision-ui-components';

const useStyles = makeStyles(() => ({
  root: {
    // border: '1px solid',
    // borderColor: '#E2E2E2',
    // padding: '0.9rem',
    // borderRadius: '10px',
    // width: '100%',
    // boxShadow: 'none',
  },
  comparenowBtn: {
    marginLeft: '0.3rem',
    padding: '0.3rem 1rem',
    borderRadius: '0.6rem',
    fontSize: '0.9rem',
  },
  hr: {
    border: '1px solid #E2E2E2',
    margin: '1rem 0',
  },
}));

const TestComparisionUI = () => {
  const { user_id: user } = JSON.parse(localStorage.getItem('userDetails') || {});
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Take Test') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
  // const user = 20;
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const {
    userTests,
    fetchUserTests,

    testComparisions: { data: testComparisions, fetching, fetchFailed, message },
    fetchTestComparisions,

    userSubjects,
    fetchUserSubjects,
  } = useContext(AssessmentComparisionContext) || {};

  // const [testOneObj, setTestOneObj] = React.useState({
  //   test_id: 7,
  //   test__test_name: 'test-1',
  //   section: 1,
  //   subject: ['139'],
  // });
  // const [testTwoObj, setTestTwoObj] = React.useState({
  //   test_id: 10,
  //   test__test_name: 'test-2',
  //   section: 1,
  //   subject: ['139'],
  // });
  // const [subjectSelected, setSubjectSelected] = React.useState({
  //   id: 155,
  //   subject_name: 'Grade1_SecB_newtestsubJ',
  //   subject_slag: 'newtestsubJ',
  // });
  const [testOneObj, setTestOneObj] = React.useState();
  const [testTwoObj, setTestTwoObj] = React.useState();
  const [subjectSelected, setSubjectSelected] = React.useState('');
  const setTestOne = (valueObj) => {
    setTestOneObj(valueObj || undefined);

    const { test_id: selectedTestId } = valueObj || {};
    const { test_id: testTwoId } = testTwoObj || {};
    if (selectedTestId === testTwoId) {
      setTestTwoObj({});
    }
  };
  const setTestTwo = (valueObj) => {
    setTestTwoObj(valueObj || {});
  };
  const fetchComparionData = () => {
    const { test_id: testOneId } = testOneObj || {};
    const { test_id: testTwoId } = testTwoObj || {};
    if (testOneId && testTwoId) {
      fetchTestComparisions({
        test_1: testOneId,
        test_2: testTwoId,
        user,
      });
    } else {
      setAlert('error', 'Please select tests.');
    }
  };

  React.useEffect(() => {
    fetchUserSubjects({ module_id: moduleId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  React.useEffect(() => {
    const { subject_id: selectedSubjectId } = subjectSelected || {};
    if (selectedSubjectId) {
      fetchUserTests({ user, subject: selectedSubjectId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectSelected]);
  return (
    <>
      {[fetching, userTests.fetching, userSubjects.fetching].includes(true) ? (
        <Loading message='Loading...' />
      ) : null}

      <Paper elevation={0}>
        <Box m={{ xs: '1rem', sm: '2rem' }} className={classes.root}>
          <CommonBreadcrumbs
            componentName='Assessment'
            childComponentName='Report - Student test comparision'
          />
          <br />
          <Divider/>
          <br />
          <br />
          <UserSpecificSubjectDropdown
            options={userSubjects && userSubjects.data ? userSubjects.data : []}
            value={subjectSelected || {}}
            onChange={(e, valueObj) => {
              setSubjectSelected(valueObj);
            }}
          />
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5} md={4}>
              <TestCardDropdown
                name='test-1-card'
                key='test-1'
                tests={userTests.data}
                title={subjectSelected && subjectSelected.subject_name}
                value={testOneObj}
                update={setTestOne}
              />
            </Grid>
            <Grid item xs={12} sm={5} md={4}>
              <TestCardDropdown
                name='test-2-card'
                key='test-2'
                tests={(userTests.data || []).filter((item) => {
                  const { test_id: testOneId } = testOneObj || {};
                  return item.test_id !== testOneId;
                })}
                title={subjectSelected && subjectSelected.subject_name}
                value={testTwoObj || {}}
                update={setTestTwo}
              />
            </Grid>
          </Grid>
          <br />
          <Button
            variant='contained'
            color='primary'
            onClick={() => window.history.back()}
            className={classes.comparenowBtn}
          >
            Back
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={fetchComparionData}
            className={classes.comparenowBtn}
          >
            {fetching ? 'fetching...' : 'Compare Now'}
          </Button>
          <hr className={classes.hr} />
          {fetching ? (
            <p>fetching..</p>
          ) : fetchFailed ? (
            <p>{message}</p>
          ) : testComparisions ? (
            <TestComparisionReportTable dataRows={testComparisions || []} />
          ) : null}
        </Box>
      </Paper>
    </>
  );
};
export default TestComparisionUI;
