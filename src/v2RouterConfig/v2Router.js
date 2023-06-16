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
import Diary from 'v2/FaceLift/Diary/DiaryOld';
import DailyDiary from 'v2/FaceLift/Diary/DiaryOld/DailyDiary';
import GeneralDiary from 'v2/FaceLift/Diary/DiaryOld/GeneralDiary';
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
import GradewiseDiaryReport from 'v2/FaceLift/DiaryReport/GradewiseDiaryReport';
import SubjectwiseDiaryReport from 'v2/FaceLift/DiaryReport/SubjectwiseDiaryReport';
import TeacherDiaryReport from 'v2/FaceLift/DiaryReport/TeacherDiaryReport';
import TeacherwiseDiaryReport from 'v2/FaceLift/DiaryReport/TeacherwiseDiaryReport';
import StudentSidePhysicalActivity from 'containers/newBlog/StudentSidePhysicalActivity';
import BlogActivityView from 'containers/newBlog/BlogActivityView';
import ViewBMI from 'containers/newBlog/ViewBMI';

import endpoints from 'config/endpoints';
import axios from 'axios';
import CreateDiary from 'v2/FaceLift/Diary/DiaryNew/CreateDiary';
import DiaryMain from 'v2/FaceLift/Diary';
import StudentAssessmentDashboard from 'v2/FaceLift/AssessmentDashboard/studentAssessmentDashboard';
import StudentSideVisualActivity from 'containers/newBlog/StudentSideVisualActivity';
import FileDrive from 'v2/FaceLift/FileDrive';
import FileCategory from 'v2/FaceLift/FileDrive/FileCategory';
import FileFolder from 'v2/FaceLift/FileDrive/FileFolder';
import CreateNoAcademicStaff from 'v2/FaceLift/UserManagement/Staff/createNonAcademicSttaff';
import NonAcademicStaff from 'v2/FaceLift/UserManagement/Staff/nonAcademicStaff';
import EditNonAcademicStaff from 'v2/FaceLift/UserManagement/Staff/editNonAcademicStaff';
import ExcelUploadStatus from 'v2/FaceLift/UserManagement/Staff/excelUploadStatus';
import User from 'v2/FaceLift/UserManagement/User/index';
import AssignUserLevel from 'v2/FaceLift/UserManagement/AssignUserLevel';
import AssignUserRole from 'v2/FaceLift/UserManagement/AssignUserRole';
import SectionSuffle from 'v2/FaceLift/UserManagement/SectionSuffle';
import AccessBlocker from 'v2/FaceLift/UserManagement/AccessBlocker';
import VirtualSchool from 'v2/FaceLift/UserManagement/VirtualSchool';
import UserGroup from 'v2/FaceLift/UserManagement/UserGroup';
import CreateUser from 'v2/FaceLift/UserManagement/User/CreateUser';
import CreateUserConfig from 'v2/FaceLift/UserManagement/User/CreateUserConfig';
import V1EditUser from '../../src/containers/user-management/edit-user';
import ViewAttendance from 'v2/FaceLift/Attendance/ViewAttendance';
import MarkAttendance from 'v2/FaceLift/Attendance/MarkAttendance';
import UserBulkUpload from 'v2/FaceLift/UserManagement/User/CreateUser/BulkUpload';

