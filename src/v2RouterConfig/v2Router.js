import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AlertNotificationProvider from 'context-api/alert-context/alert-state';
import OnlineclassViewProvider from 'containers/online-class/online-class-context/online-class-state';
import AttachmentPreviewer from 'components/attachment-previewer';
import CircularStore from 'containers/circular/context/CircularStore';
import GeneralDairyStore from 'containers/general-dairy/context/context';
import ViewStore from 'containers/master-management/course/view-course/context/ViewStore';
import Profile from 'containers/profile/profile';
import DailyDairyStore from 'containers/daily-dairy/context/context';
import { isMsAPI, erpConfig } from 'redux/actions';
import Login from 'containers/login';
import { themeGenerator } from '../utility-functions/themeGenerator';
import SuperAdmindashboardNew from 'v2/FaceLift/SuperAdminDashboard';
import '../../src/v2/Assets/css/common.scss';
import '../../src/v2/Assets/css/measurement.scss';
import '../../src/v2/Assets/css/styles.scss';
import TeacherdashboardNew from 'v2/FaceLift/TeacherDashboard';
import GradeWiseAttendance from 'v2/FaceLift/TeacherDashboard/containers/Attendance/GradeWiseAttendance';
import SectionWiseAttendance from 'v2/FaceLift/TeacherDashboard/containers/Attendance/SectionWiseAttendance';
import ClassworkReport from 'v2/FaceLift/TeacherDashboard/containers/ClassworkReport/ClassworkReport';
import SubjectwiseClassworkReport from 'v2/FaceLift/TeacherDashboard/containers/ClassworkReport/SubjectwiseClassworkReport';
import Classworks from 'v2/FaceLift/TeacherDashboard/containers/ClassworkReport/Classworks';
import StudentwiseClassworkReport from 'v2/FaceLift/TeacherDashboard/containers/ClassworkReport/StudentwiseClassworkReport';
import HomeworkReport from 'v2/FaceLift/TeacherDashboard/containers/HomeworkReport/HomeworkReport';
import SubjectwiseHomeworkReport from 'v2/FaceLift/TeacherDashboard/containers/HomeworkReport/SubjectwiseHomeworkReport';
import Homeworks from 'v2/FaceLift/TeacherDashboard/containers/HomeworkReport/Homeworks';
import StudentwiseHomeworkReport from 'v2/FaceLift/TeacherDashboard/containers/HomeworkReport/StudentwiseHomeworkReport';
import Assessment from 'v2/FaceLift/TeacherDashboard/containers/Assessment/Assessment';
import SubjectwiseAssessment from 'v2/FaceLift/TeacherDashboard/containers/Assessment/SubjectwiseAssessment';
import Tests from 'v2/FaceLift/TeacherDashboard/containers/Assessment/Tests';
import StudentPerformance from 'v2/FaceLift/TeacherDashboard/containers/Assessment/StudentPerformance';
import CurriculumCompletion from 'v2/FaceLift/TeacherDashboard/containers/Curriculum/CurriculumCompletion';
import SubjectwiseCurriculumReport from 'v2/FaceLift/TeacherDashboard/containers/Curriculum/SubjectwiseCurriculum';
import ChapterwiseCurriculumReport from 'v2/FaceLift/TeacherDashboard/containers/Curriculum/ChapterwiseCurriculum';
import TeacherHomework from 'v2/FaceLift/TeacherDashboard/containers/TeacherHomework/TeacherHomework';
import StudentwiseHomework from 'v2/FaceLift/TeacherDashboard/containers/TeacherHomework/StudentwiseHomework';
import AssignHomework from 'v2/FaceLift/TeacherDashboard/containers/TeacherHomework/AssignHomework';
import AnnouncementList from 'v2/FaceLift/Announcement/announcementList';
import CreateAnnouncement from 'v2/FaceLift/Announcement/CreateAnnouncement/CreateAnnouncement';
import LessonPlan from 'v2/FaceLift/LessonPlan';
import StudentDashboardNew from 'v2/FaceLift/StudentDashboard';
import V1Router from './v1RouterConst';
import AcadCalendar from 'containers/academicCalendar/fullcalendar/acadCalendar';
import CalendarView from 'v2/FaceLift/CalendarView/CalendarView';

