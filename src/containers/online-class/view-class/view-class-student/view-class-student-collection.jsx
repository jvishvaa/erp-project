import React, { useContext, useEffect, useState } from 'react';
import { Tabs, Tab, Typography, Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import ViewClassStudent from './view-class-student';
import { OnlineclassViewContext } from '../../online-class-context/online-class-state';
import './view-class-student.scss';
import Layout from '../../../Layout';
import Loader from '../../../../components/loader/loader';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';

const ViewClassStudentCollection = () => {
  const {
    studentView: {
      studentOnlineClasses = [],
      currentPage,
      totalPages,
      loadingStudentOnlineClasses,
    },
    listOnlineClassesStudentView,
    dispatch,
  } = useContext(OnlineclassViewContext);
  const [currentTab, setCurrentTab] = useState(0);

  const { role_details: roleDetails } =
    JSON.parse(localStorage.getItem('userDetails')) || {};

  useEffect(() => {
    const isCompleted = !!currentTab;
    dispatch(listOnlineClassesStudentView(roleDetails.erp_user_id, isCompleted, 1, 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const handleTabChange = (event, tab) => {
    setCurrentTab(tab);
  };

  const handlePagination = (event, page) => {
    const isCompleted = !!currentTab;

    if (page !== currentPage) {
      dispatch(
        listOnlineClassesStudentView(roleDetails.erp_user_id, isCompleted, page, 10)
      );
    }
  };

  const renderUI = () => {
    if (loadingStudentOnlineClasses) {
      return <Loader />;
    }
    if (!studentOnlineClasses.length) {
      return (
        <Typography variant='h5' align='center' className='not-found-alert'>
          Sorry! No classes were found at this moment
        </Typography>
      );
    }

    return (
      <>
        {studentOnlineClasses.map((onlineClass) => (
          <ViewClassStudent key={onlineClass.id} data={onlineClass} />
        ))}
      </>
    );
  };

  return (
    <Layout>
      <div className='viewclass__student-collection'>
        <div className='breadcrumb-container'>
          <CommonBreadcrumbs
            componentName='Online Class'
            childComponentName='Attend online class'
          />
        </div>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant='standard'
              indicatorColor='primary'
              textColor='primary'
              aria-label='icon label tabs example'
            >
              <Tab
                disabled={loadingStudentOnlineClasses}
                label={<Typography variant='h6'>Upcoming</Typography>}
              />
              <Tab
                disabled={loadingStudentOnlineClasses}
                label={<Typography variant='h6'>Completed</Typography>}
              />
            </Tabs>
          </Grid>
        </Grid>
        {renderUI()}
        <Grid
          container
          spacing={0}
          direction='column'
          alignItems='center'
          justify='center'
        >
          <Grid item xs={12}>
            {studentOnlineClasses.length && !loadingStudentOnlineClasses ? (
              <Pagination
                className='student-view-pagination'
                count={totalPages}
                color='secondary'
                onChange={handlePagination}
                page={currentPage}
              />
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default ViewClassStudentCollection;
