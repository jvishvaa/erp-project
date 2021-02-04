import React, { createContext } from 'react';
import endpoints from '../../../../config/endpoints';
import useFetcher from '../../../../utility-functions/custom-hooks/use-fetcher';

const {
  assessment: {
    userTests: userTestsAPIEndpoint,
    userTestComparisions: userTestComparisionsAPIEndpoint,
  } = {},
} = endpoints || {};

export const TestComparisionContext = createContext();

export const TestComparisionContextProvider = ({ children, ...restProps }) => {
  // eslint-disable-next-line no-console
  console.log(restProps);

  const userTestHookProps = {
    url: userTestsAPIEndpoint,
    dataType: 'array',
    defaultQueryParamObj: {},
    fetchOnLoad: false,
    includeAuthtoken: true,
    isCentral: true,
  };
  const [userTests, fetchUserTestsHook] = useFetcher(userTestHookProps);
  const fetchUserTests = (params = {}, callbacks = {}) => {
    const { user = 20, subject = 1 } = params || {};
    if (!user || !subject) {
      // eslint-disable-next-line no-alert
      window.alert('param not fed');
      return null;
    }
    const dataProp = {
      queryParamObj: { user, subject },
      callbacks,
    };
    fetchUserTestsHook(dataProp);
    return null;
  };

  const userSubjectHookProps = {
    url: userTestsAPIEndpoint,
    dataType: 'array',
    defaultQueryParamObj: {},
    fetchOnLoad: false,
    includeAuthtoken: true,
    isCentral: true,
  };
  const [userSubjects, fetchUserSubjectsHook] = useFetcher(userSubjectHookProps);

  const fetchUserSubjects = (params = {}, callbacks = {}) => {
    const { user = 20 } = params || {};
    if (!user) {
      // eslint-disable-next-line no-alert
      window.alert('param not fed');
      return null;
    }
    const dataProp = {
      queryParamObj: { user },
      callbacks,
    };
    fetchUserSubjectsHook(dataProp);
    return null;
  };

  const testComparsionHookProps = {
    url: userTestComparisionsAPIEndpoint,
    dataType: 'array',
    defaultQueryParamObj: {},
    fetchOnLoad: false,
    includeAuthtoken: true,
    isCentral: true,
  };
  const [testComparisions, fetchTestComparisionsHook] = useFetcher(
    testComparsionHookProps
  );

  const fetchTestComparisions = (params = {}, callbacks = {}) => {
    const { user, test_1: test1 = 20, test_2: test2 = 30 } = params || {};
    if ([user, test1, test2].map((i) => Boolean(i)).includes(false)) {
      // eslint-disable-next-line no-alert
      window.alert('param not fed');
      return null;
    }
    const dataProp = {
      queryParamObj: { test_1: test1, test_2: test2, user },
      callbacks,
    };
    fetchTestComparisionsHook(dataProp);
    return null;
  };

  return (
    <TestComparisionContext.Provider
      value={{
        userTests,
        fetchUserTests,

        userSubjects,
        fetchUserSubjects,

        testComparisions,
        fetchTestComparisions,
      }}
    >
      {children}
    </TestComparisionContext.Provider>
  );
};
