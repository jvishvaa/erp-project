import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import CreateGroup from './containers/communication/create-group/create-group';
import ViewGroup from './containers/communication/view-group/view-group';
import UpdateGroup from './containers/communication/update-group/index';
import MessageCredit from './containers/communication/message-credit/message-credit';
import SendMessage from './containers/communication/send-message/send-message';
import MessageLog from './containers/communication/message-log/message-log';
import StudentHomework from './containers/homework/student-homework/student-homework';
import AssignRole from './containers/communication/assign-role/assign-role';
import RoleManagement from './containers/role-management';
import store from './redux/store';
import ChapterTypeTable from './containers/master-management/chapter-type/chapter-type-table';
import TopicTable from './containers/master-management/topic/TopicTable';
import AlertNotificationProvider from './context-api/alert-context/alert-state';
// import './assets/styles/styles.scss';
import UserManagement from './containers/user-management';
import ViewUsers from './containers/user-management/view-users/view-users';
import Login from './containers/login';
import Forgot from './containers/Forgot-Password/Forgot';
import Dashboard from './containers/dashboard';
import { listSubjects } from './redux/actions/academic-mapping-actions';
import OnlineclassViewProvider from './containers/online-class/online-class-context/online-class-state';
import CreateClass from './containers/online-class/create-class';
import OnlineAttendanceTeacherView from 'containers/online-class/online-attendance/OnlineAttendanceTeacherView';
import ViewClassManagement from './containers/online-class/view-class/view-class-management/view-class-management';
import AttendeeList from './containers/online-class/view-class/view-class-management/attendee-list/attendee-list';
import ViewClassStudentCollection from './containers/online-class/view-class/view-class-student/view-class-student-collection';
import BranchTable from './containers/master-management/branch/branch-table';
import BranchAcadTable from './containers/master-management/branch-acad-mapping/branch-acad-table';
import SubjectMappingTable from './containers/master-management/subject-mapping/subject-mapping-table';
import SubjectTable from './containers/master-management/subject/subject-table';
import SectionMappingTable from './containers/master-management/section-mapping/section-mapping-table';
import SectionTable from './containers/master-management/section/section-table';
import GradeTable from './containers/master-management/grade/grade-table';
import AcademicYearTable from './containers/master-management/academic-year/academic-year-table';
import MessageTypeTable from './containers/master-management/message-type/message-type-table';
// import OnlineClassResource from './containers/online-class/online-class-resources/online-class-resource';
import HomeworkCard from './containers/homework/homework-card';
import Profile from './containers/profile/profile';
import { fetchLoggedInUserDetails } from './redux/actions';
import TeacherHomeWorkReport from './containers/homework/teacher-homework-report/teacherReport-index';
import TeacherHomework from './containers/homework/teacher-homework';
import StudentHomeworkReport from './containers/homework/student-homework-report/index';
import HomeworkAdmin from './containers/homework/homework-admin';
import AddHomework from './containers/homework/teacher-homework/add-homework';
import BulkUpload from './containers/user-management/bulk-upload/bulk-upload';
import CoordinatorHomework from './containers/homework/coordinator-homework';
import AddHomeworkCoord from './containers/homework/coordinator-homework/add-homework';
import LessonReport from './containers/lesson-plan/lesson-plan-report';
import LessonPlan from './containers/lesson-plan/lesson-plan-view';
import endpoints from '../src/config/endpoints';
import BookAppointment from './containers/BookAppointments/BookAppointment';
import Appointments from './containers/BookAppointments/Appointments';
import ResponderView from './containers/BookAppointments/ResponderView';
import {
  ViewAssessments,
  AssessmentAttemption,
  AssessmentAnalysis,
  AssessmentComparisionUI,
} from './containers/assessment';
import { ViewOrchadio, ManageOrchadio, AddNewOrchadio } from './containers/Orchadio';
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
  EditGenre,
  ContentViewPublish,
  ContentViewPublishStudent,
  AdminBlog,
  PrincipalBlog,
  PrincipalPublishBlogView,
  StudentPublishBlogView,
  AdminPublishBlogView,
  ContentViewPublishAdmin,
  ContentViewPublishPrincipal,
  EditWordCountConfig,
  SendEmailAttCwHw,
} from './containers/blog';
import { CreateEbook, ViewEbook } from './containers/ebooks';
import LessonPlanGraphReport from './containers/lesson-plan/lesson-plan-graph-report';
import Discussionforum from './containers/discussionForum/index';
import DiscussionPost from './containers/discussionForum/discussion/DiscussionPost';
import CreateCategory from './containers/discussionForum/createCategory';
import CreateCategories from './containers/discussionForum/discussion/CreateCategory';
import CategoryPage from './containers/discussionForum/discussion/CategoryPage';
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
import CoursePrice from './containers/master-management/course/course-price';
import CreateCourse from './containers/master-management/course/create-course';
import CourseView from './containers/master-management/course/view-course';
import ViewCourseCard from './containers/master-management/course/view-course/view-more-card/ViewCourseCard';
import ViewStore from './containers/master-management/course/view-course/context/ViewStore';
import DailyDairyStore from './containers/daily-dairy/context/context';
import AttendeeListRemake from './containers/attendance';
import Reshuffle from './containers/online-class/aol-view/Reshuffle';
import StudentStrength from './containers/student-strength';
import StudentIdCard from './containers/student-Id-Card';
import SignatureUpload from './containers/signature-upload';
import TeacherBatchView from './containers/teacherBatchView';
import ErpAdminViewClass from './containers/online-class/erp-view-class/admin';
import OnlineClassResource from './containers/online-class/online-class-resources/online-class-resource';
import AttachmentPreviewer from './components/attachment-previewer';
import FeeType from './containers/Finance/src/components/Finance/CreateFeeType/NormalFeeType/feeType.js';
import MiscFeeType from './containers/Finance/src/components/Finance/CreateFeeType/MiscFeeType/miscFeeType';
// import MiscFeeType from './containers/Finance/src/components/Finance/CreateFeeType/MiscFeeType/miscFeeType.js'
import CurrFeeType from './containers/Finance/src/components/Finance/CreateFeeType/CurrFeeType/currFeeType.js';
import AddOtherFees from './containers/Finance/src/components/Finance/BranchAccountant/OtherFees/addOtherFees.js';
import AdminOtherFees from './containers/Finance/src/components/Finance/BranchAccountant/OtherFees/adminOtherFees.js';
import RegistrationFee from './containers/Finance/src/components/Finance/CreateFeeType/RegistrationFeeType/registrationFee.js';
// import ManageFeeType from './containers/Finance/src/components/Finance/CreateFeePlan/manageFeeType.js'
import CreateFeePlan from './containers/Finance/src/components/Finance/CreateFeePlan/createFeePlan.js';
import ConcessionSettings from './containers/Finance/src/components/Finance/ConcessionSettings/concessionSettings.js';
import Ledger from './containers/Finance/src/components/Finance/ExpenseManagement/Ledger/ledger.js';
import TotalPaidReports from './containers/Finance/src/components/Finance/Reports/TotalPaidDueReports/totalPaidReports.js';
import OtherFeeTotalPaidReports from './containers/Finance/src/components/Finance/Reports/TotalPaidDueReports/otherFeeTotalPaidDueReport.js';
import TallyReports from './containers/Finance/src/components/Finance/Reports/TallyReports/tallyReports.js';
import ReceiptBookAdm from './containers/Finance/src/components/Finance/AdmissionReports/ReceiptBook/receiptBook.js';
import WalletReport from './containers/Finance/src/components/Finance/Reports/WalletReport/walletReport.js';
import ConcessionReport from './containers/Finance/src/components/Finance/BranchAccountant/ConcessionReport/ConcessionReport.js';
import ChequeBounceReport from './containers/Finance/src/components/Finance/Reports/ChequeBounceReports/chequeBounceReports.js';
import StudentShuffle from './containers/Finance/src/components/Finance/BranchAccountant/StudentShuffle/studentShuffle.js';
// import RequestShuffle from './containers/Finance/src/components/Finance/BranchAccountant/StudentShuffle/requestShuffle.js'
import MiscFeeClass from './containers/Finance/src/components/Finance/MiscFeeToClass/miscFeeClass.js';
import AssignCoupon from './containers/Finance/src/components/Finance/AssignCoupon/assignCoupon.js';
import CreateCoupon from './containers/Finance/src/components/Finance/CreateCoupon/createCoupon.js';
import DepositeTab from './containers/Finance/src/components/Finance/ExpenseManagement/Deposits/deposits.js';
import TotalFormCount from './containers/Finance/src/components/Finance/BranchAccountant/TotalFormCount/totalFormCount.js';
import RequestShuffle from './containers/Finance/src/components/Finance/BranchAccountant/StudentShuffle/requestShuffle.js';
import UnassignFeeRequests from './containers/Finance/src/components/Finance/ApprovalRequests/UnassignFeeRequests/unassignFeeRequestsTab.js';
import ApprovalRequest from './containers/Finance/src/components/Finance/ApprovalRequests/UnassignFeeRequests/Components/approvalRequest.js';
import PendingRequest from './containers/Finance/src/components/Finance/ApprovalRequests/UnassignFeeRequests/Components/pendingRequest.js';
import RejectedRequest from './containers/Finance/src/components/Finance/ApprovalRequests/UnassignFeeRequests/Components/rejectedRequest';
import CreateReceipt from './containers/Finance/src/components/Finance/ReceiptChanges/createReceipt.js';
import StoreReport from '../src/containers/Finance/src/components/Inventory/StoreAdmin/StoreReports/storeReports.js';
import AddFeePlan from './containers/Finance/src/components/Finance/CreateFeePlan/addFeePlan.js';
import StudentLedgerTab from './containers/Finance/src/components/Finance/BranchAccountant/StudentLedgerTab/studentLedgerTab.js';
import ManageFeeType from '../src/containers/Finance/src/components/Finance/CreateFeePlan/manageFeeType.js';
import RegistrationForm from '../src/containers/Finance/src/components/Finance/BranchAccountant/RegistrationForm/registrationForm.js';
import NewRegistration from '../src/containers/Finance/src/components/Finance/BranchAccountant/RegistrationForm/newRegistrationForm.js';
import AdmissionFormAcc from '../src/containers/Finance/src/components/Finance/BranchAccountant/AdmissionForm/admissionForm.js';
import CustomizedAdmissionForm from '../src/containers/Finance/src/components/Finance/BranchAccountant/AdmissionForm/customizedAdmissionForm.js';
import NewAdmissionForm from './containers/Finance/src/components/Finance/BranchAccountant/AdmissionForm/newAdmissionForm';
import ApplicationFormAcc from '../src/containers/Finance/src/components/Finance/BranchAccountant/ApplicationForm/applicationForm.js';
// import OnlineAdmission from '../src/containers/Finance/src/components/Finance/PendingOnlineAdmission/pendingOnlineAdmission.js'
import TabView from '../src/containers/Finance/src/components/Finance/CorporateBank/CorporateBankTabView/corporateBankTabView.js';
import Bank from './containers/Finance/src/components/Finance/CorporateBank/bank.js';
import ViewBanks from '../src/containers/Finance/src/components/Finance/CorporateBank/ViewBanks/viewBanks.js';
import ViewFeeAccounts from '../src/containers/Finance/src/components/Finance/CorporateBank/ViewFeeAccounts/viewFeeAccounts.js';
import AccToClass from '../src/containers/Finance/src/components/Finance/CorporateBank/AccountToClass/accountToClass.js';
import AccToBranch from '../src/containers/Finance/src/components/Finance/CorporateBank/AccountToBranch/accountToBranch.js';
import AccToStore from '../src/containers/Finance/src/components/Finance/CorporateBank/AccountToStore/accountToStore.js';
import LastDateSettings from '../src/containers/Finance/src/components/Finance/LastDateSettings/lastDate.js';
import ReceiptSettings from '../src/containers/Finance/src/components/Finance/ReceiptSettings/ReceiptSettings.js';
import BulkFeeUpload from '../src/containers/Finance/src/components/Finance/BulkOperations/BulkFeeUpload/bulkFeeUpload.js';
import StudentWallet from '../src/containers/Finance/src/components/Finance/student/StudentWallet/StudentWallet.js';
import FeeCollection from '../src/containers/Finance/src/components/Finance/BranchAccountant/FeeCollection/FeeCollection.js';
import FeeShowList from './containers/Finance/src/components/Finance/BranchAccountant/FeeCollection/FeeShowList';
import AssignDelieveryCharge from './containers/Finance/src/components/Finance/BranchAccountant/AssignDelieveryCharge/assignDelieveryCharge.js';
import ChangeFeePlanToStudent from './containers/Finance/src/components/Finance/BranchAccountant/ChangeFeePlanToStudent/changeFeePlanToStudent.js';
import BulkReportUpload from './containers/Finance/src/components/Finance/BulkOperations/bulkReportUpload.js';
import ErrorBoundary404 from './ErrorBoundary';
import BulkReportStatus from './containers/Finance/src/components/Finance/BulkOperations/bulkReportStatus.js';
import OnlinePayment from './containers/Finance/src/components/Finance/UploadOnlinePayments/uploadOnlinePayments.js';
import BulkActiveInactive from './containers/Finance/src/components/Finance/BulkOperations/BulkActiveInactive/bulkActiveInactive.js';
import BulkActiveInactiveParent from './containers/Finance/src/components/Finance/BulkOperations/BulkActiveInactiveParent/bulkActiveInactiveParent.js';
import StudentActivateInactiveAcc from './containers/Finance/src/components/Finance/BranchAccountant/StudentActivateInactivate/studentActivateInactiveacc.js';
import OnlineAdmission from './containers/Finance/src/components/Finance/PendingOnlineAdmission/pendingOnlineAdmission.js';
import StudentPromotion from './containers/Finance/src/components/Finance/BranchAccountant/StudentPromotion/studentPromotion.js';
import QRCodeGenerator from './containers/Finance/src/components/Finance/QRCode/qrCodeGenerator.js';
import CommunicationSMS from './containers/Finance/src/components/Finance/BranchAccountant/Communication/communication.js';
import ItCertificate from './containers/Finance/src/components/Finance/ItCertificate/itCertificate.js';
import FeePaymentChangeRequests from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/feePaymentChangeRequests.js';
import StorePaymentRequests from './containers/Finance/src/components/Finance/StorePaymentRequests/storePaymentRequests.js';
import ApprovedStoreRequests from './containers/Finance/src/components/Finance/StorePaymentRequests/approvedStoreRequests.js';
import RejectedStoreRequests from './containers/Finance/src/components/Finance/StorePaymentRequests/rejectedStoreRequests.js';
import CancelledStoreRequests from './containers/Finance/src/components/Finance/StorePaymentRequests/cancelledStoreRequests';
import PendingStoreRequests from './containers/Finance/src/components/Finance/StorePaymentRequests/pendingStoreRequests';
import ApprovedRequestView from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/approvedRequestView';
import RejectedRequestView from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/rejectedRequestView';
import CancelledRequestView from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/cancelledRequestView';
import PendingRequestView from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/pendingRequestView';
import AcceptRejectPayment from './containers/Finance/src/components/Finance/BranchAccountant/AcceptRejectPayment/acceptRejectPayment';
import PostDateCheque from './containers/Finance/src/components/Finance/BranchAccountant/PostDateCheque/postDateCheque';
import StudentInfoAdm from './containers/Finance/src/components/Finance/StudentInfo/studentInfo.js';
import BillingDetails from './containers/Finance/src/components/Finance/E-mandate/billingDetails';
import CustomerDeatils from './containers/Finance/src/components/Finance/E-mandate/addCustomerDeatils';
// import CustomerDeatils from './containers/Finance/src/components/Finance/E-mandate/addCustomerDeatils.js'
import OrderDetails from './containers/Finance/src/components/Finance/E-mandate/orderDetails';
import DailyBillingDetails from './containers/Finance/src/components/Finance/E-mandate/dailyBillingDetails';
import PettyExpenses from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/pettyExpenses.js';
import MakeEntry from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/MakeEntry/makeEntry.js';
import BankReport from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/BankReport/bankReport.js';
import CashReport from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/CashReport/cashReport.js';
import LedgerReport from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/LedgerReport/ledgerReport.js';
import FinancialLedgerReport from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/FinancialLedgerReport/financialLedgerReport.js';
import Party from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/Party/Party.js';
import StudentShuffleReq from './containers/Finance/src/components/Finance/ApprovalRequests/StudentShuffle/studentShuffleReq.js';
import ManagePayment from './containers/Finance/src/components/Finance/student/managePayment/managePayment.js';
import FeeStructure from './containers/Finance/src/components/Finance/student/FeeStructure/feeStructure.js';
import BulkUniform from './containers/Finance/src/components/Inventory/StoreManager/BulkUniform/bulkUniform.js';
import ShippingAmount from './containers/Finance/src/components/Inventory/BranchAccountant/shippingAmount/ShippingAmount.js';
import AddItems from './containers/Finance/src/components/Inventory/StoreAdmin/SchoolStore/AddItems/addItems.js';
import Kit from './containers/Finance/src/components/Inventory/StoreAdmin/Kit/kit';
import SubCategoryAllow from './containers/Finance/src/components/Inventory/StoreAdmin/SubCategoryAllow/subCategoryAllow';
import UpdateAdmissionForm from './containers/Finance/src/components/Finance/BranchAccountant/AdmissionForm/updateAdmissionForm';
import AccountantLogin from './containers/Finance/src/components/Finance/BulkOperations/AccountantLogin/AccountantLogin';
import AddGst from './containers/Finance/src/components/Inventory/StoreAdmin/AddGst/addGst';
import OrderStatusUpload from './containers/Finance/src/components/Inventory/StoreAdmin/OrderStatusUpload/orderStatusUpload';
import ReceiptBook from './containers/Finance/src/components/Finance/Reports/ReceiptBook/receiptBook.js';
import EMandate from './containers/Finance/src/components/Finance/E-mandate/e-mandate.js';
import CreateLink from './containers/Finance/src/components/Finance/E-mandate/createLink.js';
import Alert from './containers/Finance/src/ui/alert';
import alertActions from './containers/Finance/src/_actions/alert.actions';
import userActions from './containers/Finance/src/_actions/user.actions';
import ApprovePendingReq from './containers/Finance/src/components/Finance/ApprovalRequests/StudentShuffle/Components/approvePendingReq.js';
import { connect } from 'react-redux';
import NonRTEFormAcc from './containers/Finance/src/components/Finance/BranchAccountant/AdmissionForm/nonRTEAdmissionForm.js';
import AssignOtherFees from './containers/Finance/src/components/Finance/BranchAccountant/OtherFees/assignOtherFess.js';
import GenerateSubsequentPayment from './containers/Finance/src/components/Finance/E-mandate/generateSubsequentPayment.js';
import EditTransactionDetails from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/editTransactionDetails';
import AppFormList from './containers/Finance/src/components/Finance/BranchAccountant/TotalFormCount/appFormList.js';
import RegFormList from './containers/Finance/src/components/Finance/BranchAccountant/TotalFormCount/regFormList.js';
import TransactionStatus from './containers/Finance/src/components/Finance/TransactionStatus/transactionStatus.js';
import AdmFormList from './containers/Finance/src/components/Finance/BranchAccountant/TotalFormCount/admFormList.js';
import Airpay from './containers/Finance/src/components/Finance/PaymentGateways/Airpay/airpayIntegration.js';
import UploadPaymentFile from './containers/Finance/src/components/Finance/student/managePayment/UploadPaymentFile.js';
import TimeTable from './containers/time-table/index';
import Griviences from './containers/Griviences/index';
import NewGrivience from './containers/Griviences/NewGrivience';
import GriviencesCreate from './containers/Griviences/CreateNew/create-new';
import MarkAttedance from './containers/attendance/MarkAttedance';
import AttedanceCalender from './containers/attendance/AttedanceCalender';
import EventCategory from './containers/Calendar/EventCategory';
import Attendance from './containers/Calendar/Attendance';
import CreateEvent from './containers/Calendar/CreateEvent';
import OverallAttendance from './containers/Calendar/OverallAttendance';
import Publications from './containers/publications/Publications';
// import TimeTable from './containers/time-table/index';
import ActivateInactivateStudentAdm from './containers/Finance/src/components/Finance/Dashboard/FinanceAdmin/activateInactivateStudent.js';
import QuestionBankList from './containers/question-bank/question-bank-list';
import CreateQuestion from './containers/question-bank/create-question';
import CreateQuestionPaper from './containers/assessment-central/create-question-paper';
// import Assesmentquestion from './containers/assesment/assesment';
import Assesment from './containers/assessment-central';
import AssessmentView from './containers/assessment-central/assesment-view';
import CreateAssesment from './containers/assessment-central/create-assesment';
import AssessmentReportTypes from './containers/assessment-central/assessment-report-types';
import ContactUs from 'containers/contact-us';
import PreQuiz from './containers/online-class/erp-view-class/admin/PreQuiz';
import AssignQP from './containers/online-class/erp-view-class/admin/AssignQP';
import ClassWork from './containers/Classwork/index';
import { Helmet } from 'react-helmet';
import logo from '../src/assets/images/logo_mobile.png';

