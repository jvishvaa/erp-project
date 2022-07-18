import React, { useState, useEffect, useRef, createContext } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import '../Assets/css/antdTab.css';
import '../Assets/css/antdModal.css';
import '../Assets/css/table.scss';
import '../Assets/css/antdDrawer.css';
import SideBar from './SideBar';
import { Box, List, Drawer, useMediaQuery, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import DrawerMenu from './Drawer';
import endpoints from '../../config/endpoints';
import useStyles from './useStyles';
import './styles.scss';
import TopBar from './TopBar';
import SearchBar from './SearchBar';
import {
  fetchThemeApi,
  isFetchThemeRequired,
} from '../../utility-functions/themeGenerator';
import AppSearchBarUseStyles from './AppSearchBarUseStyles';
import ENVCONFIG from 'config/config';
import logo from '../../assets/images/logo.png';

export const ContainerContext = createContext();

const Layout = ({ children, history }) => {
  const classAppBar = AppSearchBarUseStyles();
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth < 768 ? false : true);
  const [isLogout, setIsLogout] = useState(false);
  const [navigationData, setNavigationData] = useState(false);
  const [superUser, setSuperUser] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const isLayoutHidden = searchParams.get('wb_view');
  let token = JSON.parse(localStorage.getItem('userDetails'))?.token || '';

  const {
    apiGateway: { baseURLCentral, baseUdaan, baseEvent },
    s3: { BUCKET: s3BUCKET, ERP_BUCKET },
  } = ENVCONFIG;

  const erp_config = JSON.parse(localStorage.getItem('userDetails'))?.erp_config;
  var CryptoJS = require('crypto-js');

  var erp_details = CryptoJS.AES.encrypt(JSON.stringify(token), 'erp-details').toString();

  useEffect(() => {
    const navigationData = localStorage.getItem('navigationData');
    if (navigationData) {
      setNavigationData(JSON.parse(navigationData));
    }
    let userDetails = localStorage.getItem('userDetails');
    if (!userDetails) {
      history.push('/');
    }
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      const { is_superuser = false } = userDetails;
      setSuperUser(is_superuser);
    }
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
    if (window.innerWidth < 768) {
      setDrawerOpen(false);
    } else {
      setDrawerOpen(true);
    }
  }, [window.innerWidth]);

  useEffect(() => {
    if (isFetchThemeRequired()) {
      fetchThemeApi();
    }
  }, []);

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
        history.push('/communication/addgroup');
        break;
      }
      case 'View Role': {
        history.push('/role-management');
        break;
      }
      case 'View&Edit Group': {
        history.push('/communication/viewgroup');
        break;
      }
      case 'View Publication': {
        history.push('/publications');
        break;
      }
      case 'Announcement': {
        history.push('/comm_dashboard');
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
      case 'Ebook View': {
        history.push('/ebook/view');
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
        history.push('/lesson-plan/teacher-view');
        break;
      }
      case 'Student View': {
        history.push('/lesson-plan/student-view');
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
        history.push('/question-bank');
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
        history.push('/teacher-attendance-verify');
        break;
      }
      case 'Mark Attendance': {
        history.push('/teacher-attendance');
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

      case 'Griviences Teacher': {
        history.push('/griviences/admin-view');
        break;
      }
      case 'Griviences Student': {
        history.push('/griviences/student-view');
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
        history.push('/observation-report');
        break;
      }
      case 'Observation Report': {
        history.push('/pdf-table');
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
      default:
        break;
    }
  };

  const handleOpen = (value) => {
    setDrawerOpen((value) => true);
  };

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const handleDrawer = () => {
    return (
      <Drawer
        open={true}
        variant={isMobile ? '' : 'permanent'}
        className={`${clsx(classes.drawer, {
          [classes.drawerPaper]: drawerOpen,
          [classes.drawerPaperClose]: !drawerOpen,
        })} drawerScrollBar`}
        classes={{
          paper: clsx({
            [classes.drawer]: drawerOpen,
            [classes.drawerPaper]: drawerOpen,
            [classes.drawerPaperClose]: !drawerOpen,
          }),
        }}
      >
        {isMobile ? <div className={classes.appBarSpacer} /> : null}
        {isMobile ? <SearchBar /> : null}

        {isMobile ? null : (
          <div
            className='p-2'
            style={{
              position: 'sticky',
              top: 0,
              height: '64px',
              zIndex: '100000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8f8f8',
            }}
          >
            <img src={logo} alt='logo' style={{ height: '36px', paddingLeft: '15px' }} />
          </div>
        )}

        <List className='px-3' style={{ height: 'calc(100% - 64px)' }}>
          {drawerOpen
            ? navigationData &&
              navigationData.length > 0 && (
                <DrawerMenu
                  superUser={superUser}
                  drawerOpen={drawerOpen}
                  navigationItems={navigationData}
                  onClick={handleRouting}
                />
              )
            : navigationData &&
              navigationData.length > 0 && (
                <DrawerMenu
                  superUser={superUser}
                  navigationItems={navigationData}
                  onClick={handleOpen}
                  drawerOpen={drawerOpen}
                />
              )}
        </List>
      </Drawer>
    );
  };

  return (
    <div className={classes.rootColumn}>
      <div className={classes.root}>
        {!isLayoutHidden && (
          <SideBar
            drawerOpen={drawerOpen}
            navigationData={navigationData}
            handleOpen={handleOpen}
            superUser={superUser}
            handleRouting={handleRouting}
          />
        )}
        <main className={classes.content}>
          <Box className={classes.appBarSpacer} />
          {!isLayoutHidden && (
            <TopBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
          )}
          <ContainerContext.Provider value={{ containerRef }}>
            <Box className={classes.container} ref={containerRef}>
              <Box className='pb-4'>{children}</Box>
              {/* <Box mt={0} className={classes.footerBar}>
                <Footer />
              </Box> */}
            </Box>
          </ContainerContext.Provider>
        </main>
      </div>
    </div>
  );
};

export default withRouter(Layout);
