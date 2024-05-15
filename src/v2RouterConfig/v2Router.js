import React, { useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useLocation,
} from 'react-router-dom';
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
import SiblingMapping from '../v2/FaceLift/UserManagement/SiblingMapping';
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
import LoginFormSSO from 'containers/login/ssologin';
import ReportPipeline from 'v2/FaceLift/ReportPipeline';
import ActivityMangementDashboard from 'v2/FaceLift/ActivityManagement/ActivityMangementDashboard';
import StudentStrength from 'v2/FaceLift/SchoolStrength';
import StudentCountReport from 'v2/FaceLift/SchoolStrength/StudentCountReport';
import ChangePassword from '../v2/FaceLift/ChangePassword';
import SignatureUploadv2 from 'v2/FaceLift/MasterManagement/signature-upload/signature-table';
import { IsOrchidsChecker } from 'v2/isOrchidsChecker';
import EditReportConfig from 'containers/assessment-central/ReportCardConfig/EditReportConfig';
import CreatePeReportConfig from 'containers/assessment-central/ReportCardConfig/PhysicalEducation/CreatePeReportConfig';
import EnterPrises from 'v2/FaceLift/AndroidManagement/Enterprises';
import Devices from 'v2/FaceLift/AndroidManagement/Devices';
import Policies from 'v2/FaceLift/AndroidManagement/Policies';
import BranchHomework from '../containers/centralise_homework/BranchStaffSide';
import CentralizedStudentHw from '../containers/centralise_homework/student';

import HwUpload from '../containers/centralise_homework/hw_upload/hwUpload';
import UploadHomework from '../containers/centralise_homework/hw_upload/uploadFile';
import EvaluatorDash from '../containers/centralise_homework/evaluator';
import EvaluatorHomework from '../containers/centralise_homework/evaluator/imageView';

import CentralizedHome from '../containers/centralise_homework/CentralizedHome';
import CenralizedHomeworkRoute from '../containers/centralise_homework/centralhw_route';
import AuditorDashboard from '../containers/centralise_homework/evaluator/Auditor/AuditorDashboard';
import FrequentlyAskedQuestions from '../containers/FrequentlyAskedQuestions/FrequentlyAskedQuestions';
import AddFaq from '../containers/FrequentlyAskedQuestions/AddFaq';
import SchoolWall from 'v2/FaceLift/ActivityManagement/SchoolWall';
import PostDetails from 'v2/FaceLift/ActivityManagement/SchoolWall/postDetails';
import moment from 'moment';
import ENVCONFIG from 'config/config';

