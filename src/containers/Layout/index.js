/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-use-before-define */

/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect, useRef, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import { throttle, debounce } from 'throttle-debounce';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import TodayIcon from '@material-ui/icons/Today';
import MoreIcon from '@material-ui/icons/More';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ContactPhoneRoundedIcon from '@material-ui/icons/ContactPhoneRounded';
// import TodayIcon from '@material-ui/icons/Today';
import AssessmentSharpIcon from '@material-ui/icons/AssessmentSharp';
import {
  Popper,
  Fade,
  Paper,
  Grid,
  ListItemSecondaryAction,
  ListItemIcon,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditOutlined';
import { fade } from '@material-ui/core/styles/colorManipulator';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import EventNoteIcon from '@material-ui/icons/EventNote';
import LinearProgress from '@material-ui/core/LinearProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import Grow from '@material-ui/core/Grow';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { logout } from '../../redux/actions';
import DrawerMenu from '../../components/drawer-menu';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import UserDetails from './userDetails/user-details';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import useStyles from './useStyles';
import './styles.scss';
import logoMobile from '../../assets/images/logo_mobile.png';
import online_classpng from '../../assets/images/Online classes-01.svg';
import logo from '../../assets/images/logo.png';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import SettingsIcon from '@material-ui/icons/Settings';
import UserInfo from '../../components/user-info';
import PublishIcon from '@material-ui/icons/Publish';

export const ContainerContext = createContext();

const Layout = ({ children, history }) => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { role_details: roleDetails } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [navigationData, setNavigationData] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [masterMenuOpen, setMasterMenuOpen] = useState(false);
  const [superUser, setSuperUser] = useState(false);
  const [searchUserDetails, setSearchUserDetails] = useState([]);
  const searchInputRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const [searching, setSearching] = useState(false);
  const [globalSearchResults, setGlobalSearchResults] = useState(false);
  const [globalSearchError, setGlobalSearchError] = useState(false);
  const [searchedText, setSearchedText] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollDone, setScrollDone] = useState(false);
  const [mobileSeach, setMobileSeach] = useState(false);
  const [displayUserDetails, setDisplayUserDetails] = useState(false);
  const [userId, setUserId] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const getGlobalUserRecords = async (text) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.gloabSearch.getUsers}?search=${text}&page=${currentPage}&page_size=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.status_code === 200) {
        const tempData = [];
        result.data.data.results.map((items) =>
          tempData.push({
            id: items.id,
            name: items.name,
            erpId: items.erp_id,
            contact: items.contact,
          })
        );
        setTotalPage(result.data.data.total_pages);
        setSearchUserDetails(tempData);
      } else {
        setAlert('error', result.data.message);
        setGlobalSearchError(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setGlobalSearchError(false);
    }
  };
  const autocompleteSearch = (q, pageId, isDelete) => {
    if (q !== '') {
      setSearching(true);
      setGlobalSearchResults(true);
      getGlobalUserRecords(q);
    }
  };
  const autocompleteSearchDebounced = debounce(500, autocompleteSearch);
  const autocompleteSearchThrottled = throttle(500, autocompleteSearch);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const navigationData = localStorage.getItem('navigationData');
    if (navigationData) {
      setNavigationData(JSON.parse(navigationData));
    }
    let userDetails = localStorage.getItem('userDetails');
    if (!userDetails) {
      // if(key==="2000000002")
      // history.push('/dashboard/2000');
      // else
      history.push('/');
    }
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      const { is_superuser } = userDetails;
      setSuperUser(is_superuser);
    }
    if (containerRef.scrollTop > 50) {
      containerRef.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (isLogout) {
      history.push('/');
      setIsLogout(false);
    }
  }, [isLogout]);

  useEffect(() => {
    if (searchedText !== '') {
      setGlobalSearchResults(false);
      setSearching(false);
      setSearchUserDetails([]);
      setTotalPage(0);
      setCurrentPage(1);
    }
  }, [history.location.pathname]);

  //   useEffect(() => {
  //     if (searchedText !== '') {
  //       getGlobalUserRecords();
  //     }
  //   }, [currentPage]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleLogout = () => {
    dispatch(logout());
    setIsLogout(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
    setProfileOpen(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
    setProfileOpen(!profileOpen);
  };

  const changeQuery = (event) => {
    setSearchedText(event.target.value);
    if (event.target.value === '') {
      setGlobalSearchResults(false);
      setSearching(false);
      setSearchUserDetails([]);
      setTotalPage(0);
      setCurrentPage(1);
      return;
    }
    const q = event.target.value;
    if (q.length < 5) {
      setCurrentPage(1);
      autocompleteSearchThrottled(event.target.value);
    } else {
      setCurrentPage(1);
      autocompleteSearchDebounced(event.target.value);
    }
  };

  const handleTextSearchClear = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSearchedText('');
      setGlobalSearchResults(false);
      setSearching(false);
      setSearchUserDetails([]);
      setTotalPage(0);
      setCurrentPage(1);
    }, 500);
  };
  const handleTextSearchClearMobile = (e) => {
    e.preventDefault();
    setMobileSeach(false);
    setTimeout(() => {
      setSearchedText('');
      setGlobalSearchResults(false);
      setSearching(false);
      setSearchUserDetails([]);
      setTotalPage(0);
      setCurrentPage(1);
    }, 500);
  };

  //   const handleScroll = (event) => {

  //     if (
  //       target.scrollTop + target.clientHeight === target.scrollHeight &&
  //       currentPage < totalPage
  //     ) {
  //       setScrollDone(true);
  //       setCurrentPage(currentPage + 1);
  //     }
  //   };

  const classes = useStyles();

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      id={mobileMenuId}
      TransitionComponent={Grow}
      transitionDuration={500}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={profileOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={(e) => history.push('/profile')}>
        <IconButton aria-label='my profile' color='inherit'>
          <PermIdentityIcon color='primary' style={{ fontSize: '2rem' }} />
        </IconButton>
        <p style={{ color: '#014B7E' }}>My Profile</p>
      </MenuItem>

      <MenuItem onClick={handleLogout}>
        <IconButton aria-label='logout button' color='inherit'>
          <ExitToAppIcon color='primary' style={{ fontSize: '2rem' }} />
        </IconButton>
        <p style={{ color: '#014B7E' }}>Logout</p>
      </MenuItem>
    </Menu>
  );

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
      case 'Create User': {
        history.push('/user-management/create-user');
        break;
      }
      case 'Bulk Upload Status': {
        history.push('/user-management/bulk-upload');
        break;
      }
      case 'View User': {
        history.push('/user-management/view-users');
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
      case 'Course': {
        history.push('/course-list');
        break;
      }
      case 'Course Price': {
        history.push('/course-price');
        break;
      }
      case 'Lesson Plan Mapping': {
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
      case 'Word Count Cofiguration': {
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
      case 'Take Test': {
        history.push('/assessment');
        break;
      }
      case 'Assessment Report': {
        history.push('/assessment-reports');
        break;
      }
      //   { name: 'Question Bank', Path: '/question-bank' },
      // { name: 'Question Paper', Path: '/assessment-question' },
      // { name: 'Create Test', Path: '/assesment' },
      // { name: 'Take Test', Path: '/assessment' }
      // case 'ID Cards': {
      //   history.push('/student-id-card');
      //   break;
      // }
      case 'ID Card View': {
        history.push('/student-id-card');
        break;
      }
      case 'Student Strength': {
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
        history.push('/finance/StudentWallet');
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
        history.push('/finance/BooksAndUniform');
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
        history.push('/time-table/teacher-view');
        break;
      }
      case 'Student Time Table': {
        history.push('/time-table/student-view');
        break;
      }
      case 'Contact Us': {
        history.push('/contact-us');
        break;
      }
      default:
        break;
    }
  };

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      <AppBar position='absolute' className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          {isMobile && (
            <Box
              className={classes.mobileToolbar}
              display='flex'
              justifyContent='space-between'
            >
              <IconButton
                edge='start'
                color='inherit'
                aria-label='open drawer'
                onClick={() => {
                  setDrawerOpen((prevState) => !prevState);
                }}
              >
                {drawerOpen ? (
                  <CloseIcon color='primary' />
                ) : (
                  <MenuIcon color='primary' />
                )}
              </IconButton>

              <IconButton className={classes.logoMobileContainer}>
                <img className={classes.logoMObile} src={logoMobile} alt='logo-small' />
              </IconButton>

              <IconButton />
            </Box>
          )}
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            className={clsx(classes.logoBtn, classes.desktopToolbarComponents)}
          >
            <img src={logo} alt='logo' style={{ height: '45px' }} />
          </IconButton>
          <Divider
            orientation='vertical'
            flexItem
            style={{
              backgroundColor: '#ff6b6b',
              margin: '5px 10px',
            }}
            className={classes.desktopToolbarComponents}
          />

          <Typography
            className={classes.desktopToolbarComponents}
            component='h6'
            variant='h6'
            color='inherit'
            noWrap
          >
            Welcome!
            <span style={{ fontSize: '1rem', marginLeft: '1rem' }}>Have a great day</span>
          </Typography>
          {superUser ? (
            <div className={clsx(classes.grow, classes.desktopToolbarComponents)}>
              <Paper component='form' className={classes.searchInputContainer}>
                <InputBase
                  value={searchedText}
                  className={classes.searchInput}
                  placeholder='Search..'
                  inputProps={{ 'aria-label': 'search across site' }}
                  inputRef={searchInputRef}
                  onChange={changeQuery}
                  onBlur={handleTextSearchClear}
                />
                {searchedText ? (
                  <IconButton
                    type='submit'
                    className={classes.clearIconButton}
                    aria-label='close'
                    onClick={handleTextSearchClear}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : null}
                <IconButton
                  type='submit'
                  className={classes.searchIconButton}
                  aria-label='search'
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
              <Popper
                open={searching}
                className={`${classes.searchDropdown} ${
                  isMobile ? classes.searchDropdownMobile : 'null'
                }`}
                placement='bottom'
                style={{
                  position: 'fixed',
                  top: isMobile
                    ? searchInputRef.current &&
                      searchInputRef.current.getBoundingClientRect().top + 44
                    : searchInputRef.current &&
                      searchInputRef.current.getBoundingClientRect().top + 32,
                  left: 'auto',
                  right: `calc(${isMobile ? '92vw' : '100vw'} - ${
                    searchInputRef.current &&
                    searchInputRef.current.getBoundingClientRect().left +
                      searchInputRef.current.getBoundingClientRect().width
                  }px)`,
                  zIndex: 3000,
                }}
                transition
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                      <Grid
                        container
                        className='main_search_container'
                        style={{ flexDirection: 'column' }}
                      >
                        {globalSearchResults && searchUserDetails.length ? (
                          <>
                            <Grid item>
                              <Grid
                                container
                                style={{
                                  flexDirection: 'row',
                                  paddingBottom: 12,
                                  paddingTop: 12,
                                  paddingLeft: 16,
                                  backgroundColor: 'rgb(224 224 224)',
                                  paddingRight: 16,
                                  minWidth: 374,
                                }}
                              >
                                <Grid
                                  // onScroll={(event) => handleScroll(event)}
                                  style={{
                                    paddingRight: 8,
                                    maxHeight: 385,
                                    height: 300,
                                    overflow: 'auto',
                                  }}
                                  item
                                >
                                  {globalSearchResults && (
                                    <List
                                      style={{ minWidth: 61 }}
                                      subheader={
                                        <ListSubheader
                                          style={{
                                            background: 'rgb(224 224 224)',
                                            width: '100%',
                                            color: '#014B7E',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                          }}
                                        >
                                          Users
                                        </ListSubheader>
                                      }
                                    >
                                      {globalSearchResults &&
                                        searchUserDetails.length &&
                                        searchUserDetails.map((result, index) => {
                                          return (
                                            <ListItem
                                              style={{ width: 324 }}
                                              className='user_rows_details'
                                              button
                                              onClick={() => {
                                                setSearching(false);
                                                setUserId(result.id);
                                                setDisplayUserDetails(true);
                                              }}
                                            >
                                              <ListItemText
                                                primary={result.name}
                                                secondary={
                                                  <div>
                                                    <span>{result.erpId}</span>
                                                    <span style={{ float: 'right' }}>
                                                      Mob: {result.contact}
                                                    </span>
                                                  </div>
                                                }
                                              />
                                              {/* <ListItemSecondaryAction>
                                              <IconButton
                                                aria-label='Delete'
                                                onClick={() =>
                                                  handleUserDelete(result.id, index)
                                                }
                                                className={classes.margin}
                                              >
                                                <DeleteIcon fontSize='small' />
                                              </IconButton>
                                            </ListItemSecondaryAction> */}
                                            </ListItem>
                                          );
                                        })}
                                    </List>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        ) : (
                          <Grid
                            container
                            style={{
                              flexDirection: 'row',
                              backgroundColor: '#eee',
                              minHeight: 324,
                              minWidth: 374,
                              flexGrow: 1,
                            }}
                          >
                            <span
                              style={{
                                padding: 1,
                                textAlign: 'center',
                                margin: 'auto',
                                color: '#014B7E',
                              }}
                            >
                              No data available.
                            </span>
                          </Grid>
                        )}
                      </Grid>
                      <Grid container>
                        {globalSearchError && (
                          <Grid
                            style={{ padding: 8, width: '100%', backgroundColor: '#eee' }}
                            xs={12}
                            item
                          >
                            Something went wrong.
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Fade>
                )}
              </Popper>
              {displayUserDetails ? (
                <UserDetails
                  close={setDisplayUserDetails}
                  mobileSearch={setMobileSeach}
                  userId={userId}
                  setUserId={setUserId}
                  setSearching={setSearching}
                />
              ) : null}
            </div>
          ) : null}
          <div
            className={`${clsx(
              classes.sectionDesktop,
              classes.desktopToolbarComponents
            )} ${superUser ? 'null' : 'layout_user_icon'}`}
          >
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              {roleDetails && roleDetails.user_profile ? (
                <img
                  style={{ fontSize: '0.4rem' }}
                  src={roleDetails.user_profile}
                  alt='no img'
                  className='profile_img'
                />
              ) : (
                <AccountCircle color='primary' style={{ fontSize: '2rem' }} />
              )}
              {profileOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </div>

          {/* <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div> */}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <Drawer
        open={drawerOpen}
        variant={isMobile ? '' : 'permanent'}
        className={clsx(classes.drawer, {
          [classes.drawerPaper]: drawerOpen,
          [classes.drawerPaperClose]: !drawerOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawer]: true,
            [classes.drawerPaper]: drawerOpen,
            [classes.drawerPaperClose]: !drawerOpen,
          }),
        }}
        onClose={() => setDrawerOpen(false)}
      >
        <div className={classes.appBarSpacer} />
        {isMobile && drawerOpen && (
          <>
            <UserInfo
              user={roleDetails}
              onClick={() => {
                history.push('/profile');
                setDrawerOpen((prevState) => !prevState);
              }}
            />
            <Box className={classes.sidebarActionButtons}>
              {mobileSeach ? (
                <div>
                  <Paper component='form' className={classes.searchInputContainerMobile}>
                    <IconButton
                      type='submit'
                      className={classes.clearIconButtonMobile}
                      aria-label='close'
                      onClick={handleTextSearchClearMobile}
                    >
                      <CloseIcon />
                    </IconButton>
                    <InputBase
                      value={searchedText}
                      className={classes.searchInputMobile}
                      placeholder='Search..'
                      inputProps={{ 'aria-label': 'search across site' }}
                      inputRef={searchInputRef}
                      onChange={changeQuery}
                      onBlur={handleTextSearchClear}
                    />
                    <IconButton
                      type='submit'
                      className={classes.searchIconButtonMobile}
                      aria-label='search'
                    >
                      <SearchIcon />
                    </IconButton>
                  </Paper>
                </div>
              ) : (
                <>
                  <IconButton onClick={handleLogout}>
                    <PowerSettingsNewIcon style={{ color: '#ffffff' }} />
                  </IconButton>
                  <IconButton>
                    <SettingsIcon style={{ color: '#ffffff' }} />
                  </IconButton>
                  <IconButton onClick={() => setMobileSeach(true)}>
                    <SearchIcon style={{ color: '#ffffff' }} />
                  </IconButton>
                </>
              )}
            </Box>
            <Box style={{ padding: '0 10px' }}>
              <Divider style={{ backgroundColor: '#ffffff' }} />
            </Box>
          </>
        )}

        <List>
          <ListItem
            className={classes.menuControlContainer}
            onClick={() => setDrawerOpen((prevState) => !prevState)}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </ListItemIcon>
            <ListItemText className='menu-item-text'>Menu</ListItemText>
          </ListItem>
          {navigationData && drawerOpen && navigationData.length > 0 && (
            <DrawerMenu
              superUser={superUser}
              navigationItems={navigationData}
              onClick={handleRouting}
            />
          )}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <ContainerContext.Provider value={{ containerRef }}>
          <div className={classes.container} ref={containerRef}>
            {children}
          </div>
        </ContainerContext.Provider>
      </main>
    </div>
  );
};

export default withRouter(Layout);
