import React, { createContext, useEffect } from 'react';
import endpoints from '../../../../config/endpoints';
import useFetcher from '../../../../utility-functions/custom-hooks/use-fetcher';

const {
  assessment: {
    userTests: userTestsAPIEndpoint,
    userTestComparisions: userTestComparisionsAPIEndpoint,
    userSpecificSubjects: userSpecificSubjectsAPIEndpooint,
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
    const { user, subject } = params || {};
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
    url: userSpecificSubjectsAPIEndpooint,
    dataType: 'array',
    defaultQueryParamObj: {},
    fetchOnLoad: false,
    includeAuthtoken: true,
    isCentral: false,
  };
  const [userSubjects, fetchUserSubjectsHook] = useFetcher(userSubjectHookProps);

  const fetchUserSubjects = (params = {}, callbacks = {}) => {
    const { module_id: moduleId } = params || {};
    if ([moduleId].map((i) => Boolean(i)).includes(false)) {
      // eslint-disable-next-line no-alert
      window.alert('param not fed');
      return null;
    }
    const dataProp = {
      queryParamObj: { module_id: moduleId },
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
    const { user, test_1: test1, test_2: test2 } = params || {};
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
