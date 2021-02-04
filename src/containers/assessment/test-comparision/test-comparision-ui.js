/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react';
// import axios from 'axios';
// import endpoints from '../../../config/endpoints';
import { makeStyles, Button, Grid, Box, Paper } from '@material-ui/core';
import {
  TestCardDropdown,
  TestComparisionReportTable,
  UserSpecificSubjectDropdown,
} from './test-comparision-ui-components';
import { TestComparisionContext } from './test-comparision-context';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const useStyles = makeStyles((theme) => ({
  root: {
    // border: '1px solid',
    // borderColor: '#E2E2E2',
    // padding: '0.9rem',
    // borderRadius: '10px',
    // width: '100%',
    // boxShadow: 'none',
  },
  comparenowBtn: {
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
  const user = 20;
  const moduleId = 12;
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const {
    userTests,
    fetchUserTests,

    testComparisions: { data: testComparisions, fetching, fetchFailed, message },
    fetchTestComparisions,

    userSubjects,
    fetchUserSubjects,
  } = useContext(TestComparisionContext) || {};

  const [testOneObj, setTestOneObj] = React.useState();
  const [testTwoObj, setTestTwoObj] = React.useState();
  const [subjectSelected, setSubjectSelected] = React.useState();

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
  return (
    <>
      <p>TestComparisionUI</p>
      <button
        type='button'
        onClick={() => {
          fetchUserTests({ user, subject: 1 });
        }}
      >
        fetchUserTests
      </button>
      {/* {JSON.stringify(userTests)} */}
      <br />
      <button
        type='button'
        onClick={() => {
          fetchTestComparisions({ user, test_1: 5, test_2: 7 });
        }}
      >
        fetchTestComparisions
      </button>
      {/* {JSON.stringify(testComparisions)} */}
      {/* userSubjects */}
      <Paper elevation={0}>
        <Box m={{ xs: '1rem', sm: '2rem' }} className={classes.root}>
          <UserSpecificSubjectDropdown />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TestCardDropdown
                name='test-1-card'
                key='test-1'
                tests={userTests.data}
                value={testOneObj}
                update={setTestOne}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TestCardDropdown
                name='test-2-card'
                key='test-2'
                tests={(userTests.data || []).filter((item) => {
                  const { test_id: testOneId } = testOneObj || {};
                  return item.test_id !== testOneId;
                })}
                value={testTwoObj || {}}
                update={setTestTwo}
              />
            </Grid>
          </Grid>
          <br />
          <Button onClick={fetchComparionData} className={classes.comparenowBtn}>
            Compare Now
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
