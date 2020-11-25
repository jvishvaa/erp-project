import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import CreateGroup from './containers/communication/create-group/create-group';
import ViewGroup from './containers/communication/view-group/view-group';
import MessageCredit from './containers/communication/message-credit/message-credit';
import SendMessage from './containers/communication/send-message/send-message';
import MessageLog from './containers/communication/message-log/message-log';
import AssignRole from './containers/communication/assign-role/assign-role';
import RoleManagement from './containers/role-management';
import store from './redux/store';
import AlertNotificationProvider from './context-api/alert-context/alert-state';
import './assets/styles/styles.scss';
import UserManagement from './containers/user-management';
import ViewUsers from './containers/user-management/view-users/view-users';
import Login from './containers/login';
import Dashboard from './containers/dashboard';
import { listSubjects } from './redux/actions/academic-mapping-actions';
import OnlineclassViewProvider from './containers/online-class/online-class-context/online-class-state';
import CreateClass from './containers/online-class/create-class';
import ViewClassManagement from './containers/online-class/view-class/view-class-management/view-class-management';
import AttendeeList from './containers/online-class/view-class/view-class-management/attendee-list/attendee-list';
import ViewClassStudentCollection from './containers/online-class/view-class/view-class-student/view-class-student-collection';
import SubjectTable from './containers/master-management/subject-table';
import SectionTable from './containers/master-management/section-table';
import GradeTable from './containers/master-management/grade-table';
import OnlineClassResource from './containers/online-class/online-class-resources/online-class-resource';
import Profile from './containers/profile/profile';
import { fetchLoggedInUserDetails } from './redux/actions';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff6b6b',
    },
    secondary: {
      main: '#014b7e',
    },
    text: {
      default: '#014b7e',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9f9f9',
    },
  },
  typography: {
    fontSize: 16,
    color: '#014b7e',
  },

  overrides: {
    MuiButton: {
      // Name of the rule
      root: {
        // Some CSS
        color: '#ffffff',
        backgroundColor: ' #ff6b6b',
      },
    },
  },
});

function App() {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(listSubjects());
  //   // dispatch(fetchLoggedInUserDetails());
  // }, []);

  return (
    <div className='App'>
      <Router>
        <AlertNotificationProvider>
          <OnlineclassViewProvider>
            <ThemeProvider theme={theme}>
              <Switch>
                <Route path='/profile'>{({ match }) => <Profile match={match} />}</Route>
                <Route path='/role-management'>
                  {({ match }) => <RoleManagement match={match} />}
                </Route>
                <Route path='/user-management'>
                  {({ match }) => <UserManagement match={match} />}
                </Route>
                {/* <Route exact path='/view-users'>
                  {({ match }) => <ViewUsers match={match} />}
                </Route> */}
                <Route path='/communication/messagelog'>
                  {({ match }) => <MessageLog match={match} />}
                </Route>
                <Route path='/dashboard'>
                  {({ match }) => <Dashboard match={match} />}
                </Route>
                <Route exact path='/'>
                  {({ match, history }) => <Login match={match} history={history} />}
                </Route>
                {/* <Route exact path='/assignrole'>
                  {({ match }) => <AssignRole match={match} />}
                </Route> */}
                <Route exact path='/communication/addgroup'>
                  {({ match }) => <CreateGroup match={match} />}
                </Route>
                <Route exact path='/communication/smscredit'>
                  {({ match }) => <MessageCredit match={match} />}
                </Route>
                <Route exact path='/communication/viewgroup'>
                  {({ match }) => <ViewGroup match={match} />}
                </Route>
                <Route exact path='/communication/sendmessage'>
                  {({ match }) => <SendMessage match={match} />}
                </Route>
                <Route exact path='/online-class/create-class'>
                  {({ match }) => <CreateClass match={match} />}
                </Route>
                <Route exact path='/online-class/view-class'>
                  {({ match }) => <ViewClassManagement match={match} />}
                </Route>
                <Route exact path='/online-class/resource'>
                  {({ match }) => <OnlineClassResource match={match} />}
                </Route>
                <Route exact path='/online-class/attendee-list/:id'>
                  {({ match }) => <AttendeeList match={match} />}
                </Route>
                <Route exact path='/online-class/attend-class'>
                  {({ match }) => <ViewClassStudentCollection match={match} />}
                </Route>

                <Route exact path='/master-mgmt/subject-table'>
                  {({ match }) => <SubjectTable match={match} />}
                </Route>
                <Route exact path='/master-mgmt/section-table'>
                  {({ match }) => <SectionTable match={match} />}
                </Route>
                <Route exact path='/master-mgmt/grade-table'>
                  {({ match }) => <GradeTable match={match} />}
                </Route>
              </Switch>
            </ThemeProvider>
          </OnlineclassViewProvider>
        </AlertNotificationProvider>
      </Router>
    </div>
  );
}

export default App;