const V2Router = () => {
  useEffect(() => {
    isMsAPI();
    erpConfig();
  }, []);
  const userDetails = localStorage?.getItem('userDetails')
    ? JSON.parse(localStorage?.getItem('userDetails'))
    : {};
  const {
    apiGateway: { timeTracker },
  } = ENVCONFIG;

  const [theme, setTheme] = useState(() => themeGenerator());
  const [pageTrackerList, setPageTrackerList] = useState([
    {
      page: 'all',
      active: true,
    },
  ]);

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

  const RouteChangeTracker = () => {
    const location = useLocation();

    useEffect(() => {
      // Track route changes here
      handleLocationChange();
    }, [location.pathname]);

    return null;
  };

  const listRef = useRef(pageTrackerList);
  const prevLocation = useRef(window.location.href);
  const idleTimer = useRef();
  const timer = useRef();
  const lastAPICallTime = useRef(new Date());
  useEffect(() => {
    listRef.current = pageTrackerList;
  }, [pageTrackerList]);

  // Function to call API
  const callAPI = (messageeee) => {
    const currentTime = new Date(); // Get current time in milliseconds
    // Your API calling function goes here
    let url = prevLocation.current?.split('#')[1];
    let trackerContainsCurrentURL = false;
    let arr = [];
    if (listRef.current?.filter((e) => e.page == 'all')?.length > 0) {
      trackerContainsCurrentURL = true;
    } else {
      arr = listRef.current?.filter((each) => each.active === true);
      trackerContainsCurrentURL =
        listRef.current?.filter((each) => each.page == url && each.active)?.length > 0;
    }
    let diff = currentTime - lastAPICallTime.current;
    diff /= 1000;
    let branchName = localStorage.getItem('app.settings.branch_name');
    let payload = {
      erp_id: userDetails?.erp,
      name: `${userDetails?.first_name} ${userDetails?.last_name}`,
      time: diff > 120 ? 120 : Math.round(diff),
      user_level: userDetails?.user_level,
      school_name: window.location.hostname.split('.')?.[0],
      branch_id: String(
        JSON.parse(sessionStorage.getItem('selected_branch'))?.branch?.id
      ),
      branch_name: JSON.parse(sessionStorage.getItem('selected_branch'))?.branch
        ?.branch_name,
      link: prevLocation?.current,
      user_level_name: userDetails?.role_details?.user_role,
      start_time: moment(lastAPICallTime.current).format('HH:mm:ss'),
      end_time: moment(currentTime).format('HH:mm:ss'),
    };
    console.log('API called', { messageeee, diff });
    if (
      trackerContainsCurrentURL &&
      payload.time > 0 &&
      window.location.pathname !== '/'
    ) {
      axios
        .post(`${timeTracker}`, payload, {
          'Content-Type': 'application/json',
        })
        .then((res) => {})
        .catch((error) => console.error('API error:', error));
    }
    // Update last API call time
    lastAPICallTime.current = new Date();
    prevLocation.current = window.location.href;
  };

  // Function to start the timer
  const startTimer = () => {
    timer.current = setInterval(callAPI('startTimer'), 120000); // Call the API every 2 minutes
  };

  // Function to reset the timer
  const resetTimer = () => {
    clearInterval(timer.current); // Clear the previous interval
    startTimer(); // Restart the timer
  };

  // Function to handle location change
  const handleLocationChange = () => {
    resetTimer(); // Reset timer on location change
    clearInterval(idleTimer.current);
    idleTimer.current = setInterval(() => {
      // console.log('API CALLING STOPPED')
      clearInterval(timer.current); // Stop the timer on idle
      timer.current = null;
    }, 120001);
    callAPI('location'); // Call API immediately on location change
  };

  // Function to handle mouse activity
  const handleMouseActivity = () => {
    clearInterval(idleTimer.current); // Clear previous idle timer
    idleTimer.current = null;
    idleTimer.current = setInterval(() => {
      // console.log('API CALLING STOPPED')
      lastAPICallTime.current = new Date();
      clearInterval(timer.current); // Stop the timer on idle
      timer.current = null;
    }, 120001); // Stop timer after 2 minutes of inactivity
    if (!timer.current) {
      lastAPICallTime.current = new Date();
      startTimer(); // Restart the timer on activity
    }
  };

  // Function to handle tab visibility change
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // console.log('API TAB CLOSE')
      callAPI('visibility');
      // If the tab is hidden or minimized
      clearInterval(timer.current); // Stop the timer when tab is hidden
      timer.current = null;
      clearInterval(idleTimer.current);
      idleTimer.current = null;
    } else {
      lastAPICallTime.current = new Date();
      // If the tab becomes visible again
      startTimer(); // Restart the timer
      idleTimer.current = setInterval(() => {
        // console.log('API CALLING STOPPED')
        clearInterval(timer.current); // Stop the timer on idle
        timer.current = null;
      }, 120001);
    }
  };

  useEffect(() => {
    startTimer(); // Start the initial timer
    // Listen for mouse movement or activity
    window.addEventListener('mousemove', handleMouseActivity);
    window.addEventListener('mousedown', handleMouseActivity);
    window.addEventListener('keypress', handleMouseActivity);
    window.addEventListener('touchstart', handleMouseActivity);
    window.addEventListener('keydown', handleMouseActivity);
    window.addEventListener('scroll', handleMouseActivity);
    window.addEventListener('load', handleMouseActivity);
    window.addEventListener('touchmove', handleMouseActivity);
    window.addEventListener('click', handleMouseActivity);
    // Listen for visibility change events
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      // Clean up event listeners when component unmounts
      window.removeEventListener('mousemove', handleMouseActivity);
      window.removeEventListener('mousedown', handleMouseActivity);
      window.removeEventListener('keypress', handleMouseActivity);
      window.removeEventListener('touchstart', handleMouseActivity);
      window.removeEventListener('keydown', handleMouseActivity);
      window.removeEventListener('scroll', handleMouseActivity);
      window.removeEventListener('load', handleMouseActivity);
      window.removeEventListener('touchmove', handleMouseActivity);
      window.removeEventListener('click', handleMouseActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <Router>
      {window.location.pathname !== '/' ? <RouteChangeTracker /> : null}
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
                        <Route exact path='/sso/:erp/:hmac/auth/login'>
                          {({ match, history }) => (
                            <LoginFormSSO
                              match={match}
                              history={history}
                              setTheme={setTheme}
                            />
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
                        <Route path='/edit-announcement/:id'>
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
                        <Route exact path='/report-config/edit/:id'>
                          {({ match }) => <EditReportConfig match={match} />}
                        </Route>
                        <Route exact path='/pe-report-config/create'>
                          {({ match }) => <CreatePeReportConfig match={match} />}
                        </Route>
                        {/* <Route exact path='/pe-report-config/edit/:id'>
                          {({ match }) => <CreatePeReportConfig match={match} />}
                        </Route> */}
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
                          {({ match, history }) => (
                            <CreateUserConfig match={match} history={history} />
                          )}
                        </Route>
                        ,
                        <Route path='/user-management/edit-user/:id'>
                          {({ match, history }) => (
                            <CreateUserConfig match={match} history={history} />
                          )}
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
                        <Route path='/user-management/sibling-mapping'>
                          {({ match }) => <SiblingMapping match={match} />}
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
                        <Route path='/report-pipeline'>
                          {({ match }) => <ReportPipeline match={match} />}
                        </Route>
                        ,
                        <Route path='/activity-management-dashboard'>
                          {({ match }) => <ActivityMangementDashboard match={match} />}
                        </Route>
                        ,
                        <Route path='/student-strength'>
                          {({ match }) => <StudentStrength match={match} />}
                        </Route>
                        ,
                        <Route path='/student_count_report'>
                          {({ match }) => <StudentCountReport match={match} />}
                        </Route>
                        ,
                        <Route path='/change-password'>
                          {({ match }) => <ChangePassword match={match} />}
                        </Route>
                        ,
                        <Route path='/master-management/signature-upload'>
                          {({ match }) => <SignatureUploadv2 match={match} />}
                        </Route>
                        ,
                        <Route path='/homework/centralized'>
                          {({ match }) => <CenralizedHomeworkRoute match={match} />}
                        </Route>
                        ,
                        <Route path='/homework/centralized-home'>
                          {({ match }) => <CentralizedHome match={match} />}
                        </Route>
                        ,
                        <Route path='/homework/centralized-reports'>
                          {({ match }) => <EvaluatorDash match={match} />}
                        </Route>
                        ,
                        <Route path='/homework/centralized-eval-reports'>
                          {({ match }) => <AuditorDashboard match={match} />}
                        </Route>
                        ,
                        <Route path='/centralized-homework/branchstaff'>
                          {({ match }) => <BranchHomework match={match} />}
                        </Route>
                        ,
                        <Route path='/centralized-homework/student'>
                          {({ match }) => <CentralizedStudentHw match={match} />}
                        </Route>
                        ,
                        <Route path='/centralized-homework/homework-upload-status'>
                          {({ match }) => <HwUpload match={match} />}
                        </Route>
                        ,
                        <Route path='/centralized-homework/homework-upload'>
                          {({ match }) => <UploadHomework match={match} />}
                        </Route>
                        ,
                        <Route path='/centralized-homework/evaluator-hw'>
                          {({ match }) => <EvaluatorHomework match={match} />}
                        </Route>
                        ,
                        <Route path='/enterprise-management/:enterPriseName/:enterPriseId/devices'>
                          {({ match }) => <Devices match={match} />}
                        </Route>
                        ,
                        <Route path='/enterprise-management/:enterPriseName/:enterPriseId/policies'>
                          {({ match }) => <Policies match={match} />}
                        </Route>
                        ,
                        <Route path='/enterprise-management/enterprises'>
                          {({ match }) => <EnterPrises match={match} />}
                        </Route>
                        ,
                        <Route path='/frequently-asked-questions'>
                          {({ match }) => <FrequentlyAskedQuestions match={match} />}
                        </Route>
                        ,
                        <Route path='/add-faq'>
                          {({ match }) => <AddFaq match={match} />}
                        </Route>
                        {/* Activity Management */}
                        {/* <Route path='/school-wall/:postId'>
                          {({ match }) => <PostDetails match={match} />}
                        </Route> */}
                        <Route path='/school-wall'>
                          {({ match }) => <SchoolWall match={match} />}
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