const V2Router = () => {
  useEffect(() => {
    isMsAPI();
    erpConfig();
  }, []);
  const [theme, setTheme] = useState(() => themeGenerator());
  const { user_level: userLevel } = JSON.parse(localStorage.getItem('userDetails')) || '';

  return (
    <Router>
      <AlertNotificationProvider>
        <OnlineclassViewProvider>
          <ThemeProvider theme={theme}>
            <AttachmentPreviewer>
              <CircularStore>
                <GeneralDairyStore>
                  <ViewStore>
                    <DailyDairyStore>
                      <Switch>
                        <Route exact path='/'>
                          {({ match, history }) => (
                            <Login match={match} history={history} setTheme={setTheme} />
                          )}
                        </Route>
                        <Route path='/profile'>
                          {({ match }) => <Profile match={match} />}
                        </Route>
                        <Route path='/dashboard'>
                          {({ match }) => {
                            switch (userLevel) {
                              case 1:
                                return <SuperAdmindashboardNew match={match} />;

                              case 4:
                                return <SuperAdmindashboardNew match={match} />;
                              case 8:
                                return <SuperAdmindashboardNew match={match} />;

                              case 11:
                                return <TeacherdashboardNew />;
                              case 13:
                                return <StudentDashboardNew />; // to be replaced with student dashboard
                              case 5:
                              // return <DefaultDashboard />;
                              case 10:
                                return <SuperAdmindashboardNew match={match} />;
                              default:
                                return <AcadCalendar match={match} />;
                            }
                          }}
                        </Route>
                        <Route path='/calendar-view'>
                          {({ match }) => <CalendarView match={match} />}
                        </Route>
                        {/* Teacher Routes */}
                        <Route path='/teacher-dashboard'>
                          {({ match }) => <TeacherdashboardNew match={match} />}
                        </Route>{' '}
                        <Route path='/gradewise-attendance'>
                          {({ match }) => <GradeWiseAttendance match={match} />}
                        </Route>{' '}
                        <Route path='/sectionwise-attendance'>
                          {({ match }) => <SectionWiseAttendance match={match} />}
                        </Route>
                        <Route path='/classwork-report'>
                          {({ match }) => <ClassworkReport match={match} />}
                        </Route>
                        <Route path='/subjectwise-classwork-report'>
                          {({ match }) => <SubjectwiseClassworkReport match={match} />}
                        </Route>
                        <Route path='/titlewise-classwork-report'>
                          {({ match }) => <Classworks match={match} />}
                        </Route>
                        <Route path='/studentwise-classwork-report'>
                          {({ match }) => <StudentwiseClassworkReport match={match} />}
                        </Route>
                        <Route path='/homework-report'>
                          {({ match }) => <HomeworkReport match={match} />}
                        </Route>
                        <Route path='/subjectwise-homework-report'>
                          {({ match }) => <SubjectwiseHomeworkReport match={match} />}
                        </Route>
                        <Route path='/titlewise-homework-report'>
                          {({ match }) => <Homeworks match={match} />}
                        </Route>
                        <Route path='/studentwise-homework-report'>
                          {({ match }) => <StudentwiseHomeworkReport match={match} />}
                        </Route>
                        <Route path='/assessment-report'>
                          {({ match }) => <Assessment match={match} />}
                        </Route>
                        <Route path='/subjectwise-assessment-report'>
                          {({ match }) => <SubjectwiseAssessment match={match} />}
                        </Route>
                        <Route path='/tests-report'>
                          {({ match }) => <Tests match={match} />}
                        </Route>
                        <Route path='/studentwise-assessment-report'>
                          {({ match }) => <StudentPerformance match={match} />}
                        </Route>
                        <Route path='/curriculum-report'>
                          {({ match }) => <CurriculumCompletion match={match} />}
                        </Route>
                        <Route path='/subjectwise-curriculum-report'>
                          {({ match }) => <SubjectwiseCurriculumReport match={match} />}
                        </Route>
                        <Route path='/chapterwise-curriculum-report'>
                          {({ match }) => <ChapterwiseCurriculumReport match={match} />}{' '}
                        </Route>
                        <Route path='/announcement-list'>
                          {({ match }) => <AnnouncementList match={match} />}
                        </Route>
                        <Route path='/create-announcement'>
                          {({ match }) => <CreateAnnouncement match={match} />}
                        </Route>
                        <Route path='/teacher-homework'>
                          {({ match }) => <TeacherHomework match={match} />}
                        </Route>
                        <Route path='/teacher-homework-students'>
                          {({ match }) => <StudentwiseHomework match={match} />}
                        </Route>
                        <Route path='/assign-homework'>
                          {({ match }) => <AssignHomework match={match} />}
                        </Route>
                        <Route path='/lesson-plan'>
                          {({ match }) => <LessonPlan match={match} />}
                        </Route>
                        {/* Student Routes */}
                        <Route path='/student-dashboard'>
                          {({ match }) => <StudentDashboardNew match={match} />}
                        </Route>
                        {/* v1 router */}
                        {V1Router?.map((item) => {
                          return item;
                        })}
                      </Switch>
                    </DailyDairyStore>
                  </ViewStore>
                </GeneralDairyStore>
              </CircularStore>
            </AttachmentPreviewer>
          </ThemeProvider>
        </OnlineclassViewProvider>
      </AlertNotificationProvider>
    </Router>
  );
};

export default V2Router;
