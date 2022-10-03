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
import AnnouncementList from 'v2/FaceLift/Announcement/announcementList';
import CreateAnnouncement from 'v2/FaceLift/Announcement/CreateAnnouncement/CreateAnnouncement';
import StudentDashboardNew from 'v2/FaceLift/StudentDashboard';
import V1Router from './v1RouterConst';
import AcadCalendar from 'containers/academicCalendar/fullcalendar/acadCalendar';
import Diary from 'v2/FaceLift/Diary';
import DailyDiary from 'v2/FaceLift/Diary/DailyDiary';
import GeneralDiary from 'v2/FaceLift/Diary/GeneralDiary';
import GradeWiseAttendance from 'v2/FaceLift/TeacherDashboard/containers/Attendance/GradeWiseAttendance';
import SectionWiseAttendance from 'v2/FaceLift/TeacherDashboard/containers/Attendance/SectionWiseAttendance';
import ReportConfigTable from 'containers/assessment-central/ReportCardConfig/ReportConfigTable';
import CreateReportConfig from 'containers/assessment-central/ReportCardConfig/CreateReportConfig';
import RoleWiseAttendance from 'v2/FaceLift/TeacherDashboard/containers/Attendance/RoleWiseAttendance';
import BranchWiseAttendance from 'v2/FaceLift/TeacherDashboard/containers/Attendance/BranchWiseAttendance';
import StaffAttendance from 'v2/FaceLift/TeacherDashboard/containers/Attendance/staffAttendance';
import LessonPlan from 'v2/FaceLift/LessonPlan';
import LessonPlanView from 'v2/FaceLift/LessonPlan/LessonPlanView';
import StudentAttendanceDashboard from 'v2/FaceLift/StudentDashboard/StudentAttendanceDashboard';

const V2Router = () => {
  useEffect(() => {
    isMsAPI();
    erpConfig();
  }, []);
  const [theme, setTheme] = useState(() => themeGenerator());
  let { user_level: userLevel } = JSON.parse(localStorage.getItem('userDetails')) || '';
  const { is_superuser: superuser } =
    JSON.parse(localStorage.getItem('userDetails')) || '';
  if (superuser == true) {
    userLevel = 1;
  }

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
                              case 2:
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
                        <Route path='/student-attendance-dashboard'>
                          {({ match }) => <StudentAttendanceDashboard match={match} />}
                        </Route>
                        <Route path='/announcement-list'>
                          {({ match }) => <AnnouncementList match={match} />}
                        </Route>
                        <Route path='/create-announcement'>
                          {({ match }) => <CreateAnnouncement match={match} />}
                        </Route>
                        <Route path='/diary/teacher'>
                          {({ match }) => <Diary match={match} />}
                        </Route>
                        <Route path='/create/daily-diary'>
                          {({ match }) => <DailyDiary match={match} />}
                        </Route>
                        <Route path='/create/general-diary'>
                          {({ match }) => <GeneralDiary match={match} />}
                        </Route>
                        <Route path='/gradewise-attendance'>
                          {({ match }) => <GradeWiseAttendance match={match} />}
                        </Route>{' '}
                        <Route path='/rolewise-attendance'>
                          {({ match }) => <RoleWiseAttendance match={match} />}
                        </Route>
                        <Route path='/branchwise-attendance'>
                          {({ match }) => <BranchWiseAttendance match={match} />}
                        </Route>
                        <Route path='/Staff-attendance'>
                          {({ match }) => <StaffAttendance match={match} />}
                        </Route>
                        <Route path='/sectionwise-attendance'>
                          {({ match }) => <SectionWiseAttendance match={match} />}
                        </Route>
                        <Route exact path='/assessment/report-config'>
                          {({ match }) => <ReportConfigTable match={match} />}
                        </Route>
                        <Route exact path='/report-config/create'>
                          {({ match }) => <CreateReportConfig match={match} />}
                        </Route>
                        <Route path='/lesson-plan/teacher-view/list-view'>
                          {({ match }) => <LessonPlanView match={match} />}
                        </Route>
                        <Route path='/lesson-plan/student-view/list-view'>
                          {({ match }) => <LessonPlanView match={match} />}
                        </Route>
                        <Route path='/lesson-plan/teacher-view'>
                          {({ match }) => <LessonPlan match={match} />}
                        </Route>
                        <Route path='/lesson-plan/student-view'>
                          {({ match }) => <LessonPlan match={match} />}
                        </Route>
                        <Route path='/lesson-plan-module-view'>
                          {({ match }) => <LessonPlanView match={match} />}
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
