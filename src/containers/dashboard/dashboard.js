import React, { useState, Suspense } from 'react';
import Loading from '../../components/loader/loader';
import './style.scss';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import WelcomeComponent from './WelcomeComponent/welcome';
import { useDashboardContext } from './dashboard-context';
const TeacherDashboard = React.lazy(() => import('./TeacherDashboard/teacherDashboard'));
const StudentDashboard = React.lazy(() => import('./StudentDashboard/studentDashboard'));
const AdminDashboard = React.lazy(() => import('./AdminDashboard/adminDashboard'));
const PrincipalDashboard = React.lazy(() =>
  import('./PrincipalDashboard/principalDashboard')
);
const DefaultDashboard = React.lazy(() => import('./DefaultDashboard/defaultDashboard'));

const Dashboard = () => {
  const {
    welcomeDetails: { userLevel },
  } = useDashboardContext();

  const isMsAPIKey = useSelector((state) => state.commonFilterReducer?.isMsAPIKey);

  const renderRoleDashboard = () => {
    if (!isMsAPIKey) {
      return <DefaultDashboard />;
    }
    switch (userLevel) {
      case 1:
        return <AdminDashboard />;
      case 2:
        return <PrincipalDashboard />;
      case 3:
        return <TeacherDashboard />;
      case 4:
        return <DefaultDashboard />; // to be replaced with student dashboard
      case 5:
        return <DefaultDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <Box px={3} mt={3}>
      <WelcomeComponent />
      <Suspense fallback={<Loading />}>
        {isMsAPIKey ? renderRoleDashboard() : <DefaultDashboard />}
      </Suspense>
    </Box>
  );
};

export default Dashboard;
