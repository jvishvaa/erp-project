import React, { useState } from 'react';
import { Grid, useMediaQuery, useTheme } from '@material-ui/core';
import ERPSystemConfigList from './erp-system-config-list';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import '../master-management.css';
import Loading from '../../../components/loader/loader';
// import {createErpSystemConfig} from './apis';
import CreateConfig from './create-config';

const ERPSystemConfig = () => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [configUI, setConfigUI] = useState('list');
  const [editDetails, setEditDetails] = useState('');

  function renderSystemConfigUI() {
    switch (configUI) {
      case 'list':
        return (
          <ERPSystemConfigList
            {...{ setLoading, isMobile, setConfigUI, setEditDetails }}
          />
        );
      case 'create':
        return (
          <CreateConfig {...{ editDetails, setLoading, setConfigUI, setEditDetails }} />
        );
    }
  }

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName={configUI === 'create' ? 'Create Config' : 'System Config'}
          isAcademicYearVisible={true}
        />
        <Grid container spacing={isMobile ? 3 : 0}>
          <Grid item xs={12}>
            {renderSystemConfigUI()}
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export default ERPSystemConfig;