// import Contact from './containers/contact/Contact';

import MultiplayerQuiz from './components/mp-quiz';
import StudentAttendance from 'containers/online-class/student-attendance/StudentAttendance';
import HomeWorkReportTeacher from 'containers/homework/homework-report/homework-teacher/HomeWorkReportTeacher';
import ClassWorkTeacherReport from 'containers/Classwork/classwork-report/classwork-report-teacher/ClassWorkTeacherReport';
import StudentClassWorkReport from 'containers/Classwork/StudentClassWork';
import Setting from './containers/settings/setting';
//intelligent text book
import BookView from 'containers/intelligent-textbook/BookView';
import ViewiChapter from 'containers/intelligent-textbook/ViewiChapter';
import ViewiBook from './containers/intelligent-textbook/ViewiBook';
import AllBooksPage from 'containers/intelligent-textbook/bookpage/AllBooksPage';
import ChapterBook from 'containers/intelligent-textbook/chapterpage/ChapterBook';
import { themeGenerator } from '../src/utility-functions/themeGenerator';
import StoreAtStudent from 'containers/Finance/src/components/Inventory/Student/storeAtStudent';
import  EditStoreTransactionDetails from 'containers/Finance/src/components/Finance/StorePaymentRequests/editStoreTransactionDetails';
import { isMsAPI } from "./utility-functions/index";