const V2Router = () => {
  useEffect(() => {
    isMsAPI();
    erpConfig();
  }, []);
  const [theme, setTheme] = useState(() => themeGenerator());
  let { user_level: userLevel } = JSON.parse(localStorage.getItem('userDetails')) || '';
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || [];
  const { erp, username, erp_config } =
    JSON.parse(localStorage.getItem('userDetails')) || [];
  const { is_superuser: superuser } =
    JSON.parse(localStorage.getItem('userDetails')) || '';
  if (superuser == true) {
    userLevel = 1;
  }
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Sure Learning' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          axios
            .post(endpoints.sureLearning.login, {
              username: erp ? erp : username,
            })
            .then((result) => {
              localStorage.setItem('udaanDetails', JSON.stringify(result.data));
            })
            .catch((error) => {});
        }
      });
    }
  }, []);
  const isOrchids =
    window.location.host.split('.')[0] === 'orchids' ||
    window.location.host.split('.')[0] === 'qa'
      ? true
      : false;

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
                          {({ match }) => <DiaryMain match={match} />}
                        </Route>
                        {/* <Route path='/diary/teacher'>
                          {({ match }) => <Diary match={match} />}
                        </Route> */}
                        <Route path='/diary/student'>
                          {({ match }) => <DiaryMain match={match} />}
                        </Route>
                        <Route path='/create/diary'>
                          {({ match }) => <CreateDiary match={match} />}
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
                        <Route path='/student/phycial/activity'>
                          {({ match }) => <StudentSidePhysicalActivity match={match} />}
                        </Route>
                        <Route path='/student/visual/activity'>
                          {({ match }) => <StudentSideVisualActivity match={match} />}
                        </Route>
                        <Route path='blog-activity-view'>
                          {({ match }) => <BlogActivityView match={match} />}
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
                        <Route path='/lesson-plan/teacher-view/period-view/list-view'>
                          {({ match }) => <LessonPlanView match={match} />}
                        </Route>
                        <Route path='/lesson-plan/teacher-view/annual-plan/list-view'>
                          {({ match }) => <LessonPlanView match={match} />}
                        </Route>
                        <Route path='/lesson-plan/student-view/period-view/list-view'>
                          {({ match }) => <LessonPlanView match={match} />}
                        </Route>
                        <Route path='/lesson-plan/student-view/annual-plan/list-view'>
                          {({ match }) => <LessonPlanView match={match} />}
                        </Route>
                        <Route path='/lesson-plan/teacher-view/period-view'>
                          {({ match }) => <LessonPlan match={match} />}
                        </Route>
                        <Route path='/lesson-plan/teacher-view/annual-plan'>
                          {({ match }) => <LessonPlan match={match} />}
                        </Route>
                        <Route path='/lesson-plan/student-view/period-view'>
                          {({ match }) => <LessonPlan match={match} />}
                        </Route>
                        <Route path='/lesson-plan/student-view/annual-plan'>
                          {({ match }) => <LessonPlan match={match} />}
                        </Route>
                        <Route exact path='/gradewise-diary-report'>
                          {({ match }) => <GradewiseDiaryReport match={match} />}
                        </Route>
                        <Route exact path='/subjectwise-diary-report'>
                          {({ match }) => <SubjectwiseDiaryReport match={match} />}
                        </Route>
                        <Route exact path='/teacher-diary-report'>
                          {({ match }) => <TeacherDiaryReport match={match} />}
                        </Route>
                        <Route exact path='/teacherwise-diary-report'>
                          {({ match }) => <TeacherwiseDiaryReport match={match} />}
                        </Route>
                        <Route exact path='/bmi/view'>
                          {({ match }) => <ViewBMI match={match} />}
                        </Route>
                        {/* Assesment dashboard */}
                        <Route exact path='/student-assessment-dashboard'>
                          {({ match }) => <StudentAssessmentDashboard match={match} />}
                        </Route>
                        <Route exact path='/file-drive'>
                          {({ match }) => <FileDrive match={match} />}
                        </Route>
                        <Route exact path='/file-category'>
                          {({ match }) => <FileCategory match={match} />}
                        </Route>
                        <Route exact path='/file-folder'>
                          {({ match }) => <FileFolder match={match} />}
                        </Route>
                        <Route path='/user-management/non-academic-staff'>
                          {({ match }) => <NonAcademicStaff match={match} />}
                        </Route>
                        ,
                        <Route path='/user-management/create-non-academic-staff'>
                          {({ match }) => <CreateNoAcademicStaff match={match} />}
                        </Route>
                        ,
                        <Route path='/user-management/create-user'>
                          {({ match }) => <CreateUserConfig match={match} />}
                        </Route>
                        ,
                        <Route path='/user-management/edit-user/:id'>
                          {({ match }) => <CreateUserConfig match={match} />}
                        </Route>
                        ,
                        <Route path='/user-management/user-bulk-upload'>
                          {({ match }) => <UserBulkUpload match={match} />}
                        </Route>
                        ,
                        <Route path='/user-management/edit-non-academic-staff/:id'>
                          {({ match }) => <EditNonAcademicStaff match={match} />}
                        </Route>
                        ,
                        <Route path='/user-management/bulk-upload'>
                          {({ match }) => <ExcelUploadStatus match={match} />}
                        </Route>
                        ,
                        <Route path='/user-management/view-users'>
                          {({ match }) => <User match={match} />}
                        </Route>
                        ,
                        <Route path='/user-level-table'>
                          {({ match }) => <AssignUserLevel match={match} />}
                        </Route>
                        ,
                        <Route path='/user-management/assign-role'>
                          {({ match }) => <AssignUserRole match={match} />}
                        </Route>
                        ,
                        <Route path='/user-management/section-shuffling'>
                          {({ match }) => <SectionSuffle match={match} />}
                        </Route>
                        ,
                        <Route path='/user-management/access-blocker'>
                          {({ match }) => <AccessBlocker match={match} />}
                        </Route>
                        ,
                        <Route path='/virtual-school'>
                          {({ match }) => <VirtualSchool match={match} />}
                        </Route>
                        ,
                        <Route path='/viewgroup'>
                          {({ match }) => <UserGroup match={match} />}
                        </Route>
                        ,
                        <Route path='/teacher-attendance-verify'>
                          {({ match }) => <ViewAttendance match={match} />}
                        </Route>
                        <Route path='/mark-student-attendance'>
                          {({ match }) => <MarkAttendance match={match} />}
                        </Route>
                        <Route path='/mark-staff-attendance'>
                          {({ match }) => <MarkAttendance match={match} />}
                        </Route>
                        ,{/* v1 router */}
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
