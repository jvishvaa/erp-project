/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../../../Layout';
import CommonBreadcrumbs from '../../../../../components/common-breadcrumbs/breadcrumbs';
import '../../../../../containers/master-management/master-management.css';
import Loading from '../../../../../components/loader/loader';
import ReportCardList from './report-card-list';

const ReportCardPipeline = () => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const widerWidth = isMobile ? '98%' : '95%';
  const [loading, setLoading] = useState(false);
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Report Card Pipeline') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Assessment'
          childComponentName='Report Card Pipeline'
          isAcademicYearVisible={true}
        />
        <ReportCardList
          widerWidth={widerWidth}
          setLoading={setLoading}
          isMobile={isMobile}
          moduleId={moduleId}
        />
      </Layout>
    </>
  );
};

export default ReportCardPipeline;
