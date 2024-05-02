/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-use-before-define */

/* eslint-disable react/prop-types */
import FaqImage from 'assets/images/faq.png';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import { FilePdfOutlined } from '@ant-design/icons';
import endpointsV2 from 'v2/config/endpoints';
import React, { useState, useEffect, useRef, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useLocation, useHistory } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@material-ui/core';
import { Modal, Result, Spin } from 'antd';
import endpoints from '../../config/endpoints';
import useStyles from './useStyles';
import './styles.scss';
import 'v2/Assets/css/antdTab.css';
import 'v2/Assets/css/antdModal.css';
import 'v2/Assets/css/table.scss';
import 'v2/Assets/css/antdDrawer.css';
import 'v2/Assets/css/timeline.scss';
import Appbar from './Appbar';
import TopBar from 'v2/Layout/TopBar';
import SideBarV2 from 'v2/Layout/SideBar';
import {
  fetchThemeApi,
  isFetchThemeRequired,
} from '../../utility-functions/themeGenerator';
import Footer from '../footer/index';
import AppSearchBarUseStyles from './AppSearchBarUseStyles';
import ENVCONFIG from 'config/config';
import SideBar from './Sidebar';
import { IsV2Checker } from 'v2/isV2Checker';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
export const ContainerContext = createContext();
// const isV2 = localStorage.getItem('isV2');

