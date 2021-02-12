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
// import OnlineClassResource from './containers/online-class/online-class-resources/online-class-resource';
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
import Assessment from './containers/assessment';
import ViewAssessment from './containers/assessment/viewAssessment';
import {
  TeacherBlog,
  ContentView,
  ContentViewAdmin,
  ContentViewPrincipal,
  WriteBlog,
  EditBlog,
  PreviewBlog,
  PreviewEditBlog,
  CreateWordCountConfig,
  StudentDashboard,
  TeacherPublishBlogView,
  BlogView,
  CreateGenre,
  ViewGenre,
  ContentViewPublish,
  ContentViewPublishStudent,
  EditGenre,
  AdminBlog,
  PrincipalBlog,
  PrincipalPublishBlogView,
  StudentPublishBlogView,
  AdminPublishBlogView,
  ContentViewPublishAdmin,
  ContentViewPublishPrincipal,
  EditWordCountConfig,
} from './containers/blog';
import LessonPlanGraphReport from './containers/lesson-plan/lesson-plan-graph-report';
import Discussionforum from './containers/discussionForum/index';
import CreateCategory from './containers/discussionForum/createCategory';
import CreateDiscussionForum from './containers/discussionForum/createDiscussionForum';
import CircularList from './containers/circular';
import CreateCircular from './containers/circular/create-circular';
import CircularStore from './containers/circular/context/CircularStore';
import GeneralDairyStore from './containers/general-dairy/context/context';
import Subjectgrade from './containers/subjectGradeMapping';
import ListandFilter from './containers/subjectGradeMapping/listAndFilter';
import GeneralDairyList from './containers/general-dairy';
import GeneralDairyStudentView from './containers/general-dairy/generalDairyStudentView';
import GeneralDairyStudentList from './containers/general-dairy/generalDairyStudnet';
import CreateGeneralDairy from './containers/general-dairy/create-dairy';
import CreateDailyDairy from './containers/daily-dairy/create-daily-dairy';
import DailyDairyList from './containers/daily-dairy/list-daily-dairy';
import AOLClassView from './containers/online-class/aol-view/index';
import ResourceView from './containers/online-class/online-class-resources/index';

import CreateCourse from './containers/master-management/course/create-course';
import CourseView from './containers/master-management/course/view-course';
import ViewCourseCard from './containers/master-management/course/view-course/view-more-card/ViewCourseCard';
import ViewStore from './containers/master-management/course/view-course/context/ViewStore';
import DailyDairyStore from './containers/daily-dairy/context/context';
import AttendeeListRemake from './containers/attendance';
import TestComparisionUI from './containers/assessment-report/test-comparision';
import AssessmentAnalysis from './containers/assessment-report/assessment-analysis';

