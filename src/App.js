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
import { createFeePlan, fetchLoggedInUserDetails } from './redux/actions';
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
import CreateDiscussionForum from './containers/discussionForum/createDiscussionForum';
// import CircularList from './containers/circular'
// import CreateCircular from './containers/circular/create-circular'
// import CircularStore from './containers/circular/context/CircularStore'
import Subjectgrade from './containers/subjectGradeMapping';
import ListandFilter from './containers/subjectGradeMapping/listAndFilter';
import GeneralDairyList from './containers/general-dairy';
import CreateGeneralDairy from './containers/general-dairy/create-dairy';
import CreateCourse from './containers/master-management/course/create-course';
import CourseView from './containers/master-management/course/view-course'
import ViewCourseCard from './containers/master-management/course/view-course/view-more-card/ViewCourseCard';
import ViewStore from './containers/master-management/course/view-course/context/ViewStore'

import FeeType from './containers/Finance/src/components/Finance/CreateFeeType/NormalFeeType/feeType.js'
import MiscFeeType from './containers/Finance/src/components/Finance/CreateFeeType/MiscFeeType/miscFeeType';
// import MiscFeeType from './containers/Finance/src/components/Finance/CreateFeeType/MiscFeeType/miscFeeType.js'
import CurrFeeType from './containers/Finance/src/components/Finance/CreateFeeType/CurrFeeType/currFeeType.js'
import OtherFeeType from './containers/Finance/src/components/Finance/CreateFeeType/OtherFeeType/otherFeeType.js'
import RegistrationFee from './containers/Finance/src/components/Finance/CreateFeeType/RegistrationFeeType/registrationFee.js'
// import ManageFeeType from './containers/Finance/src/components/Finance/CreateFeePlan/manageFeeType.js'
import CreateFeePlan from './containers/Finance/src/components/Finance/CreateFeePlan/createFeePlan.js'
import ConcessionSettings from  './containers/Finance/src/components/Finance/ConcessionSettings/concessionSettings.js'
import Ledger from './containers/Finance/src/components/Finance/ExpenseManagement/Ledger/ledger.js'
import TotalPaidReports from './containers/Finance/src/components/Finance/Reports/TotalPaidDueReports/totalPaidReports.js'
import OtherFeeTotalPaidReports from './containers/Finance/src/components/Finance/Reports/TotalPaidDueReports/otherFeeTotalPaidDueReport.js'
import TallyReports from './containers/Finance/src/components/Finance/Reports/TallyReports/tallyReports.js'
import ReceiptBookAdm from './containers/Finance/src/components/Finance/AdmissionReports/ReceiptBook/receiptBook.js'
import WalletReport from './containers/Finance/src/components/Finance/Reports/WalletReport/walletReport.js'
import ConcessionReport from './containers/Finance/src/components/Finance/BranchAccountant/ConcessionReport/ConcessionReport.js'
import ChequeBounceReport from './containers/Finance/src/components/Finance/Reports/ChequeBounceReports/chequeBounceReports.js'
import StudentShuffle from './containers/Finance/src/components/Finance/BranchAccountant/StudentShuffle/studentShuffle.js'
// import RequestShuffle from './containers/Finance/src/components/Finance/BranchAccountant/StudentShuffle/requestShuffle.js'
import MiscFeeClass from './containers/Finance/src/components/Finance/MiscFeeToClass/miscFeeClass.js'
import AssignCoupon from './containers/Finance/src/components/Finance/AssignCoupon/assignCoupon.js'
import CreateCoupon from './containers/Finance/src/components/Finance/CreateCoupon/createCoupon.js'
import DepositeTab from './containers/Finance/src/components/Finance/ExpenseManagement/Deposits/deposits.js'
import TotalFormCount from './containers/Finance/src/components/Finance/BranchAccountant/TotalFormCount/totalFormCount.js'
import RequestShuffle from './containers/Finance/src/components/Finance/BranchAccountant/StudentShuffle/requestShuffle.js'
import UnassignFeeRequests from './containers/Finance/src/components/Finance/ApprovalRequests/UnassignFeeRequests/unassignFeeRequestsTab.js'
import ApprovalRequest from './containers/Finance/src/components/Finance/ApprovalRequests/UnassignFeeRequests/Components/approvalRequest.js'
import PendingRequest from  './containers/Finance/src/components/Finance/ApprovalRequests/UnassignFeeRequests/Components/pendingRequest.js'
import RejectedRequest from './containers/Finance/src/components/Finance/ApprovalRequests/UnassignFeeRequests/Components/rejectedRequest';
import createReceipt from './containers/Finance/src/components/Finance/ReceiptChanges/createReceipt.js'
import AddFeePlan from './containers/Finance/src/components/Finance/CreateFeePlan/addFeePlan';
// import StoreReport from './containers/Finance/src/components/Finance/ApprovalRequests/UnassignFeeRequests/Components/Inventory/StoreAdmin/StoreReports/storeReports.js'
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
            {/* <CircularStore> */}
            <ViewStore>
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
                <Route exact path='/homework/cadd/:date/:subject/:id/:coord_selected_teacher_id'>
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
                {/* <Route exact path='/circular'>
                  {({ match }) => <CircularList match={match} />}
                </Route> */}
                {/* <Route exact path='/create-circular'>
                  {({ match }) => <CreateCircular match={match} />}
                </Route> */}
                <Route exact path='/general-dairy'>
                  {({ match }) => <GeneralDairyList match={match} />}
                </Route>
                <Route exact path='/create/general-dairy'>
                  {({ match }) => <CreateGeneralDairy match={match} />}
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
                <Route exact path='/feeType/miscFeeType'>
                  {({ match }) => <MiscFeeType match={match} />}
                </Route>
                <Route exact path='/feeType/normalFeeType'>
                  {({ match }) => <FeeType match={match} />}
                </Route>
                <Route exact path='/feeType/CurricularFeeType'>
                  {({ match }) => <CurrFeeType match={match} />}
                </Route>
                <Route exact path='/feeType/OtherFeeType'>
                  {({ match }) => <OtherFeeType match={match} />}
              </Route>
                <Route exact path='/feeType/RegistrationFee'>
                  {({ match }) => <RegistrationFee match={match} />}
                </Route>
                <Route exact path='/feePlan/ViewFeePlan'>
                  {({ match }) => <CreateFeePlan match={match} />}
                </Route>
                <Route exact path='/finance/ConcessionSetting'>
                  {({ match }) => <ConcessionSettings match={match} />}
                </Route>
                <Route exact path='/finance/Ledger'>
                  {({ match }) => <Ledger match={match} />}
                </Route>
                <Route exact path='/finance/TotalPaidReport'>
                  {({ match }) => <TotalPaidReports match={match} />}
                </Route>
                <Route exact path='/finance/OtherFeeTotalPaidReport'>
                  {({ match }) => <OtherFeeTotalPaidReports match={match} />}
                </Route>
                <Route exact path='/finance/TallyReport'>
                  {({ match }) => <TallyReports match={match} />}
                </Route>
                <Route exact path='/finance/ReceiptBook'>
                  {({ match }) => <ReceiptBookAdm match={match} />}
                </Route>
                <Route exact path='/finance/WalletReport'>
                  {({ match }) => <WalletReport match={match} />}
                </Route>
                <Route exact path='/finance/ConcessionReport'>
                  {({ match }) => <ConcessionReport match={match} />}
                </Route>
                <Route exact path='/finance/ChequeBounceReport'>
                  {({ match }) => <ChequeBounceReport match={match} />}
                </Route>
                <Route exact path='/finance/StudentShuffleRequest'>
                  {({ match }) => <StudentShuffle match={match} />}
                </Route>
                {/* <Route exact path='/finance/Requestshuffle'>
                  {({ match }) => <RequestShuffle match={match} />}
                </Route> */}
                  <Route exact path='/finance/MiscFeeClass'>
                  {({ match }) => <MiscFeeClass match={match} />}
                </Route>
                <Route exact path='/finance/AssignCoupon'>
                  {({ match }) => <AssignCoupon match={match} />}
                </Route>
                <Route exact path='/finance/CreateCoupon'>
                  {({ match }) => <CreateCoupon match={match} />}
                </Route>
                <Route exact path='/finance/DepositTab'>
                  {({ match }) => <DepositeTab match={match} />}
                </Route>
                <Route exact path='/finance/TotalFormReport'>
                  {({ match }) => <TotalFormCount match={match} />}
                </Route>
                <Route exact path='/finance/Requestshuffle'>
                  {({ match }) => <RequestShuffle match={match} />}
                </Route>
                <Route exact path='/finance/UnassignFeeRequests'>
                  {({ match }) => <UnassignFeeRequests match={match} />}
                </Route>
                <Route exact path='/finance/approval_request'>
                  {({ match }) => <ApprovalRequest match={match} />}
                </Route>
                <Route exact path='/finance/pending_request'>
                  {({ match }) => <PendingRequest match={match} />}
                </Route>
                <Route exact path='/finance/rejected_request'>
                  {({ match }) => <rejectedRequest match={match} />}
                </Route>
                <Route exact path='/finance/ReceiptRange'>
                  {({ match }) => <createReceipt match={match} />}
                </Route>
                {/* <Route exact path='/finance/StoreReport'>
                  {({ match }) => <StoreReport match={match} />}
                </Route> */}
                <Route exact path= '/finance/add_feePlan'>
                  {({ match }) => <addFeePlan match={match} />}
                </Route>
              </Switch>
              </ViewStore>
              {/* </CircularStore> */}
            </ThemeProvider>
          </OnlineclassViewProvider>
        </AlertNotificationProvider>
      </Router>
    </div>
  );
}

export default App;
