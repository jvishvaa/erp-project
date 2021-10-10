/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import '../../../containers/master-management/master-management.css';
import Loading from '../../../components/loader/loader';
import MarksUpload from './create-mapping/marks-upload';

const ReportCard = () => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const widerWidth = isMobile ? '98%' : '95%';
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Assessment'
          childComponentName='Marks Upload'
          isAcademicYearVisible={true}
        />
        <MarksUpload
          widerWidth={widerWidth}
          setLoading={setLoading}
          isMobile={isMobile}
        />
      </Layout>
    </>
  );
};

export default ReportCard;