import StudentStrength from './containers/student-strength';
import StudentIdCard from './containers/student-Id-Card';
import SignatureUpload from './containers/signature-upload';
import TeacherBatchView from './containers/teacherBatchView';

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
              <CircularStore>
                <GeneralDairyStore>
                  <ViewStore>
                    <DailyDairyStore>
                      <Switch>
                        <Route path='/profile'>
                          {({ match }) => <Profile match={match} />}
                        </Route>
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
                          {({ match, history }) => (
                            <Login match={match} history={history} />
                          )}
                        </Route>
                        {/* <Route exact path='/assignrole'>
                  {({ match }) => <AssignRole match={match} />}
                </Route> */}
                        <Route exact path='/blog/genre'>
                          {({ match }) => <CreateGenre match={match} />}
                        </Route>
                        <Route exact path='/blog/genre/edit'>
                          {({ match }) => <EditGenre match={match} />}
                        </Route>

                        <Route exact path='/blog/wordcount-config'>
                          {({ match }) => <CreateWordCountConfig match={match} />}
                        </Route>
                        <Route exact path='/blog/wordcount-config/edit'>
                          {({ match }) => <EditWordCountConfig match={match} />}
                        </Route>

                        <Route exact path='/blog/teacher'>
                          {({ match }) => <TeacherBlog match={match} />}
                        </Route>
                        <Route exact path='/blog/admin'>
                          {({ match }) => <AdminBlog match={match} />}
                        </Route>
                        <Route exact path='/blog/principal'>
                          {({ match }) => <PrincipalBlog match={match} />}
                        </Route>
                        <Route exact path='/blog/teacher/contentView'>
                          {({ match }) => <ContentView match={match} />}
                        </Route>
                        <Route exact path='/blog/principal/contentView'>
                          {({ match }) => <ContentViewPrincipal match={match} />}
                        </Route>
                        <Route exact path='/blog/admin/contentView'>
                          {({ match }) => <ContentViewAdmin match={match} />}
                        </Route>
                        <Route exact path='/blog/teacher/contentViewPublish'>
                          {({ match }) => <ContentViewPublish match={match} />}
                        </Route>
                        <Route exact path='/blog/student/contentViewPublishStudent'>
                          {({ match }) => <ContentViewPublishStudent match={match} />}
                        </Route>
                        <Route exact path='/blog/principal/contentViewPublishPrincipal'>
                          {({ match }) => <ContentViewPublishPrincipal match={match} />}
                        </Route>
                        <Route exact path='/blog/admin/contentViewPublishAdmin'>
                          {({ match }) => <ContentViewPublishAdmin match={match} />}
                        </Route>

                        <Route exact path='/blog/teacher/publish/view'>
                          {({ match }) => <TeacherPublishBlogView match={match} />}
                        </Route>
                        <Route exact path='/blog/admin/publish/view'>
                          {({ match }) => <AdminPublishBlogView match={match} />}
                        </Route>
                        <Route exact path='/blog/student/publish/view'>
                          {({ match }) => <StudentPublishBlogView match={match} />}
                        </Route>
                        <Route exact path='/blog/principal/publish/view'>
                          {({ match }) => <PrincipalPublishBlogView match={match} />}
                        </Route>
                        <Route exact path='/blog/student/dashboard'>
                          {({ match }) => <StudentDashboard match={match} />}
                        </Route>
                        <Route exact path='/blog/student/write-blog'>
                          {({ match }) => <WriteBlog match={match} />}
                        </Route>
                        <Route exact path='/blog/student/edit-blog'>
                          {({ match }) => <EditBlog match={match} />}
                        </Route>

                        <Route exact path='/blog/student/preview-blog'>
                          {({ match }) => <PreviewBlog match={match} />}
                        </Route>
                        <Route exact path='/blog/student/preview-edit-blog'>
                          {({ match }) => <PreviewEditBlog match={match} />}
                        </Route>
                        <Route exact path='/blog/student/view-blog'>
                          {({ match }) => <BlogView match={match} />}
                        </Route>
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
                        {/* <Route exact path='/online-class/view-class'>
                      {({ match }) => <ViewClassManagement match={match} />}
                    </Route> */}
                        {/* <Route exact path='/online-class/resource'>
                      {({ match }) => <OnlineClassResource match={match} />}
                    </Route> */}
                        <Route exact path='/online-class/attendee-list/:id'>
                          {({ match }) => <AttendeeList match={match} />}
                        </Route>
                        {/* <Route exact path='/online-class/attend-class'>
                          {({ match }) => <AOLClassView match={match} />}
                        </Route> */}
                        {/* {({ match }) => <ViewClassStudentCollection match={match} />} */}
                        <Route exact path='/online-class/resource'>
                          {({ match }) => <ResourceView match={match} />}
                        </Route>
                        <Route exact path='/online-class/view-class'>
                          {({ match }) => <AOLClassView match={match} />}
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
                        <Route exact path='/master-mgmt/subject/grade/mapping'>
                          {({ match }) => <Subjectgrade match={match} />}
                        </Route>
                        <Route exact path='/subject/grade'>
                          {({ match }) => <ListandFilter match={match} />}
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
                        <Route
                          exact
                          path='/homework/cadd/:date/:subject/:id/:coord_selected_teacher_id'
                        >
                          {({ match }) => <AddHomeworkCoord match={match} />}
                        </Route>
                        <Route exact path='/lesson-plan/teacher-view'>
                          {({ match }) => <LessonPlan match={match} />}
                        </Route>
                        <Route exact path='/lesson-plan/student-view'>
                          {({ match }) => <LessonPlan match={match} />}
                        </Route>
                        <Route exact path='/lesson-plan/report'>
                          {({ match }) => <LessonReport match={match} />}
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
                        <Route exact path='/discussion-forum/create'>
                          {({ match }) => <CreateDiscussionForum match={match} />}
                        </Route>
                        <Route exact path='/circular'>
                          {({ match }) => <CircularList match={match} />}
                        </Route>
                        <Route exact path='/create-circular'>
                          {({ match }) => <CreateCircular match={match} />}
                        </Route>
                        <Route exact path='/general-dairy'>
                          {({ match }) => <GeneralDairyList match={match} />}
                        </Route>
                        <Route exact path='/dairy/student'>
                          {({ match }) => <GeneralDairyList match={match} />}
                        </Route>
                        <Route exact path='/dairy/teacher'>
                          {({ match }) => <GeneralDairyList match={match} />}
                        </Route>
                        <Route exact path='/general-dairy/student-view'>
                          {({ match }) => <GeneralDairyStudentList match={match} />}
                        </Route>
                        <Route exact path='/create/general-dairy'>
                          {({ match }) => <CreateGeneralDairy match={match} />}
                        </Route>
                        <Route exact path='/daily-dairy'>
                          {({ match }) => <DailyDairyList match={match} />}
                        </Route>
                        <Route exact path='/create/daily-dairy'>
                          {({ match }) => <CreateDailyDairy match={match} />}
                        </Route>
                        <Route exact path='/create/course'>
                          {({ match }) => <CreateCourse match={match} />}
                        </Route>
                        <Route exact path='/course-list'>
                          {({ match }) => <CourseView match={match} />}
                        </Route>
                        <Route exact path='/view-period'>
                          {({ match }) => <ViewCourseCard match={match} />}
                        </Route>
                        <Route exact path='/assessment/test-comparision'>
                          {({ match }) => <TestComparisionUI match={match} />}
                        </Route>
                        <Route exact path='/assessment/:assessmentId/analysis'>
                          {({ match }) => <AssessmentAnalysis match={match} />}
                        </Route>
                        <Route exact path='/aol-attendance-list/:id?'>
                          {({ match }) => <AttendeeListRemake match={match} />}
                        </Route>
                        <Route exact path='/assessment'>
                          {({ match }) => <Assessment match={match} />}
                        </Route>
                        <Route exact path='/assessment/view-assessment'>
                          {({ match }) => <ViewAssessment match={match} />}
                        </Route>

                        <Route exact path='/student-strength'>
                          {({ match }) => <StudentStrength match={match} />}
                        </Route>
                        <Route exact path='/student-id-card'>
                          {({ match }) => <StudentIdCard match={match} />}
                        </Route>
                        <Route exact path='/master-mgmt/signature-upload'>
                          {({ match }) => <SignatureUpload match={match} />}
                        </Route>
                        <Route exact path='/online-class/attend-class'>
                          {({ match }) => <TeacherBatchView match={match} />}
                        </Route>
                        <Route exact path='/online-class/teacher-view-class'>
                          {({ match }) => <TeacherBatchView match={match} />}
                        </Route>
                      </Switch>
                    </DailyDairyStore>
                  </ViewStore>
                </GeneralDairyStore>
              </CircularStore>
            </ThemeProvider>
          </OnlineclassViewProvider>
        </AlertNotificationProvider>
      </Router>
    </div>
  );
}

export default App;