function App({ alert }) {
  isMsAPI();
  const [theme, setTheme] = useState(() => themeGenerator());
  return (
    // <ErrorBoundary404 HomeButton={false}>
    <div className='App'>
      <Helmet>
        <title>Eduvate</title>
        <link rel='icon' href={logo} />
      </Helmet>
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
                          <Route path='/profile'>
                            {({ match }) => <Profile match={match} />}
                          </Route>
                          <Route path='/role-management'>
                            {({ match }) => <RoleManagement match={match} />}
                          </Route>
                          <Route path='/user-management'>
                            {({ match }) => <UserManagement match={match} />}
                          </Route>
                          <Route path='/time-table/student-view'>
                            {({ match }) => <TimeTable match={match} />}
                          </Route>
                          <Route path='/time-table/teacher-view'>
                            {({ match }) => <TimeTable match={match} />}
                          </Route>
                          <Route path='/griviences/admin-view'>
                            {({ match }) => <Griviences match={match} />}
                          </Route>
                          <Route path='/griviences/student-view'>
                            {({ match }) => <Griviences match={match} />}
                          </Route>
                          <Route path='/greviences/createnew'>
                            {({ match }) => <GriviencesCreate match={match} />}
                          </Route>
                          <Route path='/homework/student-report'>
                            {({ match }) => <StudentHomeworkReport match={match} />}
                          </Route>
                          <Route path='/erp-online-class/class-work/:param1/:param2/:param3'>
                            {({ match }) => <ClassWork match={match} />}
                          </Route>
                          <Route path='/communication/messagelog'>
                            {({ match }) => <MessageLog match={match} />}
                          </Route>
                          <Route path='/dashboard'>
                            {({ match }) => <Dashboard match={match} />}
                          </Route>
                          <Route exact path='/'>
                            {({ match, history }) => (
                              <Login
                                match={match}
                                history={history}
                                setTheme={setTheme}
                              />
                            )}
                          </Route>
                          <Route exact path='/forgot'>
                            {({ match, history }) => (
                              <Forgot match={match} history={history} />
                            )}
                          </Route>
                          <Route path='/assesment'>
                            {({ match }) => <Assesment match={match} />}
                          </Route>
                          <Route exact path='/question-bank'>
                            {({ match }) => <QuestionBankList match={match} />}
                          </Route>
                          <Route exact path='/create-question/:qId?'>
                            {({ match }) => <CreateQuestion match={match} />}
                          </Route>
                          <Route exact path='/create-question-paper'>
                            {({ match }) => <CreateQuestionPaper match={match} />}
                          </Route>
                          <Route exact path='/assessment-question'>
                            {({ match }) => <AssessmentView match={match} />}
                          </Route>
                          <Route path='/create-assesment'>
                            {({ match }) => <CreateAssesment match={match} />}
                          </Route>
                          <Route exact path='/assessment-reports'>
                            {({ match }) => <AssessmentReportTypes match={match} />}
                          </Route>
                          <Route exact path='/attendance-hw-cw/send-email'>
                            {({ match }) => <SendEmailAttCwHw match={match} />}
                          </Route>
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
                          <Route exact path='/communication/updategroup'>
                            {({ match }) => <UpdateGroup match={match} />}
                          </Route>
                          <Route exact path='/communication/sendmessage'>
                            {({ match }) => <SendMessage match={match} />}
                          </Route>
                          <Route exact path='/online-class/create-class'>
                            {({ match }) => <CreateClass match={match} />}
                          </Route>
                          <Route exact path='/erp-online-class/assign/:id/qp'>
                            {({ match }) => <AssignQP match={match} />}
                          </Route>
                          <Route exact path='/erp-online-class/:id/:qid/pre-quiz'>
                            {({ match }) => <PreQuiz match={match} />}
                          </Route>
                          <Route path='/erp-online-class/:onlineclassId/quiz/:questionpaperId/:lobbyuuid/:role'>
                            {({ match }) => <MultiplayerQuiz match={match} />}
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
                          <Route exact path='/master-management/chapter-type-table'>
                            {({ match }) => <ChapterTypeTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/topic-table'>
                            {({ match }) => <TopicTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/branch-table'>
                            {({ match }) => <BranchTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/branch-acad-table'>
                            {({ match }) => <BranchAcadTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/subject-mapping-table'>
                            {({ match }) => <SubjectMappingTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/subject-table'>
                            {({ match }) => <SubjectTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/section-mapping-table'>
                            {({ match }) => <SectionMappingTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/section-table'>
                            {({ match }) => <SectionTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/grade-table'>
                            {({ match }) => <GradeTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/academic-year-table'>
                            {({ match }) => <AcademicYearTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/message-type-table'>
                            {({ match }) => <MessageTypeTable match={match} />}
                          </Route>
                          <Route exact path='/master-management/subject/grade/mapping'>
                            {({ match }) => <Subjectgrade match={match} />}
                          </Route>
                          <Route exact path='/master-management/event-category'>
                            {({ match }) => <EventCategory match={match} />}
                          </Route>
                          <Route exact path='/subject/grade'>
                            {({ match }) => <ListandFilter match={match} />}
                          </Route>
                          <Route exact path='/homework/homework-card'>
                            {({ match }) => <HomeworkCard match={match} />}
                          </Route>

                          <Route exact path='/homework/teacher-report'>
                            {({ match }) => <TeacherHomeWorkReport match={match} />}
                          </Route>
                          <Route exact path='/homework/add/:date/:subject/:id'>
                            {({ match }) => <AddHomework match={match} />}
                          </Route>
                          <Route exact path='/homework/student'>
                            {({ match }) => <StudentHomework match={match} />}
                          </Route>
                          <Route exact path='/homework/teacher'>
                            {({ match }) => <TeacherHomework match={match} />}
                          </Route>
                          <Route exact path='/classwork/student-report'>
                            {({ match }) => <StudentClassWorkReport match={match} />}
                          </Route>
                          <Route
                            exact
                            path='/homework/add/:date/:session_year/:branch/:grade/:subject/:id'
                          >
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
                            path='/homework/cadd/:date/:session_year/:branch/:grade/:subject/:id/:coord_selected_teacher_id'
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
                          <Route exact path='/teacher-forum'>
                            {({ match }) => <Discussionforum match={match} />}
                          </Route>
                          <Route exact path='/student-forum'>
                            {({ match }) => <Discussionforum match={match} />}
                          </Route>
                          <Route exact path='/master-management/discussion-category'>
                            {({ match }) => <CategoryPage match={match} />}
                          </Route>
                          <Route
                            exact
                            path='/master-management/discussion-category/create'
                          >
                            {({ match }) => <CreateCategories match={match} />}
                          </Route>
                          <Route exact path='/category/create'>
                            {({ match }) => <CreateCategory match={match} />}
                          </Route>
                          <Route exact path='/discussion-forum/create'>
                            {({ match }) => <CreateDiscussionForum match={match} />}
                          </Route>
                          <Route exact path='/teacher-forum/create'>
                            {({ match }) => <CreateDiscussionForum match={match} />}
                          </Route>
                          <Route exact path='/student-forum/create'>
                            {({ match }) => <CreateDiscussionForum match={match} />}
                          </Route>
                          <Route exact path='/teacher-forum/post/:id'>
                            {({ match }) => <DiscussionPost match={match} />}
                          </Route>
                          <Route exact path='/student-forum/post/:id'>
                            {({ match }) => <DiscussionPost match={match} />}
                          </Route>
                          <Route exact path='/teacher-forum/edit/:id'>
                            {({ match }) => <CreateDiscussionForum match={match} />}
                          </Route>
                          <Route exact path='/student-forum/edit/:id'>
                            {({ match }) => <CreateDiscussionForum match={match} />}
                          </Route>
                          <Route exact path='/teacher-circular'>
                            {({ match }) => <CircularList match={match} />}
                          </Route>
                          <Route exact path='/student-circular'>
                            {({ match }) => <CircularList match={match} />}
                          </Route>
                          <Route exact path='/create-circular/:circularKey?'>
                            {({ match }) => <CreateCircular match={match} />}
                          </Route>
                          <Route exact path='/general-dairy'>
                            {({ match }) => <GeneralDairyList match={match} />}
                          </Route>
                          <Route exact path='/diary/student'>
                            {({ match }) => <GeneralDairyList match={match} />}
                          </Route>
                          <Route exact path='/diary/teacher'>
                            {({ match }) => <GeneralDairyList match={match} />}
                          </Route>
                          <Route exact path='/general-dairy/student-view'>
                            {({ match }) => <GeneralDairyStudentList match={match} />}
                          </Route>
                          <Route exact path='/create/general-diary'>
                            {({ match }) => <CreateGeneralDairy match={match} />}
                          </Route>
                          <Route exact path='/daily-dairy'>
                            {({ match }) => <DailyDairyList match={match} />}
                          </Route>
                          <Route exact path='/create/daily-diary'>
                            {({ match }) => <CreateDailyDairy match={match} />}
                          </Route>
                          <Route exact path='/create/course'>
                            {({ match }) => <CreateCourse match={match} />}
                          </Route>
                          <Route exact path='/course-price/:courseKey?/:gradeKey?'>
                            {({ match }) => <CoursePrice match={match} />}
                          </Route>
                          <Route exact path='/create/course/:courseKey?/:gradeKey?'>
                            {({ match }) => <CreateCourse match={match} />}
                          </Route>
                          <Route exact path='/course-list/:gradeKey?'>
                            {({ match }) => <CourseView match={match} />}
                          </Route>
                          <Route exact path='/view-period/:id?'>
                            {({ match }) => <ViewCourseCard match={match} />}
                          </Route>
                          <Route exact path='/assessment/comparision'>
                            {({ match }) => <AssessmentComparisionUI match={match} />}
                          </Route>
                          <Route exact path='/assessment/:assessmentId/analysis'>
                            {({ match }) => <AssessmentAnalysis match={match} />}
                          </Route>
                          <Route exact path='/erp-attendance-list/:id?'>
                            {({ match }) => <AttendeeListRemake match={match} />}
                          </Route>
                          <Route exact path='/aol-attendance-list/:id?'>
                            {({ match }) => <AttendeeListRemake match={match} />}
                          </Route>
                          <Route exact path='/assessment/'>
                            {({ match }) => <ViewAssessments match={match} />}
                          </Route>
                          <Route exact path='/assessment/:assessmentId/attempt'>
                            {({ match }) => <AssessmentAttemption match={match} />}
                          </Route>
                          <Route exact path='/student-strength'>
                            {({ match }) => <StudentStrength match={match} />}
                          </Route>
                          <Route exact path='/student-id-card'>
                            {({ match }) => <StudentIdCard match={match} />}
                          </Route>
                          <Route exact path='/master-management/signature-upload'>
                            {({ match }) => <SignatureUpload match={match} />}
                          </Route>
                          <Route exact path='/online-class/attend-class'>
                            {({ match }) => <TeacherBatchView match={match} />}
                          </Route>
                          <Route exact path='/online-class/teacher-view-class'>
                            {({ match }) => <TeacherBatchView match={match} />}
                          </Route>
                          <Route exact path='/aol-reshuffle/:id?'>
                            {({ match }) => <Reshuffle match={match} />}
                          </Route>
                          <Route exact path='/erp-online-class'>
                            {({ match }) => <ErpAdminViewClass match={match} />}
                          </Route>
                          <Route exact path='/erp-online-class-teacher-view'>
                            {({ match }) => <ErpAdminViewClass match={match} />}
                          </Route>
                          <Route exact path='/erp-online-class-student-view'>
                            {({ match }) => <ErpAdminViewClass match={match} />}
                          </Route>
                          <Route exact path='/erp-online-resources'>
                            {({ match }) => <OnlineClassResource match={match} />}
                          </Route>
                          <Route exact path='/online-class/attendance-teacher-view'>
                            {({ match }) => <OnlineAttendanceTeacherView match={match} />}
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
                          <Route exact path='/feeType/miscFeeType'>
                            {({ match }) => <MiscFeeType match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/feeType/normalFeeType'>
                            {({ match }) => <FeeType match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/feeType/CurricularFeeType'>
                            {({ match }) => <CurrFeeType match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/feeType/OtherFeeType'>
                            {({ match }) => (
                              <AdminOtherFees match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/feeType/add_otherFee'>
                            {({ match }) => <AddOtherFees match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/feeType/assign_other_fees'>
                            {({ match }) => (
                              <AssignOtherFees match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/feeType/RegistrationFee'>
                            {({ match }) => (
                              <RegistrationFee match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/feePlan/ViewFeePlan'>
                            {({ match }) => <CreateFeePlan match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/ConcessionSetting'>
                            {({ match }) => (
                              <ConcessionSettings match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Ledger'>
                            {({ match }) => <Ledger match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/TotalPaidReport'>
                            {({ match }) => (
                              <TotalPaidReports match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/OtherFeeTotalPaidReport'>
                            {({ match }) => (
                              <OtherFeeTotalPaidReports match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/TallyReport'>
                            {({ match }) => <TallyReports match={match} alert={alert} />}
                          </Route>
                          <Route
                            exact
                            path='/finance/Application/registration/ReceiptBook'
                          >
                            {({ match }) => (
                              <ReceiptBookAdm match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/WalletReport'>
                            {({ match }) => <WalletReport match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/TransactionStatus'>
                            {({ match }) => (
                              <TransactionStatus match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/ConcessionReport'>
                            {({ match }) => (
                              <ConcessionReport match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/ChequeBounceReport'>
                            {({ match }) => (
                              <ChequeBounceReport match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/StudentShuffleRequest'>
                            {({ match }) => (
                              <StudentShuffle match={match} alert={alert} />
                            )}
                          </Route>
                          {/* <Route exact path='/finance/Requestshuffle'>
                  {({ match }) => <RequestShuffle match={match} />}
                </Route> */}
                          <Route exact path='/finance/approve_pendingRequest'>
                            {({ match }) => (
                              <ApprovePendingReq match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/MiscFeeClass'>
                            {({ match }) => <MiscFeeClass match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/AssignCoupon'>
                            {({ match }) => <AssignCoupon match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/CreateCoupon'>
                            {({ match }) => <CreateCoupon match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/DepositTab'>
                            {({ match }) => <DepositeTab match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/TotalFormReport'>
                            {({ match }) => (
                              <TotalFormCount match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Requestshuffle'>
                            {({ match }) => (
                              <RequestShuffle match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/UnassignFeeRequests'>
                            {({ match }) => (
                              <UnassignFeeRequests match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/approval_request'>
                            {({ match }) => (
                              <ApprovalRequest match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/pending_request'>
                            {({ match }) => (
                              <PendingRequest match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/editTransactionDetails'>
                            {({ match }) => (
                              <EditTransactionDetails match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/rejected_request'>
                            {({ match }) => (
                              <rejectedRequest match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/ReceiptRange'>
                            {({ match }) => <CreateReceipt match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/StoreReport'>
                            {({ match }) => <StoreReport match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/add_feePlan'>
                            {({ match }) => <AddFeePlan match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/student/LegerTab'>
                            {({ match }) => (
                              <StudentLedgerTab match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/manage_feeType/'>
                            {({ match }) => <ManageFeeType match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/admissions/registrationForm/'>
                            {({ match }) => (
                              <RegistrationForm match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/accountant/newregistrationForm'>
                            {({ match }) => (
                              <NewRegistration match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/accountant/admissionForm'>
                            {({ match }) => (
                              <AdmissionFormAcc match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/customizedAdmissionForm'>
                            {({ match }) => (
                              <CustomizedAdmissionForm match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/newAdmissionForm'>
                            {({ match }) => (
                              <NewAdmissionForm match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/accountant/applicationFrom'>
                            {({ match }) => (
                              <ApplicationFormAcc match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/accountant/NonRTEFormAcc'>
                            {({ match }) => <NonRTEFormAcc match={match} alert={alert} />}
                          </Route>
                          {/* <Route exact path='/finance/accountat/pendingOnlineadmission'>
                  {({ match }) => <OnlineAdmission match={match} />}
                </Route> */}
                          <Route exact path='/finance/BankAndFeeAccounts'>
                            {({ match }) => <TabView match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/Bank'>
                            {({ match }) => <Bank match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/ViewBank'>
                            {({ match }) => <ViewBanks match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/ViewFeeAccounts'>
                            {({ match }) => (
                              <ViewFeeAccounts match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/AccToClass'>
                            {({ match }) => <AccToClass match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/AccToBranch'>
                            {({ match }) => <AccToBranch match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/AccToStore'>
                            {({ match }) => <AccToStore match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/Setting/LastDateSetting'>
                            {({ match }) => (
                              <LastDateSettings match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Setting/ReceiptSettings'>
                            {({ match }) => (
                              <ReceiptSettings match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/BulkOperation/Feestructure'>
                            {({ match }) => <BulkFeeUpload match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/StudentWallet'>
                            {({ match }) => <StudentWallet match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/student/FeeCollection'>
                            {({ match }) => <FeeCollection match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/feeShowList/'>
                            {({ match }) => <FeeShowList match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/student/AssignDeliveryCharge'>
                            {({ match }) => (
                              <AssignDelieveryCharge match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/student/ChnageFeePlanToStudent'>
                            {({ match }) => (
                              <ChangeFeePlanToStudent match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/BulkOperation/BulkReportUpload'>
                            {({ match }) => (
                              <BulkReportUpload match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/BulkOperation/AccountantLogin'>
                            {({ match }) => (
                              <AccountantLogin match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/BulkOperation/BulkUploadStatus'>
                            {({ match }) => (
                              <BulkReportStatus match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/BulkOperation/UploadOnlinePayment'>
                            {({ match }) => <OnlinePayment match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/BulkOperation/BulkActiveInactive'>
                            {({ match }) => (
                              <BulkActiveInactive match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/BulkOperation/BulkActiveInactiveParent'
                          >
                            {({ match }) => (
                              <BulkActiveInactiveParent match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Student/ActiveInactive'>
                            {({ match }) => (
                              <StudentActivateInactiveAcc match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Student/ActiveInactive/Admin'>
                            {({ match }) => (
                              <ActivateInactivateStudentAdm match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/admissions/OnlineAdmission'>
                            {({ match }) => (
                              <OnlineAdmission match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Student/StudentPromotion'>
                            {({ match }) => (
                              <StudentPromotion match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Student/OqCodeGenerate'>
                            {({ match }) => (
                              <QRCodeGenerator match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Student/Communication'>
                            {({ match }) => (
                              <CommunicationSMS match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Student/IncomeTaxCertificate'>
                            {({ match }) => <ItCertificate match={match} alert={alert} />}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/FeePaymentRequests'
                          >
                            {({ match }) => (
                              <FeePaymentChangeRequests match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/StorePaymentRequests'
                          >
                            {({ match }) => (
                              <StorePaymentRequests match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/ApprovedStorePaymentRequests'
                          >
                            {({ match }) => (
                              <ApprovedStoreRequests match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/RejectedStorePaymentRequests'
                          >
                            {({ match }) => (
                              <RejectedStoreRequests match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/CancelledStorePaymentRequests'
                          >
                            {({ match }) => (
                              <CancelledStoreRequests match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/PendingStorePaymentRequests'
                          >
                            {({ match }) => (
                              <PendingStoreRequests match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/ApprovedPaymentRequests'
                          >
                            {({ match }) => (
                              <ApprovedRequestView match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/RejectedPaymentRequests'
                          >
                            {({ match }) => (
                              <RejectedRequestView match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/CancelledPaymentRequests'
                          >
                            {({ match }) => (
                              <CancelledRequestView match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/PendingPaymentRequests'
                          >
                            {({ match }) => (
                              <PendingRequestView match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/AcceptRejectPayment'
                          >
                            {({ match }) => (
                              <AcceptRejectPayment match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Approval/Requests/PostDateCheque'>
                            {({ match }) => (
                              <PostDateCheque match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/student/studentInfo'>
                            {({ match }) => (
                              <StudentInfoAdm match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/E-Mandate/BillingDetails'>
                            {({ match }) => (
                              <BillingDetails match={match} alert={alert} />
                            )}
                          </Route>
                          <Route
                            exact
                            path='/finance/E-Mandate/GenerateSubsequentPayment'
                          >
                            {({ match }) => (
                              <GenerateSubsequentPayment match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/E-Mandate/AddBranch'>
                            {({ match }) => <EMandate match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/E-Mandate/CreateLink'>
                            {({ match }) => <CreateLink match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/E-Mandate/CustomerDetails'>
                            {({ match }) => (
                              <CustomerDeatils match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/E-Mandate/AdminCustomerDetails'>
                            {({ match }) => (
                              <CustomerDeatils match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/E-Mandate/OrderDetails'>
                            {({ match }) => <OrderDetails match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/E-Mandate/TotalBillingDetails'>
                            {({ match }) => (
                              <DailyBillingDetails match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/student_shuffle'>
                            {({ match }) => (
                              <StudentShuffleReq match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Expanse Management/PettyExpense'>
                            {({ match }) => <PettyExpenses match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/Expanse Management/MakeEntry'>
                            {({ match }) => <MakeEntry match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/Expanse Management/CashReport'>
                            {({ match }) => <CashReport match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/Expanse Management/BankReport'>
                            {({ match }) => <BankReport match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/Expanse Management/LedgerReport'>
                            {({ match }) => <LedgerReport match={match} alert={alert} />}
                          </Route>
                          <Route
                            exact
                            path='/finance/Expanse Management/FinancialLedgerReport'
                          >
                            {({ match }) => (
                              <FinancialLedgerReport match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/Expanse Management/PartyList'>
                            {({ match }) => <Party match={match} alert={alert} />}
                          </Route>
                          <Route
                            exact
                            path='/finance/Approval/Requests/StudentShuffleRequest'
                          >
                            {({ match }) => (
                              <StudentShuffleReq match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/ManagePayments'>
                            {({ match }) => <ManagePayment match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/FeeStructure'>
                            {({ match }) => <FeeStructure match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/BooksAndUniform'>
                            {({ match }) => <BulkUniform match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/ShippingPayment'>
                            {({ match }) => (
                              <ShippingAmount match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/Store/AddItems'>
                            {({ match }) => <AddItems match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/Store/CreateKit'>
                            {({ match }) => <Kit match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/Store/SubCategoryAllow'>
                            {({ match }) => (
                              <SubCategoryAllow match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/admissions/UpdateRegistrationForm/'>
                            {({ match }) => (
                              <UpdateAdmissionForm match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/Store/AddGst'>
                            {({ match }) => <AddGst match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/Store/OrderStatusUpload'>
                            {({ match }) => (
                              <OrderStatusUpload match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/finance/ReceiptBook'>
                            {({ match }) => <ReceiptBook match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/appformlist'>
                            {({ match }) => <AppFormList match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/regformlist'>
                            {({ match }) => <RegFormList match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/admformlist'>
                            {({ match }) => <AdmFormList match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/fee_payment/'>
                            {({ match }) => <Airpay match={match} alert={alert} />}
                          </Route>
                          <Route exact path='/finance/upload_file'>
                            {({ match }) => (
                              <UploadPaymentFile match={match} alert={alert} />
                            )}
                          </Route>
                          <Route exact path='/markattendance'>
                            {({ match }) => <MarkAttedance match={match} />}
                          </Route>
                          <Route exact path='/attendance-calendar/teacher-view'>
                            {({ match }) => <AttedanceCalender match={match} />}
                          </Route>
                          <Route exact path='/attendance-calendar/student-view'>
                            {({ match }) => <AttedanceCalender match={match} />}
                          </Route>
                          <Route exact path='/teacher-view/attendance'>
                            {({ match }) => <Attendance match={match} />}
                          </Route>
                          <Route exact path='/student-view/attendance'>
                            {({ match }) => <Attendance match={match} />}
                          </Route>
                          <Route exact path='/OverallAttendance'>
                            {({ match }) => <OverallAttendance match={match} />}
                          </Route>
                          <Route exact path='/createEvent'>
                            {({ match, history }) => (
                              <CreateEvent match={match} history={history} />
                            )}
                          </Route>
                          <Route exact path='/event-category'>
                            {({ match }) => <EventCategory match={match} />}
                          </Route>
                          <Route exact path='/publications'>
                            {({ match }) => <Publications match={match} />}
                          </Route>
                          <Route exact path='/ebook/create'>
                            {({ match }) => <CreateEbook match={match} />}
                          </Route>
                          <Route exact path='/ebook/view'>
                            {({ match }) => <ViewEbook match={match} />}
                          </Route>
                          <Route exact path='/contact-us'>
                            {({ match }) => <ContactUs match={match} />}
                          </Route>
                          <Route exact path='/book-appointment'>
                            {({ match }) => <BookAppointment match={match} />}
                          </Route>
                          <Route exact path='/appointments'>
                            {({ match }) => <Appointments match={match} />}
                          </Route>
                          <Route exact path='/responder-view'>
                            {({ match }) => <ResponderView match={match} />}
                          </Route>
                          {/* <Route path='/griviences/admin-view'>
                            {({ match }) => <NewGrivience match={match} />}
                          </Route>
                          <Route path='/griviences/student-view'>
                            {({ match }) => <NewGrivience match={match} />}
                          </Route> */}
                          <Route path='/griviences/admin-view'>
                            {({ match }) => <Griviences match={match} />}
                          </Route>
                          <Route path='/admin-view'>
                            {({ match }) => <NewGrivience match={match} />}
                          </Route>
                          <Route path='/griviences/student-view'>
                            {({ match }) => <Griviences match={match} />}
                          </Route>
                          <Route path='/greviences/createnew'>
                            {({ match }) => <GriviencesCreate match={match} />}
                          </Route>
                          <Route exact path='/student-attendance-report'>
                            {({ match }) => <StudentAttendance match={match} />}
                          </Route>
                          <Route exact path='/orchadio/view-orchadio'>
                            {({ match }) => <ViewOrchadio match={match} />}
                          </Route>
                          <Route exact path='/orchadio/manage-orchadio'>
                            {({ match }) => <ManageOrchadio match={match} />}
                          </Route>
                          <Route exact path='/orchadio/add-orchadio'>
                            {({ match }) => <AddNewOrchadio match={match} />}
                          </Route>
                          <Route exact path='/homework-report-teacher-view'>
                            {({ match }) => <HomeWorkReportTeacher match={match} />}
                          </Route>
                          <Route exact path='/classwork-report-teacher-view'>
                            {({ match }) => <ClassWorkTeacherReport match={match} />}
                          </Route>
                          <Route exact path='/intelligent-book/view'>
                            {({ match }) => <AllBooksPage match={match} />}
                          </Route>
                          <Route
                            exact
                            path='/intelligent-book/:bookId/:bookUid/:localStorageName/:environment/:type'
                          >
                            {({ match }) => <ChapterBook match={match} />}
                          </Route>
                          <Route exact path='/intelligent-book/allbooks'>
                            {({ match }) => <ViewiBook match={match} />}
                          </Route>
                          <Route exact path='/intelligent-book/chapter-view'>
                            {({ match }) => <ViewiChapter match={match} />}
                          </Route>
                          <Route exact path='/setting'>
                            {({ match }) => <Setting match={match} />}
                          </Route>
                          <Route path='*'>
                            <ErrorBoundary404 HomeButton={true} />
                          </Route>
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
      <Alert />
    </div>
    // </ErrorBoundary404>
  );
}

const mapDispatchToProps = (dispatch) => ({
  alert: {
    success: (message) => dispatch(alertActions.success(message)),
    warning: (message) => dispatch(alertActions.warning(message)),
    error: (message) => dispatch(alertActions.error(message)),
  },
});
const mapStateToProps = (state) => {
  return {
    // isLoggedIn: state.authentication.loggedIn
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
