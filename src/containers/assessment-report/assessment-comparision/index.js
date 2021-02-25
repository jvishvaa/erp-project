import React from 'react';
import TestComparisionUI from './test-comparision-ui';
import Layout from '../../Layout'
import { TestComparisionContextProvider } from './test-comparision-context';

const TestComparision = () => {
  return (
    <Layout>
      <TestComparisionContextProvider>
        <TestComparisionUI />
      </TestComparisionContextProvider>
    </Layout>
  );
};
export default TestComparision;
