import React, { useState, useEffect, Suspense } from 'react';
import Layout from '../Layout';
import Loading from '../../components/loader/loader';
import './style.scss';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isMsAPI } from '../../utility-functions/index';

const TeacherDashboard = React.lazy(() => import('./TeacherDashboard/teacherDashboard'));
const StudentDashboard = React.lazy(() => import('./StudentDashboard/studentDashboard'));
const AdminDashboard = React.lazy(() => import('./AdminDashboard/adminDashboard'));
const PrincipalDashboard = React.lazy(() =>
  import('./PrincipalDashboard/principalDashboard')
);
const DefaultDashboard = React.lazy(() => import('./DefaultDashboard/defaultDashboard'));

const useStyles = makeStyles((theme) => ({
  root: {},
  greeting: {
    fontWeight: 'bold',
  },
  greeting_user: {
    marginLeft: 10,
    marginRight: 15,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    lineHeight: 1.25,
  },
  greeting_user_role: {
    fontStyle: 'italic',
    lineHeight: 2,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const role = userDetails?.personal_info?.role
    ? userDetails.personal_info.role
    : userDetails?.is_superuser
    ? 'super-admin'
    : '';
  const name = (userDetails?.first_name ? userDetails.first_name : 'Buddy').toLowerCase();
  const userLevel = userDetails?.user_level
    ? userDetails.user_level
    : userDetails?.is_superuser
    ? 1
    : '';
  const time = new Date().getHours();
  const greetings =
    time < 12 ? 'Good Morning' : time < 18 ? 'Good Afternoon' : 'Good Evening';
  const [branchIds, setBranchIds] = useState([]);
  const [isMsAPIKey, setIsMsAPIKey] = useState(
    JSON.parse(localStorage.getItem('isMsAPI'))
  );

  useEffect(() => {
    isMsAPI()
      .then((response) => {
        setIsMsAPIKey(response?.data?.result[0]);
      })
      .catch(() => {});
  }, []);

  const renderRoleDashboard = () => {
    if (!isMsAPIKey) {
      return <DefaultDashboard />;
    }
    switch (userLevel) {
      case 1:
        return <AdminDashboard branchIds={branchIds} setBranchIds={setBranchIds} />;
      case 2:
        return <TeacherDashboard branchIds={branchIds} setBranchIds={setBranchIds} />;
      case 3:
        return <TeacherDashboard branchIds={branchIds} setBranchIds={setBranchIds} />;
      // case 4: return <StudentDashboard />
      case 4:
        return <DefaultDashboard />;
      case 5:
        return <DefaultDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <Layout>
      <div
        style={{
          width: '100%',
        }}
      >
        <Box px={3} mt={3} className={classes.root}>
          <Box display='flex' alignItems='flex-end' my={3}>
            <Typography variant='subtitle1' color='secondary'>
              {greetings},
            </Typography>
            <Typography variant='h6' color='secondary' className={classes.greeting_user}>
              {name}
            </Typography>
            <Typography
              variant='caption'
              color='textSecondary'
              className={classes.greeting_user_role}
            >
              ({role})
            </Typography>
          </Box>
          <Suspense fallback={<Loading />}>
            {isMsAPIKey ? renderRoleDashboard() : <DefaultDashboard />}
          </Suspense>
        </Box>
      </div>
    </Layout>
  );
};

export default Dashboard;