const Layout = ({ children, history }) => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const isV2 = IsV2Checker();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [navigationData, setNavigationData] = useState(false);
  const [superUser, setSuperUser] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const isLayoutHidden = searchParams.get('wb_view');
  let token = JSON.parse(localStorage.getItem('userDetails'))?.token || '';
  let {
    user_level: userLevel,
    first_name,
    last_name,
  } = JSON.parse(localStorage.getItem('userDetails')) || '';
  const [branchesmapped, setBranchesMapped] = useState(true);

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const { selectedBranch, branchList } = useSelector(
    (state) => state.commonFilterReducer
  );
  const {
    apiGateway: { baseURLCentral, baseUdaan, baseEvent },
    s3: { BUCKET: s3BUCKET, ERP_BUCKET },
  } = ENVCONFIG;

  const erp_config = JSON.parse(localStorage.getItem('userDetails'))?.erp_config;
  var CryptoJS = require('crypto-js');

  var erp_details = CryptoJS.AES.encrypt(JSON.stringify(token), 'erp-details').toString();

  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const navHistory = useHistory();
  const module = JSON.parse(localStorage.getItem('child_module_id'));
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const [modalVisible, setModalVisible] = useState(false);
  const [moduleData, setModuleData] = useState([]);

  const routes = [
    { key: 'Take Class', path: '/take-class' },
    { key: 'View Class', path: window.location.host === endpoints?.aolConfirmURL ? '/online-class/view-class' : '/erp-online-class' },
    { key: 'Resources', path: '/online-class/resource' },
    { key: 'Workshop', path: '/online-class/workshop' },
    { key: 'Attend Online Class', path: window.location.host === endpoints?.aolConfirmURL ? '/online-class/attend-class' : '/erp-online-class-student-view' },
    { key: 'Teacher View Class', path: window.location.host === endpoints?.aolConfirmURL ? '/online-class/teacher-view-class' : '/erp-online-class-teacher-view' },
    { key: 'Create Class', path: '/online-class/create-class' },
    { key: 'Attendance Teacher View', path: '/online-class/attendance-teacher-view' },
    { key: 'Online Class', path: '/create-class' },
    { key: 'Online Class', path: '/aol-view' },
    { key: 'Configuration', path: '/homework/admin' },
    { key: 'Management View', path: '/homework/coordinator' },
    { key: 'Student Homework', path: '/homework/student' },
    { key: 'Teacher Homework', path: '/homework/teacher' },
    { key: 'Centralized Homework', path: '/homework/centralized' },
    { key: 'Upload Homework', path: '/centralized-homework/homework-upload-status' },
    { key: 'Teacher Classwork Report', path: '/classwork-report-teacher-view' },
    { key: 'Student Classwork Report', path: '/classwork/student-report' },
    { key: 'Teacher Homework Report', path: '/homework-report-teacher-view' },
    { key: 'Student Homework Report', path: '/homework/student-report' },
    { key: 'Communication', path: '/communication' },
    { key: 'Add Group', path: '/addgroup' },
    { key: 'View Role', path: '/role-management' },
    { key: 'User Groups', path: '/viewgroup' },
    { key: 'View Publication', path: '/publications' },
    { key: 'Announcement', path: '/announcement-list' },
    { key: 'Send Message', path: '/communication/sendmessage' },
    { key: 'Add SMS Credit', path: '/communication/smscredit' },
    { key: 'SMS&Email Log', path: '/communication/messageLog' },
    { key: 'Dashboard', path: '/dashboard' },
    { key: 'User Management', path: '/user-management' },
    { key: 'OnBoarding Report', path: '/onboarding-report' },
    { key: 'Ebook View', path: '/ebook/view' },
    { key: 'Online Books', path: '/online-books/' },
    { key: 'Ibook View', path: '/intelligent-book/view' },
    { key: 'Create User', path: '/user-management/create-user' },
    { key: 'Bulk Upload Status', path: '/user-management/bulk-upload' },
    { key: 'Bulk Status Upload', path: '/finance/BulkOperation/BulkUploadStatus' },
    { key: 'View User', path: '/user-management/view-users' },
    { key: 'Section Shuffle', path: '/user-management/section-shuffling' },
    { key: 'Virtual School', path: '/virtual-school' },
    { key: 'Access-Blocker', path: '/user-management/access-blocker' },
    { key: 'Assign Role', path: '/user-management/assign-role' },
    { key: 'Branch', path: '/master-management/branch-table' },
    { key: 'Branch Acad Mapping', path: '/master-management/branch-acad-table' },
    { key: 'Subject Mapping', path: '/master-management/subject-mapping-table' },
    { key: 'Subject', path: '/master-management/subject-table' },
    { key: 'Section Mapping', path: '/master-management/section-mapping-table' },
    { key: 'Chapter Creation', path: '/master-management/chapter-type-table' },
    { key: 'Topic', path: '/master-management/topic-table' },
    { key: 'Section', path: '/master-management/section-table' },
    { key: 'Grade', path: '/master-management/grade-table' },
    { key: 'Academic Year', path: '/master-management/academic-year-table' },
    { key: 'Message Type', path: '/master-management/message-type-table' },
    { key: 'Signature Upload', path: '/master-management/signature-upload' },
    { key: 'Event Category', path: '/master-management/event-category' },
    { key: 'System Config', path: '/master-management/system-config' },
    { key: 'Discussion Category', path: '/master-management/discussion-category' },
    { key: 'Course', path: '/course-list' },
    { key: 'Course Price', path: '/course-price' },
    { key: 'Content Mapping', path: '/subject/grade' },
    { key: 'Teacher Forum', path: '/teacher-forum' },
    { key: 'Student Forum', path: '/student-forum' },
    { key: 'homework-teacher', path: '/homework/teacher' },
    { key: 'Teacher View', path: isV2 ? '/lesson-plan/teacher-view/period-view' : '/lesson-plan/teacher-view' },
    { key: 'Student View', path: isV2 ? '/lesson-plan/student-view/period-view' : '/lesson-plan/student-view' },
    { key: 'Assign Transport Fees', path: '/feeType/assign_other_fees' },
    { key: 'App/Reg Fee Type', path: '/feeType/RegistrationFee' },
    { key: 'Teacher Calendar', path: '/attendance-calendar/teacher-view' },
    { key: 'Student Calendar', path: '/attendance-calendar/student-view' },
    { key: 'Management Report', path: '/lesson-plan/report' },
    { key: 'Graphical Report', path: '/lesson-plan/graph-report' },
    { key: 'discussion-forum', path: '/discussion-forum' },
    { key: 'Student Blogs', path: '/blog/student/dashboard' },
    { key: 'Teacher Blogs', path: '/blog/teacher' },
    { key: 'Management Blogs', path: '/blog/admin' },
    { key: 'Principal Blogs', path: '/blog/principal' },
    { key: 'Application/registration Receipt Book', path: '/finance/Application/registration/ReceiptBook' },
    { key: 'Genre', path: '/blog/genre' },
    { key: 'Word Count Configuration', path: '/blog/wordcount-config' },
    { key: 'Student Diary', path: '/diary/student' },
    { key: 'Teacher Diary', path: '/diary/teacher' },
    { key: 'Student Shuffle', path: '/finance/StudentShuffleRequest' },
    { key: 'Question Bank', path: '/question-chapter-wise' },
    { key: 'Question Paper', path: '/assessment-question' },
    { key: 'Create Test', path: '/assesment' },
    { key: 'View Attendance', path: userLevel == 13 ? '/student-attendance-dashboard' : '/teacher-attendance-verify' },
    { key: 'Mark Student Attendance', path: '/mark-student-attendance' },
    { key: 'Mark Staff Attendance', path: '/mark-staff-attendance' },
    { key: 'Take Test', path: '/assessment' },
    { key: 'Individual Student Report', path: '/assessment-student-report' },
    { key: 'Assessment Report', path: '/assessment-reports' },
    { key: 'Report Card', path: '/assessment/report-card' },
    { key: 'Marks Upload', path: '/assessment/marks-upload' },
    { key: 'Report Card Pipeline', path: '/assessment/report-card-pipeline' },
    { key: 'Report Card Category', path: '/assessment/category' },
    { key: 'Report Card Config', path: '/assessment/report-config' },
    { key: 'Grading System Config', path: '/assessment/grading-system' },
    { key: 'ID Card View', path: '/student-id-card' },
    { key: 'View School Strength', path: '/student-strength' },
    { key: 'Signature Upload', path: '/master-management/signature-upload' },
    { key: 'Teacher Circular', path: '/teacher-circular' },
    { key: 'Student Circular', path: '/student-circular' },
    { key: 'Grievance Teacher', action: () => window.open(`${ENVCONFIG?.apiGateway?.finance}/sso/ticket/${token}#/auth/login`, '_blank') },
    { key: 'Grievance Student', action: () => window.open(`${ENVCONFIG?.apiGateway?.finance}/sso/ticket/${token}#/auth/login`, '_blank') },
    { key: 'Normal Fee Type', path: '/feeType/normalFeeType' },
    { key: 'Misc. Fee Type', path: '/feeType/miscFeeType' },
    { key: 'Curricular Fee Type', path: '/feeType/CurricularFeeType' },
    { key: 'Add Transport Fees', path: '/feeType/OtherFeeType' },
    { key: 'Assign Transport Fees', path: '/feeType/assign_other_fees' },
    { key: 'App/Reg Fee Type', path: '/feeType/RegistrationFee' },
    { key: 'View Fee Plan', path: '/feePlan/ViewFeePlan' },
    { key: 'Concession Settings', path: '/finance/ConcessionSetting' },
    { key: 'Ledger', path: '/finance/Ledger' },
    { key: 'Total Paid and Due Report', path: '/finance/TotalPaidReport' },
    { key: 'Other Fee Total Paid and Due Report', path: '/finance/OtherFeeTotalPaidReport' },
    { key: 'Tally Report', path: '/finance/TallyReport' },
    { key: 'Application/registration Receipt Book', path: '/finance/Application/registration/ReceiptBook' },
    { key: 'Wallet Report', path: '/finance/WalletReport' },
    { key: 'Concession Report', path: '/finance/ConcessionReport' },
    { key: 'Bounce Report', path: '/finance/ChequeBounceReport' },
    { key: 'Student Shuffle', path: '/finance/StudentShuffleRequest' },
    { key: 'Misc. Fee Class', path: '/finance/MiscFeeClass' },
    { key: 'Assign Coupon', path: '/finance/AssignCoupon' },
    { key: 'Create Coupon', path: '/finance/CreateCoupon' },
    { key: 'Deposit', path: '/finance/DepositTab' },
    { key: 'Total Forms & Report', path: '/finance/TotalFormReport' },
    { key: 'Unassign Fee Requests', path: '/finance/UnassignFeeRequests' },
    { key: 'Create Receipt Ranges', path: '/finance/ReceiptRange' },
    { key: 'Store Report', path: '/finance/StoreReport' },
    { key: 'Ledger Tab', path: '/student/LegerTab' },
    { key: 'Registration Form', path: '/admissions/registrationForm/' },
    { key: 'Admission Form', path: '/finance/accountant/admissionForm' },
    { key: 'Application Form', path: '/finance/accountant/applicationFrom' },
    { key: 'Online Admissions', path: '/finance/admissions/OnlineAdmission' },
    { key: 'Manage Bank & Fee Accounts', path: '/finance/BankAndFeeAccounts' },
    { key: 'Last Date Settings', path: '/finance/Setting/LastDateSetting' },
    { key: 'Receipt Settings', path: '/finance/Setting/ReceiptSettings' },
    { key: 'Fee Structure Upload', path: '/finance/BulkOperation/Feestructure' },
    { key: 'Student Wallet', path: '/finance/studentwallet' },
    { key: 'Fee Collection', path: '/finance/student/FeeCollection' },
    { key: 'Assign Delivery charge kit books & uniform', path: '/finance/student/AssignDeliveryCharge' },
    { key: 'Assign / Change fee plan', path: '/finance/student/ChnageFeePlanToStudent' },
    { key: 'Bulk Report Upload', path: '/finance/BulkOperation/BulkReportUpload' },
    { key: 'Bulk Upload Status', path: '/finance/BulkOperation/BulkUploadStatus' },
    { key: 'Upload Online Payments', path: '/finance/BulkOperation/UploadOnlinePayment' },
    { key: 'Permanent Active / Inactive', path: '/finance/BulkOperation/BulkActiveInactive' },
    { key: 'Temporary Active / Inactive', path: '/finance/BulkOperation/BulkActiveInactiveParent' },
    { key: 'Active/Inactive', path: '/finance/Student/ActiveInactive' },
    { key: 'Student Active/Inactive', path: '/finance/Student/ActiveInactive/Admin' },
    { key: 'Student Promotion', path: '/finance/Student/StudentPromotion' },
    { key: 'QR code', path: '/finance/Student/OqCodeGenerate' },
    { key: 'Communications', path: '/finance/Student/Communication' },
    { key: 'Income Tax Certificate', path: '/finance/Student/IncomeTaxCertificate' },
    { key: 'Fee Pay Request', path: '/finance/Approval/Requests/FeePaymentRequests' },
    { key: 'Store Pay Request', path: '/finance/Approval/Requests/StorePaymentRequests' },
    { key: 'Accept and Reject payments', path: '/finance/Approval/Requests/AcceptRejectPayment' },
    { key: 'Post Dated cheque', path: '/finance/Approval/Requests/PostDateCheque' },
    { key: 'Billing Details', path: '/finance/E-Mandate/BillingDetails' },
    { key: 'Generate Subsequent Payment', path: '/finance/E-Mandate/GenerateSubsequentPayment' },
    { key: 'Add Branch', path: '/finance/E-Mandate/AddBranch' },
    { key: 'Customer Details', path: '/finance/E-Mandate/CustomerDetails' },
    { key: 'Add Customer Details', path: '/finance/E-Mandate/AdminCustomerDetails' },
    { key: 'Add Order Details', path: '/finance/E-Mandate/OrderDetails' },
    { key: 'Order Details', path: '/finance/E-Mandate/OrderDetails' },
    { key: 'Total Billing Details', path: '/finance/E-Mandate/TotalBillingDetails' },
    { key: 'Create Link', path: '/finance/E-Mandate/CreateLink' },
    { key: 'Petty Cash Expense', path: '/finance/Expanse Management/PettyExpense' },
    { key: 'Student Info', path: '/finance/student/studentInfo' },
    { key: 'Party List', path: '/finance/Expanse Management/PartyList' },
    { key: 'Student Shuffle Requests', path: '/finance/Approval/Requests/StudentShuffleRequest' },
    { key: 'Manage Payment', path: '/finance/ManagePayments' },
    { key: 'Fee Structure', path: '/finance/FeeStructure' },
    { key: 'Books & Uniform', path: '/finance/student_store' },
    { key: 'Shipping Payment', path: '/finance/ShippingPayment' },
    { key: 'School store', path: '/Store/AddItems' },
    { key: 'Kit', path: '/Store/CreateKit' },
    { key: 'sub Category allow', path: '/Store/SubCategoryAllow' },
    { key: 'Accountant Login', path: '/finance/BulkOperation/AccountantLogin' },
    { key: 'Add Gst', path: '/Store/AddGst' },
    { key: 'Order Status Upload', path: '/Store/OrderStatusUpload' },
    { key: 'Receipt Book', path: '/finance/ReceiptBook' },
    { key: 'Transactions Report', path: '/finance/TransactionStatus' },
    { key: 'Teacher Time Table', path: '/timetable/teacherview' },
    { key: 'Student Time Table', path: '/timetable/studentview' },
    { key: 'Book Appointment', path: '/appointments' },
    { key: 'Appointment Responder', path: '/responder-view' },
    { key: 'Contact Us', path: '/contact-us' },
    { key: 'Student Attendance Report', path: '/student-attendance-report' },
    { key: 'Manage Orchadio', path: '/orchadio/manage-orchadio' },
    { key: 'Student Orchadio', path: '/orchadio/view-orchadio' },
    { key: 'Teacher Homework Report', path: '/homework-report-teacher-view' },
    { key: 'Teacher Classwork Report', path: '/classwork-report-teacher-view' },
    { key: 'Subject Training', path: '/subjectTrain' },
    { key: 'Enroll Courses', path: '/enrollTrainingfCourses' },
    { key: 'Enrolled Courses', path: '/enrolledSelfCourses' },
    { key: 'Induction Training', path: '/inductionTrain' },
    { key: 'Treasure Box', path: '/tressurebox' },
    { key: 'My Notes', path: '/learning-notes' },
    { key: 'Calendar', path: '/inhouse_calendar' },
    { key: 'Learning', path: '/learningVideos' },
    { key: 'Notification', path: '/View_notification' },
    { key: 'Blogs', path: '/blogSureLearning' },
    { key: 'Trainer Driven Courses', path: '/trainerDriven' },
    { key: 'Self Driven Courses', path: '/assignedCoursesByCordinator' },
    { key: 'All/Completed Courses', path: '/sure_learning/completed_courses' },
    { key: 'Class Initiation Form', path: '/sure_learning/class_initiation_form' },
    { key: 'Initiate Class', path: '/sure_learning/initiate_class' },
    { key: 'Resources', path: '/sure_learning/resources' },
    { key: 'Assessment Scores', path: '/sure_learning/assessment_report' },
    { key: 'View Finance', path: `https://uidev.erpfinance.letseduvate.com/sso/${token}` },
    { key: 'Event Tracker', path: `${baseEvent}?${token}` },
    { key: 'Create Area', path: '/observation-area' },
    { key: 'Create Observation', path: '/observation' },
    { key: 'Evaluation', path: '/observation-evalutaion' },
    { key: 'Observation Report', path: '/observation-report' },
    { key: 'Create Activity', path: '/blog/create' },
    { key: 'My Blogs', path: '/blog/wall/redirect' },
    { key: 'Blog Activity', path: '/blog/wall/central/redirect' },
    { key: 'Create Activity Type', path: '/blog/createactivitytype' },
    { key: 'School Wall', path: '/blog/wall' },
    { key: 'Blog', path: '/blog/activityreview' },
    { key: 'Create Rating', path: '/blog/createratingtype' },
    { key: 'Class Section Wise Strength', path: '/student_count_report' },
    { key: 'Connection pod', path: '/online-class/connection-pod' },
    { key: 'Assign User Level', path: '/user-level-table' },
    { key: 'Trainee Courses', path: '/sure-learning-trainee-courses' },
    { key: 'Assign Trainee', path: '/sure-learning-assign-teacher' },
    { key: 'Reassign Trainee', path: '/sure-learning-re-assign-teacher' },
    { key: 'Assessment Review', path: '/sure-learning-assessment-review' },
    { key: 'Report', path: '/sure-learning-course-wise-user-report' },
    { key: 'Branch wise report', path: '/sure-learning-branch-level-detailed-report' },
    { key: 'Enroll Self Courses', path: '/enrollTrainingfCourses' },
    { key: 'Self Courses', path: '/assignedCoursesByCordinator' },
    { key: 'Assign Lead Teacher\n', path: '/sure-learning-assign-lead-teacher' },
    { key: 'Consolidated Report', path: '/sure-learning-consolidated-report' },
    { key: 'Weekly Report', path: '/sure-learning-weekly-report' },
    { key: 'Assign Teacher', path: '/sure-learning/assign-teacher' },
    { key: 'Curriculum Completion', path: '/curriculum-completion-student-subject/' },
    { key: 'File Category', path: '/file-category/' },
    { key: 'Non Academic Staff', path: '/user-management/non-academic-staff' },
    { key: 'Activity Dashboard', path: '/activity-management-dashboard' },
    { key: 'FAQ', path: '/frequentlyAskedQuestions' }
  ];

  useEffect(() => {
    const navigationData = localStorage.getItem('navigationData');
    if (navigationData) {
      setNavigationData(JSON.parse(navigationData));
    }
    let userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      const { is_superuser = false } = userDetails;
      setSuperUser(is_superuser);
    }
    // setBranchesMapped(sessionStorage.getItem('selected_branch') === null ? false : true);
    if (containerRef.scrollTop > 50) {
      containerRef.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (isLogout) {
      window.location.href = '/';
      setIsLogout(false);
    }
  }, [isLogout]);

  useEffect(() => {
    if (isFetchThemeRequired()) {
      fetchThemeApi();
    }
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem('isSessionChanged') === 'true') {
      if (selectedAcademicYear && sessionStorage.getItem('branch_list') !== null) {
        if (selectedBranch?.branch?.id !== undefined) {
          setBranchesMapped(true);
        } else {
          setBranchesMapped(false);
        }
      }
    }
  }, [selectedBranch, window.location.pathname]);

  function getChildId(childName, navigationData) {
    for (const ele of navigationData) {
      const name = ele?.child_module?.find((child) => child.child_name === childName);
      if (name) {
        return name?.child_id;
      }
    }
    return null;
  }
  
  useEffect(()=>{
    const moduleName = routes?.filter((ele)=>ele?.path == `${window?.location?.pathname}`)
    const navData = JSON.parse(localStorage.getItem('navigationData'))
    const moduleId = getChildId(moduleName[0]?.key, navData)
    axios
      .get(
        `${endpointsV2.FrequentlyAskedQuestions.FaqApi}?child_id=${moduleId}&user_level=${userDetails?.user_level}`,
        {
          headers: {
            Authorization: `Bearer ${userDetails?.token}`,
          },
        }
      )
      .then((res) => {
        if (res?.data) {
          setModuleData(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },[window?.location?.pathname])


  const classes = useStyles();
  const handleRouting = (name) => {
    switch (name) {
      case 'Take Class': {
        history.push('/take-class');
        break;
      }
      case 'View Class': {
        if (window.location.host === endpoints?.aolConfirmURL) {
          history.push('/online-class/view-class');
        } else {
          history.push('/erp-online-class');
        }
        break;
      }
      case 'Resources': {
        history.push('/online-class/resource');
        break;
      }
      case 'Workshop': {
        history.push('/online-class/workshop');
        break;
      }
      case 'Attend Online Class': {
        if (window.location.host === endpoints?.aolConfirmURL) {
          history.push('/online-class/attend-class');
        } else {
          history.push('/erp-online-class-student-view');
        }
        break;
      }
      case 'Teacher View Class': {
        if (window.location.host === endpoints?.aolConfirmURL) {
          history.push('/online-class/teacher-view-class');
        } else {
          history.push('/erp-online-class-teacher-view');
        }
        break;
      }
      case 'Create Class': {
        history.push('/online-class/create-class');
        break;
      }

      case 'Attendance Teacher View': {
        history.push('/online-class/attendance-teacher-view');
        break;
      }
      case 'Create Class': {
        history.push('/online-class/create-class');
        break;
      }
      case 'Online Class': {
        history.push('/create-class');
        break;
      }
      case 'Online Class': {
        history.push('/aol-view');
        break;
      }
      case 'Configuration': {
        history.push('/homework/admin');
        break;
      }
      case 'Management View': {
        history.push('/homework/coordinator');
        break;
      }
      case 'Student Homework': {
        history.push('/homework/student');
        break;
      }
      case 'Teacher Homework': {
        history.push('/homework/teacher');
        break;
      }
      case 'Centralized Homework': {
        history.push('/homework/centralized');
        break;
      }
      case 'Upload Homework': {
        history.push('/centralized-homework/homework-upload-status');
        break;
      }
      case 'Teacher Classwork Report': {
        history.push('/classwork-report-teacher-view');
        break;
      }
      case 'Student Classwork Report': {
        history.push('/classwork/student-report');
        break;
      }
      case 'Teacher Homework Report': {
        history.push('/homework-report-teacher-view');
        break;
      }
      case 'Student Homework Report': {
        history.push('/homework/student-report');
        break;
      }
      case 'Communication': {
        history.push('/communication');
        break;
      }
      case 'Add Group': {
        history.push('/addgroup');
        break;
      }
      case 'View Role': {
        history.push('/role-management');
        break;
      }
      case 'User Groups': {
        history.push('/viewgroup');
        break;
      }
      case 'View Publication': {
        history.push('/publications');
        break;
      }
      case 'Announcement': {
        history.push('/announcement-list');
        break;
      }
      case 'Send Message': {
        history.push('/communication/sendmessage');
        break;
      }
      case 'Add SMS Credit': {
        history.push('/communication/smscredit');
        break;
      }
      case 'SMS&Email Log': {
        history.push('/communication/messageLog');
        break;
      }
      case 'Dashboard': {
        history.push('/dashboard');
        break;
      }
      // case 'user-management': {
      //   history.push('/user-management');
      //   break;
      // }
      // case 'create-user': {
      //   history.push('/user-management/create-user');
      //   break;
      // }
      // case 'bulk-upload': {
      //   history.push('/user-management/bulk-upload');
      //   break;
      // }
      // case 'view-users': {
      //   history.push('/user-management/view-users');
      //   break;
      // }
      // case 'assign-role': {
      //   history.push('/user-management/assign-role');
      //   break;
      // }
      case 'User Management': {
        history.push('/user-management');
        break;
      }
      case 'OnBoarding Report': {
        history.push('/onboarding-report');
        break;
      }
      case 'Ebook View': {
        history.push('/ebook/view');
        break;
      }
      case 'Online Books': {
        history.push('/online-books/');
        break;
      }
      case 'Ibook View': {
        history.push('/intelligent-book/view');
        break;
      }
      case 'Create User': {
        history.push('/user-management/create-user');
        break;
      }
      case 'Bulk Upload Status': {
        history.push('/user-management/bulk-upload');
        break;
      }
      case 'Bulk Status Upload': {
        history.push('/finance/BulkOperation/BulkUploadStatus');
        break;
      }
      case 'View User': {
        history.push('/user-management/view-users');
        break;
      }

      case 'Section Shuffle': {
        history.push('/user-management/section-shuffling');
        break;
      }
      case 'Virtual School': {
        history.push('/virtual-school');
        break;
      }
      case 'Access-Blocker': {
        history.push('/user-management/access-blocker');
        break;
      }
      case 'Assign Role': {
        history.push('/user-management/assign-role');
        break;
      }
      case 'Branch': {
        history.push('/master-management/branch-table');
        break;
      }
      case 'Branch Acad Mapping': {
        history.push('/master-management/branch-acad-table');
        break;
      }
      case 'Subject Mapping': {
        history.push('/master-management/subject-mapping-table');
        break;
      }
      case 'Subject': {
        history.push('/master-management/subject-table');
        break;
      }
      case 'Section Mapping': {
        history.push('/master-management/section-mapping-table');
        break;
      }
      case 'Chapter Creation': {
        history.push('/master-management/chapter-type-table');
        break;
      }
      case 'Topic': {
        history.push('/master-management/topic-table');
        break;
      }
      case 'Section': {
        history.push('/master-management/section-table');
        break;
      }
      case 'Grade': {
        history.push('/master-management/grade-table');
        break;
      }
      case 'Academic Year': {
        history.push('/master-management/academic-year-table');
        break;
      }
      case 'Message Type': {
        history.push('/master-management/message-type-table');
        break;
      }
      case 'Signature Upload': {
        history.push('/master-management/signature-upload');
        break;
      }
      case 'Event Category': {
        history.push('/master-management/event-category');
        break;
      }
      case 'System Config': {
        history.push('/master-management/system-config');
        break;
      }
      case 'Discussion Category': {
        history.push('/master-management/discussion-category');
        break;
      }
      case 'Course': {
        history.push('/course-list');
        break;
      }
      case 'Course Price': {
        history.push('/course-price');
        break;
      }
      case 'Content Mapping': {
        history.push('/subject/grade');
        break;
      }
      case 'Teacher Forum': {
        history.push('/teacher-forum');
        break;
      }
      case 'Student Forum': {
        history.push('/student-forum');
        break;
      }
      // case 'role-management': {
      //   history.push('/role-management');
      //   break;
      // }
      case 'homework-teacher': {
        history.push('/homework/teacher');
        break;
      }
      case 'Teacher View': {
        history.push(
          isV2 ? '/lesson-plan/teacher-view/period-view' : '/lesson-plan/teacher-view'
        );
        break;
      }
      case 'Student View': {
        history.push(
          isV2 ? '/lesson-plan/student-view/period-view' : '/lesson-plan/student-view'
        );
        break;
      }
      case 'Assign Transport Fees': {
        history.push('/feeType/assign_other_fees');
        break;
      }
      case 'App/Reg Fee Type': {
        history.push('/feeType/RegistrationFee');
        break;
      }
      case 'Teacher Calendar': {
        history.push('/attendance-calendar/teacher-view');
        break;
      }
      case 'Student Calendar': {
        history.push('/attendance-calendar/student-view');
        break;
      }
      case 'Management Report': {
        history.push('/lesson-plan/report');
        break;
      }
      case 'Graphical Report': {
        history.push('/lesson-plan/graph-report');
        break;
      }
      case 'discussion-forum': {
        history.push('/discussion-forum');
        break;
      }
      case 'Student Blogs': {
        history.push('/blog/student/dashboard');
        break;
      }
      case 'Teacher Blogs': {
        history.push('/blog/teacher');
        break;
      }
      case 'Management Blogs': {
        history.push('/blog/admin');
        break;
      }
      case 'Principal Blogs': {
        history.push('/blog/principal');
        break;
      }
      case 'Application/registration Receipt Book': {
        history.push('/finance/Application/registration/ReceiptBook');
        break;
      }
      case 'Genre': {
        history.push('/blog/genre');
        break;
      }
      case 'Word Count Configuration': {
        history.push('/blog/wordcount-config');
        break;
      }
      case 'Student Diary': {
        history.push('/diary/student');
        break;
      }
      case 'Teacher Diary': {
        history.push('/diary/teacher');
        break;
      }
      case 'Student Shuffle': {
        history.push('/finance/StudentShuffleRequest');
        break;
      }
      // case 'Assessment': {
      //   history.push('/assessment');
      //   break;
      // }
      // case 'ViewAssessment': {
      //   history.push('/assessment/view-assessment');
      //   break;
      // }
      case 'Question Bank': {
        history.push('/question-chapter-wise');
        break;
      }
      case 'Question Paper': {
        history.push('/assessment-question');
        break;
      }
      case 'Create Test': {
        history.push('/assesment');
        break;
      }
      case 'View Attendance': {
        history.push(
          userLevel == 13 ? '/student-attendance-dashboard' : '/teacher-attendance-verify'
        );

        break;
      }
      case 'Mark Student Attendance': {
        history.push('/mark-student-attendance');
        break;
      }
      case 'Mark Staff Attendance': {
        history.push('/mark-staff-attendance');
        break;
      }

      case 'Take Test': {
        history.push('/assessment');
        break;
      }
      case 'Individual Student Report': {
        history.push('/assessment-student-report');
        break;
      }
      case 'Assessment Report': {
        history.push('/assessment-reports');
        break;
      }
      // case 'Report Card Settings': {
      //   history.push('/assessment/report-card-settings');
      //   break;
      // }
      case 'Report Card': {
        history.push('/assessment/report-card');
        break;
      }
      case 'Marks Upload': {
        history.push('/assessment/marks-upload');
        break;
      }
      case 'Report Card Pipeline': {
        history.push('/assessment/report-card-pipeline');
        break;
      }
      case 'Report Card Category': {
        history.push('/assessment/category');
        break;
      }
      case 'Report Card Config': {
        history.push('/assessment/report-config');
        break;
      }
      case 'Grading System Config': {
        history.push('/assessment/grading-system');
        break;
      }
      case 'ID Card View': {
        history.push('/student-id-card');
        break;
      }
      case 'View School Strength': {
        history.push('/student-strength');
        break;
      }
      case 'Signature Upload': {
        history.push('/master-management/signature-upload');
        break;
      }
      case 'Teacher Circular': {
        history.push('/teacher-circular');
        break;
      }
      case 'Student Circular': {
        history.push('/student-circular');
        break;
      }

      case 'Grievance Teacher': {
        window.open(
          `${ENVCONFIG?.apiGateway?.finance}/sso/ticket/${token}#/auth/login`,
          '_blank'
        );
        break;
      }
      case 'Grievance Student': {
        window.open(
          `${ENVCONFIG?.apiGateway?.finance}/sso/ticket/${token}#/auth/login`,
          '_blank'
        );
        break;
      }

      case 'Normal Fee Type': {
        history.push('/feeType/normalFeeType');
        break;
      }
      case 'Misc. Fee Type': {
        history.push('/feeType/miscFeeType');
        break;
      }
      case 'Curricular Fee Type': {
        history.push('/feeType/CurricularFeeType');
        break;
      }
      case 'Add Transport Fees': {
        history.push('/feeType/OtherFeeType');
        break;
      }
      case 'Assign Transport Fees': {
        history.push('/feeType/assign_other_fees');
        break;
      }
      case 'App/Reg Fee Type': {
        history.push('/feeType/RegistrationFee');
        break;
      }
      case 'View Fee Plan': {
        history.push('/feePlan/ViewFeePlan');
        break;
      }
      case 'Concession Settings': {
        history.push('/finance/ConcessionSetting');
        break;
      }
      case 'Ledger': {
        history.push('/finance/Ledger');
        break;
      }
      case 'Total Paid and Due Report': {
        history.push('/finance/TotalPaidReport');
        break;
      }
      case 'Other Fee Total Paid and Due Report': {
        history.push('/finance/OtherFeeTotalPaidReport');
        break;
      }
      case 'Tally Report': {
        history.push('/finance/TallyReport');
        break;
      }
      case 'Application/registration Receipt Book': {
        history.push('/finance/Application/registration/ReceiptBook');
        break;
      }
      case 'Wallet Report': {
        history.push('/finance/WalletReport');
        break;
      }
      case 'Concession Report': {
        history.push('/finance/ConcessionReport');
        break;
      }
      case 'Bounce Report': {
        history.push('/finance/ChequeBounceReport');
        break;
      }
      case 'Student Shuffle': {
        history.push('/finance/StudentShuffleRequest');
        break;
      }
      case 'Misc. Fee Class': {
        history.push('/finance/MiscFeeClass');
        break;
      }
      case 'Assign Coupon': {
        history.push('/finance/AssignCoupon');
        break;
      }
      case 'Create Coupon': {
        history.push('/finance/CreateCoupon');
        break;
      }
      case 'Deposit': {
        history.push('/finance/DepositTab');
        break;
      }
      case 'Total Forms & Report': {
        history.push('/finance/TotalFormReport');
        break;
      }
      case 'Unassign Fee Requests': {
        history.push('/finance/UnassignFeeRequests');
        break;
      }
      case 'Create Receipt Ranges': {
        history.push('/finance/ReceiptRange');
        break;
      }
      case 'Store Report': {
        history.push('/finance/StoreReport');
        break;
      }
      case 'Ledger Tab': {
        history.push('/student/LegerTab');
        break;
      }
      case 'Registration Form': {
        history.push('/admissions/registrationForm/');
        break;
      }
      case 'Admission Form': {
        history.push('/finance/accountant/admissionForm');
        break;
      }
      case 'Application Form': {
        history.push('/finance/accountant/applicationFrom');
        break;
      }
      case 'Online Admissions': {
        history.push('/finance/admissions/OnlineAdmission');
        break;
      }
      case 'Manage Bank & Fee Accounts': {
        history.push('/finance/BankAndFeeAccounts');
        break;
      }
      case 'Last Date Settings': {
        history.push('/finance/Setting/LastDateSetting');
        break;
      }
      case 'Receipt Settings': {
        history.push('/finance/Setting/ReceiptSettings');
        break;
      }
      case 'Fee Structure Upload': {
        history.push('/finance/BulkOperation/Feestructure');
        break;
      }
      case 'Student Wallet': {
        history.push('/finance/studentwallet');
        break;
      }
      case 'Fee Collection': {
        history.push('/finance/student/FeeCollection');
        break;
      }
      case 'Assign Delivery charge kit books & uniform': {
        history.push('/finance/student/AssignDeliveryCharge');
        break;
      }
      case 'Assign / Change fee plan': {
        history.push('/finance/student/ChnageFeePlanToStudent');
        break;
      }
      case 'Bulk Report Upload': {
        history.push('/finance/BulkOperation/BulkReportUpload');
        break;
      }
      case 'Bulk Upload Status': {
        history.push('/finance/BulkOperation/BulkUploadStatus');
        break;
      }
      case 'Upload Online Payments': {
        history.push('/finance/BulkOperation/UploadOnlinePayment');
        break;
      }
      case 'Permanent Active / Inactive': {
        history.push('/finance/BulkOperation/BulkActiveInactive');
        break;
      }
      case 'Temporary Active / Inactive': {
        history.push('/finance/BulkOperation/BulkActiveInactiveParent');
        break;
      }
      case 'Active/Inactive': {
        history.push('/finance/Student/ActiveInactive');
        break;
      }
      case 'Student Active/Inactive': {
        history.push('/finance/Student/ActiveInactive/Admin');
        break;
      }
      case 'Student Promotion': {
        history.push('/finance/Student/StudentPromotion');
        break;
      }
      case 'QR code': {
        history.push('/finance/Student/OqCodeGenerate');
        break;
      }
      case 'Communications': {
        history.push('/finance/Student/Communication');
        break;
      }
      case 'Income Tax Certificate': {
        history.push('/finance/Student/IncomeTaxCertificate');
        break;
      }
      case 'Fee Pay Request': {
        history.push('/finance/Approval/Requests/FeePaymentRequests');
        break;
      }
      case 'Store Pay Request': {
        history.push('/finance/Approval/Requests/StorePaymentRequests');
        break;
      }
      case 'Accept and Reject payments': {
        history.push('/finance/Approval/Requests/AcceptRejectPayment');
        break;
      }
      case 'Post Dated cheque': {
        history.push('/finance/Approval/Requests/PostDateCheque');
        break;
      }
      case 'Billing Details': {
        history.push('/finance/E-Mandate/BillingDetails');
        break;
      }
      case 'Generate Subsequent Payment': {
        history.push('/finance/E-Mandate/GenerateSubsequentPayment');
        break;
      }
      case 'Add Branch': {
        history.push('/finance/E-Mandate/AddBranch');
        break;
      }
      case 'Customer Details': {
        history.push('/finance/E-Mandate/CustomerDetails');
        break;
      }
      case 'Add Customer Details': {
        history.push('/finance/E-Mandate/AdminCustomerDetails');
        break;
      }
      case 'Add Order Details': {
        history.push('/finance/E-Mandate/OrderDetails');
        break;
      }
      case 'Order Details': {
        history.push('/finance/E-Mandate/OrderDetails');
        break;
      }
      case 'Total Billing Details': {
        history.push('/finance/E-Mandate/TotalBillingDetails');
        break;
      }
      case 'Create Link': {
        history.push('/finance/E-Mandate/CreateLink');
        break;
      }
      case 'Petty Cash Expense': {
        history.push('/finance/Expanse Management/PettyExpense');
        break;
      }
      case 'Student Info': {
        history.push('/finance/student/studentInfo');
        break;
      }
      case 'Party List': {
        history.push('/finance/Expanse Management/PartyList');
        break;
      }
      case 'Student Shuffle Requests': {
        history.push('/finance/Approval/Requests/StudentShuffleRequest');
        break;
      }
      case 'Manage Payment': {
        history.push('/finance/ManagePayments');
        break;
      }
      case 'Fee Structure': {
        history.push('/finance/FeeStructure');
        break;
      }
      case 'Books & Uniform': {
        history.push('/finance/student_store');
        break;
      }
      case 'Shipping Payment': {
        history.push('/finance/ShippingPayment');
        break;
      }
      case 'School store': {
        history.push('/Store/AddItems');
        break;
      }
      case 'Kit': {
        history.push('/Store/CreateKit');
        break;
      }
      case 'sub Category allow': {
        history.push('/Store/SubCategoryAllow');
        break;
      }
      case 'Accountant Login': {
        history.push('/finance/BulkOperation/AccountantLogin');
        break;
      }
      case 'Add Gst': {
        history.push('/Store/AddGst');
        break;
      }
      case 'Order Status Upload': {
        history.push('/Store/OrderStatusUpload');
        break;
      }
      case 'Receipt Book': {
        history.push('/finance/ReceiptBook');
        break;
      }
      case 'Transactions Report': {
        history.push('/finance/TransactionStatus');
        break;
      }
      case 'Teacher Time Table': {
        // if(erp_config === true || erp_config?.length > 0){
        //   history.push('/time-table/teacher-view');
        //   break;
        // }
        // else {
        history.push('/timetable/teacherview');
        break;
        // }
      }
      case 'Student Time Table': {
        // if(erp_config === true || erp_config?.length > 0)
        // {
        //   history.push('/time-table/student-view');
        //   break;
        // }
        // else {
        history.push('/timetable/studentview');
        break;
        // }

        if (erp_config === 'true' || erp_config?.length > 0) {
          history.push('/time-table/teacher-view');
          break;
        } else {
          history.push('/timetable/teacherview');
          break;
        }
      }
      case 'Student Time Table': {
        if (erp_config === 'true' || erp_config?.length > 0) {
          history.push('/time-table/student-view');
          break;
        } else {
          history.push('/timetable/studentview');
          break;
        }
      }
      case 'Book Appointment': {
        history.push('/appointments');
        break;
      }
      case 'Appointment Responder': {
        history.push('/responder-view');
        break;
      }
      case 'Contact Us': {
        history.push('/contact-us');
        break;
      }
      case 'Student Attendance Report': {
        history.push('/student-attendance-report');
        break;
      }
      case 'Manage Orchadio': {
        history.push('/orchadio/manage-orchadio');
        break;
      }
      case 'Student Orchadio': {
        history.push('/orchadio/view-orchadio');
        break;
      }
      case 'Teacher Homework Report': {
        history.push('/homework-report-teacher-view');
        break;
      }
      case 'Teacher Classwork Report': {
        history.push('/classwork-report-teacher-view');
        break;
      }
      case 'Subject Training': {
        history.push('/subjectTrain');
        break;
      }
      case 'Enroll Courses': {
        history.push('/enrollTrainingfCourses');
        break;
      }
      case 'Enrolled Courses': {
        history.push('/enrolledSelfCourses');
        break;
      }
      case 'Induction Training': {
        history.push('/inductionTrain');
        break;
      }
      case 'Treasure Box': {
        history.push('/tressurebox');
        break;
      }

      case 'My Notes': {
        history.push('/learning-notes');
        break;
      }
      case 'Calendar': {
        history.push('/inhouse_calendar');
        break;
      }
      case 'Learning': {
        history.push('/learningVideos');
        break;
      }
      case 'Notification': {
        history.push('/View_notification');
        break;
      }
      // case 'Report': {
      //   history.push('/Teacher-report');
      //   break;
      // }
      case 'Blogs': {
        history.push('/blogSureLearning');
        break;
      }
      case 'Trainer Driven Courses': {
        history.push('/trainerDriven');
        break;
      }

      case 'Self Driven Courses': {
        history.push('/assignedCoursesByCordinator');
        break;
      }

      case 'All/Completed Courses': {
        history.push('/sure_learning/completed_courses');
        break;
      }

      case 'Class Initiation Form': {
        history.push('/sure_learning/class_initiation_form');
        break;
      }
      case 'Initiate Class': {
        history.push('/sure_learning/initiate_class');
        break;
      }

      case 'Initiate Class': {
        history.push('/sure_learning/initiate_class');
        break;
      }
      case 'Resources': {
        history.push('/sure_learning/resources');
        break;
      }
      case 'Assessment Scores': {
        history.push('/sure_learning/assessment_report');
        break;
      }

      case 'View Finance': {
        window.location.href = `https://uidev.erpfinance.letseduvate.com/sso/${token}`;
        break;
      }
      case 'Event Tracker': {
        // window.location.href = `http://dev-et.letseduvate.com/?${erp_details}`;
        window.location.href = `${baseEvent}?${token}`;
        break;
      }
      case 'Create Area': {
        history.push('/observation-area');
        break;
      }
      case 'Create Observation': {
        history.push('/observation');
        break;
      }
      case 'Evaluation': {
        history.push('/observation-evalutaion');
        break;
      }
      case 'Observation Report': {
        history.push('/observation-report');
        break;
      }
      // case 'Create Activity':{
      //   history.push('/blog/create');
      //   break;
      // }
      // case 'My Activities':{
      //   history.push('/blog/studentview')
      //   break;
      // }
      // case  'View Activity':{
      //   history.push('/blog/blogview')
      //   break;
      // }
      // case 'Create Activity Type': {
      //   history.push('/blog/createactivitytype')
      //   break;

      // }
      // case  'Blog':{
      //   history.push('/blog/activityreview')
      //   break;
      // }
      // case 'Create Parameter': {
      //   history.push('/blog/createratingtype')
      //   break;

      // }
      case 'Create Activity': {
        history.push('/blog/create');
        break;
      }
      case 'My Blogs': {
        history.push('/blog/wall/redirect');
        break;
      }
      case 'Blog Activity': {
        // history.push('/blog/blogview');
        history.push('/blog/wall/central/redirect');
        break;
      }
      case 'Create Activity Type': {
        history.push('/blog/createactivitytype');
        break;
      }
      case 'School Wall': {
        history.push('/blog/wall');
        break;
      }
      case 'Blog': {
        history.push('/blog/activityreview');
        break;
      }
      case 'Create Rating': {
        history.push('/blog/createratingtype');
        break;
      }

      case 'Class Section Wise Strength': {
        history.push('/student_count_report');
        break;
      }
      case 'Connection pod': {
        history.push('/online-class/connection-pod');
        break;
      }

      case 'Assign User Level': {
        history.push('/user-level-table');
        break;
      }
      case 'Trainee Courses': {
        history.push('/sure-learning-trainee-courses');
        break;
      }
      case 'Assign Trainee': {
        history.push('/sure-learning-assign-teacher');
        break;
      }
      case 'Reassign Trainee': {
        history.push('/sure-learning-re-assign-teacher');
        break;
      }
      case 'Assessment Review': {
        history.push('/sure-learning-assessment-review');
        break;
      }
      case 'Report': {
        history.push('/sure-learning-course-wise-user-report');
        break;
      }
      case 'Branch wise report': {
        history.push('/sure-learning-branch-level-detailed-report');
        break;
      }
      case 'Enroll Self Courses': {
        history.push('/enrollTrainingfCourses');
        break;
      }
      case 'Self Courses': {
        history.push('/assignedCoursesByCordinator');
        break;
      }
      case 'Assign Lead Teacher\n': {
        history.push('/sure-learning-assign-lead-teacher');
        break;
      }
      case 'Consolidated Report': {
        history.push('/sure-learning-consolidated-report');
        break;
      }
      case 'Weekly Report': {
        history.push('/sure-learning-weekly-report');
        break;
      }
      case 'Assign Teacher': {
        history.push('/sure-learning/assign-teacher');
        break;
      }
      case 'Curriculum Completion': {
        history.push('/curriculum-completion-student-subject/');
        break;
      }
      case 'File Category': {
        history.push('/file-category/');
        break;
      }
      case 'Non Academic Staff': {
        history.push('/user-management/non-academic-staff');
        break;
      }
      case 'Activity Dashboard': {
        history.push('/activity-management-dashboard');
        break;
      }
      case 'FAQ': {
        history.push('/frequentlyAskedQuestions');
        break;
      }

      default:
        break;
    }
  };

  const handleOpen = (value) => {
    setDrawerOpen((value) => !value);
  };

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  return (
    <>
      <div className={classes.rootColumn}>
        <div className={classes.root}>
          {!isLayoutHidden &&
            (isV2 ? (
              <SideBarV2
                drawerOpen={drawerOpen}
                navigationData={navigationData}
                handleOpen={handleOpen}
                superUser={superUser}
                handleRouting={handleRouting}
                setDrawerOpen={setDrawerOpen}
              />
            ) : (
              <SideBar
                drawerOpen={drawerOpen}
                navigationData={navigationData}
                handleOpen={handleOpen}
                superUser={superUser}
                handleRouting={handleRouting}
                setDrawerOpen={setDrawerOpen}
              />
            ))}
          <main className={classes.content}>
            <Box className={classes.appBarSpacer} />
            {
              moduleData?.length > 0 && <div style={{position : "fixed", top : "76px", right : "80px", zIndex : "5"}}>
              <div
              onClick={() => setModalVisible(true)}
              style={{
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease',
                padding: '3px',
                borderRadius: '18px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              <img src={FaqImage} width='24px' />
            </div>
          </div>
            }
            {!isLayoutHidden &&
              (isV2 ? (
                <TopBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
              ) : (
                <Appbar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
              ))}
            <ContainerContext.Provider value={{ containerRef }}>
              {branchesmapped ? (
                <Box className={classes.container} ref={containerRef}>
                  <Box>{children}</Box>
                  <Box mt={0} className={classes.footerBar}>
                    <Footer />
                  </Box>
                </Box>
              ) : (
                <div className=' p-4' style={{ height: '100vh', background: '#f2f2f2' }}>
                  <div
                    className='d-flex justify-content-center align-items-center th-height-50'
                    style={{ height: '70vh' }}
                  >
                    <div className='shadow-lg th-bg-white th-br-8 py-2 w-70'>
                      <Result
                        status='error'
                        title={
                          <span className='th-20'>{`${
                            first_name + ' ' + last_name
                          } not mapped to academic year ${
                            selectedAcademicYear?.session_year
                          }`}</span>
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </ContainerContext.Provider>
          </main>
        </div>
        <Modal
        visible={modalVisible}
        footer={null}
        className='th-modal'
        width={'50%'}
        onCancel={() => setModalVisible(false)}
      >
        <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '20px' }}>
          Frequently Asked Questions
        </p>
        <div id='Preview-Container' style={{ height: '265px', gap: '20px' }}>
          <div style={{ width: '100%' }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
              Demo Video
            </p>
            <video
              src={`${endpoints.assessment.erpBucket}/${moduleData[0]?.video_file}`}
              controls
              preload='auto'
              style={{
                maxHeight: '165px',
                width: '100%',
                objectFit: 'fill',
              }}
            />
            <p
              onClick={() => {
                const fileName = moduleData[0]?.pdf_file;
                let extension = fileName ? fileName[fileName?.length - 1] : '';
                openPreview({
                  currentAttachmentIndex: 0,
                  attachmentsArray: [
                    {
                      src: `${endpoints.assessment.erpBucket}/${moduleData[0]?.pdf_file}`,

                      name: fileName,
                      extension: '.' + extension,
                    },
                  ],
                });
              }}
              style={{ color: 'blue', cursor: 'pointer', paddingTop: '8px' }}
            >
              Click For User Manual <FilePdfOutlined />
            </p>
          </div>
        </div>
        {moduleData?.length > 0 && (
          <div id='Edit-Container'>
            <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
              Question and Answers
            </p>
            {moduleData[0]?.items?.map((ele) => (
              <div id='Question-Answer-Cont'>
                <label style={{ fontWeight: 'bold' }}>Question</label>

                <p>{ele?.question}</p>
                <label style={{ color: 'gray', marginTop: '3px' }}>Answer</label>

                <p>{ele?.answer}</p>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          For Further Assistance Please Mail Us At{' '}
          <a href='mailto:support@k12technoservices.freshdesk.com'>
            support@k12technoservices.freshdesk.com
          </a>
        </div>
      </Modal>
      </div>
    </>
  );
};

export default withRouter(Layout);
