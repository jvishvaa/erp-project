import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import CreateGroup from './containers/communication/create-group/create-group';
import ViewGroup from './containers/communication/view-group/view-group';
import MessageCredit from './containers/communication/message-credit/message-credit';
import SendMessage from './containers/communication/send-message/send-message';
import MessageLog from './containers/communication/message-log/message-log';
import StudentHomework from './containers/homework/student-homework/student-homework';
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
import SubjectTable from './containers/master-management/subject/subject-table';
import SectionTable from './containers/master-management/section/section-table';
import GradeTable from './containers/master-management/grade/grade-table';
import AcademicYearTable from './containers/master-management/academic-year/academic-year-table';
import MessageTypeTable from './containers/master-management/message-type/message-type-table';
import OnlineClassResource from './containers/online-class/online-class-resources/online-class-resource';
import HomeworkCard from './containers/homework/homework-card';
import Profile from './containers/profile/profile';
import { fetchLoggedInUserDetails } from './redux/actions';
import TeacherHomework from './containers/homework/teacher-homework';
import HomeworkAdmin from './containers/homework/homework-admin';
import AddHomework from './containers/homework/teacher-homework/add-homework';
import BulkUpload from './containers/user-management/bulk-upload/bulk-upload';
import CoordinatorHomework from './containers/homework/coordinator-homework';
import AddHomeworkCoord from './containers/homework/coordinator-homework/add-homework';
import LessonReport from './containers/lesson-plan/lesson-plan-report';
import LessonPlan from './containers/lesson-plan/lesson-plan-view';
import LessonPlanGraphReport from './containers/lesson-plan/lesson-plan-graph-report';

import Discussionforum from './containers/discussionForum/discussionForum';
import  CreateCategory from './containers/discussionForum/createCategory';
import EditCategory from './containers/discussionForum/editCategory'
import CreateDiscussionForum from './containers/discussionForum/createDiscussionForum';

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
                <Route exact path='/master-mgmt/academic-year-table'>
                  {({ match }) => <AcademicYearTable match={match} />}
                </Route>
                <Route exact path='/master-mgmt/message-type-table'>
                  {({ match }) => <MessageTypeTable match={match} />}
                </Route>

                <Route exact path='/homework/homework-card'>
                  {({ match }) => <HomeworkCard match={match} />}
                </Route>

                <Route exact path='/homework/student'>
                  {({ match }) => <StudentHomework match={match} />}
                </Route>
                <Route exact path='/homework/teacher'>
                  {({ match }) => <TeacherHomework match={match} />}
                </Route>
                <Route exact path='/homework/add/:date/:subject/:id'>
                  {({ match }) => <AddHomework match={match} />}
                </Route>
                <Route exact path='/homework/admin'>
                  {({ match }) => <HomeworkAdmin match={match} />}
                </Route>
                <Route exact path='/homework/coordinator'>
                  {/* added by Vijay to display particular teacher details */}
                  {({ match }) => <CoordinatorHomework match={match} />}
                </Route>
                <Route exact path='/homework/cadd/:date/:subject/:id/:coord_selected_teacher_id'>
                  {({ match }) => <AddHomeworkCoord match={match} />}
                </Route>
                <Route exact path='/lesson-plan/report'>
                {({ match }) => <LessonReport match={match} />}
                 </Route>
                <Route exact path='/lesson-plan/view'>
                  {({ match }) => <LessonPlan match={match} />}
                </Route>
                <Route exact path='/lesson-plan/graph-report'>
                  {({ match }) => <LessonPlanGraphReport match={match} />}
                  </Route>
                <Route exact path='/discussion-forum'>
                  {({ match }) => <Discussionforum match={match} />}
                </Route>
                <Route exact path='/category/create'>
                  {({ match }) => <CreateCategory match={match} />}
                </Route>
                <Route exact path='/category/edit'>
                  {({ match }) => <EditCategory match={match} />}
                </Route>
                <Route exact path='/discussion-forum/create'>
                  {({ match }) => <CreateDiscussionForum match={match} />}
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
