import React, { useContext, useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Typography,
  Grid,
  withStyles,
  TablePagination,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import ViewClassStudent from './view-class-student';
import { OnlineclassViewContext } from '../../online-class-context/online-class-state';
import './view-class-student.scss';
import Layout from '../../../Layout';
import Loader from '../../../../components/loader/loader';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 85,
      width: '80%',
      backgroundColor: '#ff6b6b',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#014b7e',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(0),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const ViewClassStudentCollection = () => {
  const {
    studentView: {
      studentOnlineClasses = [],
      currentPage,
      totalPages,
      count,
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
    dispatch(listOnlineClassesStudentView(roleDetails.erp_user_id, isCompleted, 1, 12));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const handleTabChange = (event, tab) => {
    setCurrentTab(tab);
  };

  const handlePagination = (event, page) => {
    const isCompleted = !!currentTab;

    dispatch(
      listOnlineClassesStudentView(roleDetails.erp_user_id, isCompleted, page + 1, 12)
    );
    // if (page !== currentPage) {
    // }
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
      <Grid container spacing={1} style={{ width: '98%', margin: '0 auto' }}>
        {studentOnlineClasses.map((onlineClass) => (
          <Grid item xs={12} sm={6} md={4}>
            <ViewClassStudent key={onlineClass.id} data={onlineClass} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Layout>
      <div className='breadcrumb-container'>
        <CommonBreadcrumbs
          componentName='Online Class'
          childComponentName='Attend online class'
        />
      </div>
      <div className='viewclass__student-collection'>
        <Grid container className='studentview-tab-container'>
          <Grid item xs={12} sm={6}>
            <StyledTabs
              variant='standard'
              value={currentTab}
              onChange={handleTabChange}
              aria-label='styled tabs example'
            >
              <StyledTab label={<Typography variant='h6'>Upcoming</Typography>} />
              <StyledTab label={<Typography variant='h6'>Completed</Typography>} />
            </StyledTabs>
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
          <Grid item xs={12} sm={3}>
            {studentOnlineClasses.length && !loadingStudentOnlineClasses ? (
              // <Pagination
              //   className='student-view-pagination'
              //   count={totalPages}
              //   color='primary'
              //   onChange={handlePagination}
              //   page={currentPage}
              // />
              <TablePagination
                rowsPerPageOptions={[]}
                count={count}
                color='secondary'
                onChangePage={handlePagination}
                page={currentPage - 1}
                rowsPerPage={12}
                component='div'
                className='student-view-class-pagination'
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
