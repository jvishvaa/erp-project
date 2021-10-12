/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../../Layout';
import { Grid, Divider, TextField, Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import '../../../../containers/master-management/master-management.css';
import Loading from '../../../../components/loader/loader';

const StudentReportCard = () => {
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
            if (item.child_name === 'Report Card') {
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
          childComponentName='Report-Card'
          isAcademicYearVisible={true}
        />
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{
            width: widerWidth,
            margin: isMobile ? '0px 0px -10px 0px' : '-10px 0px 20px 8px',
          }}
        >
          <Grid item xs={12} sm={6} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              //   onChange={handleMappingType}
              id='grade'
              //   value={selectedMappingType || {}}
              //   options={mappingTypes || []}
              //   getOptionLabel={(option) => option?.type || ''}
              //   getOptionSelected={(option, value) => option?.id === value?.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Grade'
                  placeholder='Grade'
                />
              )}
            />
          </Grid>
          <Grid xs={0} sm={6} />
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export default StudentReportCard;
