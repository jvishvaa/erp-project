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
import { isDeveloper } from 'components/utils/checkDeveloper';
const TeacherDashboard = React.lazy(() => import('./TeacherDashboard/teacherDashboard'));
const StudentDashboard = React.lazy(() => import('./StudentDashboard/studentDashboard'));
const AdminDashboard = React.lazy(() => import('./AdminDashboard/adminDashboard'));
const OwnerDashboard = React.lazy(() => import('./ownerDashboard/ownerDash'));
const TeacherDash2 = React.lazy(() =>
  import('./TeacherDashboardTwo/DashboardTeacher/TeacherDashboard')
);
// const TeacherDashboardTwo = React.lazy(() =>
//   import('./TeacherDashboardTwo/DashboardTeacher/TeacherDashboardTwo')
// );

const PrincipalDashboard = React.lazy(() =>
  import('./PrincipalDashboard/principalDashboard')
);
const DefaultDashboard = React.lazy(() => import('./DefaultDashboard/defaultDashboard'));

const Dashboard = () => {
  const history = useHistory();
  const [oldDash, setOldDash] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || [];
  const { erp, username, erp_config } =
    JSON.parse(localStorage.getItem('userDetails')) || [];
  const [buttonCounter, setButtonCounter] = useState(1)
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
              if (userLevel === 11 || userLevel === 23 || userLevel === 10) {
                axios
                  .post(endpoints.sureLearning.login, {
                    username: erp ? erp : username,
                  })
                  .then((result) => {
                    localStorage.setItem('udaanDetails', JSON.stringify(result.data));
                  })
                  .catch((error) => {});
              }
            }
          });
        }
      });
    }
    if (history?.location?.state?.oldView) {
      if (history?.location?.state?.oldView === true) {
        setOldDash(true);
      }
    }
  }, []);

  const {
    welcomeDetails: { userLevel = 5 },
  } = useDashboardContext();

  const isDev = isDeveloper();
  const isMsAPIKey = useSelector((state) => state.commonFilterReducer?.isMsAPIKey);
  const is_erp = useSelector((state) => state.commonFilterReducer?.erpConFigKey);
  const getDashboardChoice = (dash1, dash2) => {
    if (erp_config) {
      if (buttonCounter === 1) {
        return dash1;
      }
      if (buttonCounter === 2) {
        return dash2;
      }
    } else {
      return dash1;
    }
  };

  const changeView = (e) => {
    setButtonCounter(e);
  };

  useEffect(() => {
    if(history?.location?.counter){
      setButtonCounter(2);
    }
  }, [history]);

  const renderRoleDashboard = () => {
    switch (userLevel) {
      case 1:
        const GetDashboard = getDashboardChoice(AdminDashboard, OwnerDashboard);
        return <GetDashboard />;
      case 4:
        const GetOwnerDashboard = getDashboardChoice(AdminDashboard, OwnerDashboard);
        return <GetOwnerDashboard />;
      case 8:
        const GetPrincipalDashboard = getDashboardChoice(
          PrincipalDashboard,
          OwnerDashboard
        );
        return <GetPrincipalDashboard />;
      case 11:
        const GetTeacherDashboard = getDashboardChoice(TeacherDashboard, TeacherDash2);
        return <GetTeacherDashboard />;
      case 13:
        return <StudentDashboard />; // to be replaced with student dashboard
      case 5:
        return <DefaultDashboard />;
      case 10:
        const GetCoordiDashboard = getDashboardChoice(PrincipalDashboard, OwnerDashboard);
        return <GetCoordiDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <Box px={3} mt={1}>
      <WelcomeComponent erp_config={erp_config} isMsAPIKey={isMsAPIKey} changeView={changeView} buttonCounter={buttonCounter} />
      <Suspense fallback={<Loading />}>
        {isMsAPIKey ? renderRoleDashboard() : <DefaultDashboard />}
        {/* {true ? renderRoleDashboard() : <DefaultDashboard />} */}
      </Suspense>
    </Box>
  );
};

export default Dashboard;
