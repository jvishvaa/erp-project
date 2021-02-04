import React, { useContext } from 'react';
import axios from 'axios';
import endpoints from '../../../config/endpoints';
import { TestComparisionContext } from './test-comparision-context';

const TestComparisionUI = () => {
  const {
    userTests,
    fetchUserTests,

    testComparisions,
    fetchTestComparisions,
  } = useContext(TestComparisionContext) || {};
  const testAxios = (lesson) => {
    const url = lesson
      ? 'http://13.232.30.169/qbox/lesson_plan/list-session/'
      : 'http://13.232.30.169/qbox/assessment/user-tests/?user=20&subject=1';
    axios
      .get(url, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        debugger;
      })
      .catch((error) => {
        debugger;
      });
  };
  return (
    <>
      <p>TestComparisionUI</p>
      <button
        type='button'
        onClick={() => {
          fetchUserTests();
        }}
      >
        fetchUserTests
      </button>
      {JSON.stringify(userTests)}

      <br />
      <button
        type='button'
        onClick={() => {
          fetchTestComparisions({ user: 20, test_1: 5, test_2: 7 });
        }}
      >
        fetchTestComparisions
      </button>
      {JSON.stringify(testComparisions)}

      <br />
      <button type='button' onClick={() => testAxios(true)}>
        testAxios lesst
      </button>
      <button type='button' onClick={() => testAxios(false)}>
        testAxios
      </button>
    </>
  );
};
export default TestComparisionUI;
