import React, { useState, Suspense, useEffect } from 'react';
import Loading from '../../components/loader/loader';
import './style.scss';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import WelcomeComponent from './WelcomeComponent/welcome';
import { useDashboardContext } from './dashboard-context';
import axiosInstance from 'config/axios';
import { useHistory } from 'react-router';
import endpoints from 'config/endpoints';
import axios from 'axios';
const TeacherDashboard = React.lazy(() => import('./TeacherDashboard/teacherDashboard'));
const StudentDashboard = React.lazy(() => import('./StudentDashboard/studentDashboard'));
const AdminDashboard = React.lazy(() => import('./AdminDashboard/adminDashboard'));
const OwnerDashboard = React.lazy(() => import('./ownerDashboard/ownerDash'));

const PrincipalDashboard = React.lazy(() =>
  import('./PrincipalDashboard/principalDashboard')
);
const DefaultDashboard = React.lazy(() => import('./DefaultDashboard/defaultDashboard'));

const Dashboard = () => {
  const history = useHistory();
  const [oldDash, setOldDash] = useState(false)
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || [];
  const { username, erp_config } = JSON.parse(localStorage.getItem('userDetails')) || [];

  const checkOldorNew = () => {
    if (!oldDash) {
      setOldDash(true)
    } else {
      setOldDash(false)
    }
  }

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Sure Learning' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Induction Training') {
              if (userLevel === 11) {
                axios
                  .post(endpoints.sureLearning.login, {
                    username: username?.erp,
                  })
                  .then((result) => {
                    localStorage.setItem('udaanDetails', JSON.stringify(result.data));
                  })
                  .catch((error) => { });
              }
            }
          });
        }
      });
    }
    if (history?.location?.state?.oldView) {
      if (history?.location?.state?.oldView === true) {
        setOldDash(true)
      }
    }
  }, []);

  const {
    welcomeDetails: { userLevel = 5 },
  } = useDashboardContext();

  const isMsAPIKey = useSelector((state) => state.commonFilterReducer?.isMsAPIKey);
  const is_erp = useSelector((state) => state.commonFilterReducer?.erpConFigKey);


  const renderRoleDashboard = () => {
   
      switch (userLevel) {
        case 1:
          // return <OwnerDashboard />;
          if( erp_config){
            if (oldDash) {
              return <AdminDashboard />
            }
            if (!oldDash) {
              return <OwnerDashboard />
            }
          } else {
  
            return <AdminDashboard />;
          }
        case 4:
          if( erp_config){
          if (oldDash) {
            return <AdminDashboard />
          }
          if (!oldDash) {
            return <OwnerDashboard />
          }
        } else {

          return <AdminDashboard />;
        }
        case 8:
          // return <OwnerDashboard />;
          if( erp_config){
            if (oldDash) {
              return <PrincipalDashboard />
            }
            if (!oldDash) {
              return <OwnerDashboard />
            }
          } else {
  
            return <PrincipalDashboard />;
          }
        case 11:
          return <TeacherDashboard />;
        case 13:
          return <StudentDashboard />; // to be replaced with student dashboard
        case 5:
          return <DefaultDashboard />;
        case 10:
          // return <OwnerDashboard />;
          if( erp_config){
            if (oldDash) {
              return <PrincipalDashboard />
            }
            if (!oldDash) {
              return <OwnerDashboard />
            }
          } else {
  
            return <PrincipalDashboard />;
          }
        default:
          return <DefaultDashboard />;
      }
  };



  return (
    <Box px={3} mt={1}>
      <WelcomeComponent erp_config={erp_config} checkOldorNew={checkOldorNew} oldDash={oldDash} />
      <Suspense fallback={<Loading />}>
        {isMsAPIKey ? renderRoleDashboard() : <DefaultDashboard />}
        {/* {true ? renderRoleDashboard() : <DefaultDashboard />} */}
      </Suspense>
    </Box>
  );
};

export default Dashboard;
