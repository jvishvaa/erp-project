import React, { useState, Suspense, useEffect } from 'react';
import Loading from '../../components/loader/loader';
import './style.scss';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import WelcomeComponent from './WelcomeComponent/welcome';
import { useDashboardContext } from './dashboard-context';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import axios from 'axios';
const TeacherDashboard = React.lazy(() => import('./TeacherDashboard/teacherDashboard'));
const StudentDashboard = React.lazy(() => import('./StudentDashboard/studentDashboard'));
const AdminDashboard = React.lazy(() => import('./AdminDashboard/adminDashboard'));
const PrincipalDashboard = React.lazy(() =>
  import('./PrincipalDashboard/principalDashboard')
);
const DefaultDashboard = React.lazy(() => import('./DefaultDashboard/defaultDashboard'));

const Dashboard = () => {
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || [];
  const username = JSON.parse(localStorage.getItem('userDetails')) || [];
  console.log(username.erp , "us");

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Sure Learning'  &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Induction Training') { 
            if(username.erp !== 'super_admin_OLV'){
            axios
            .post(endpoints.sureLearning.login, {
              username: username?.erp,
            })
            .then((result) => {
              console.log(result);
              localStorage.setItem('udaanDetails', JSON.stringify(result.data));
            })
            .catch((error) => {
              console.log(error);
            });
          }
            console.log("matcheddddd");
          }
        })
      }
    })
  }
  },[])

  const {
    welcomeDetails: { userLevel = 4 },
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
