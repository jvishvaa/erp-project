/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-use-before-define */

/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect, useRef, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import { ListItemIcon } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import { fetchAcademicYearList } from '../../redux/actions';
import DrawerMenu from '../../components/drawer-menu';
import endpoints from '../../config/endpoints';
import useStyles from './useStyles';
import './styles.scss';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Appbar from './Appbar';
import SearchBar from './SearchBar';
import {
  fetchThemeApi,
  isFetchThemeRequired,
} from '../../utility-functions/themeGenerator';
// import { isMsAPI } from "../../utility-functions/index";


export const ContainerContext = createContext();

const Layout = ({ children, history }) => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [navigationData, setNavigationData] = useState(false);
  const [superUser, setSuperUser] = useState(false);

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

  const academicYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  useEffect(() => {
    if (!academicYear) dispatch(fetchAcademicYearList());
  }, [academicYear]);

  useEffect(() => {
    if (isFetchThemeRequired()) {
      fetchThemeApi();
    }
    // if(!localStorage.hasOwnProperty("isMsAPI")){ }
    // isMsAPI();
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
    <div className={classes.root}>
      <Appbar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
       <Drawer
        open={drawerOpen}
        variant={isMobile ? '' : 'permanent'}
        // className={clsx(classes.drawer, {
        //   [classes.drawerPaper]: drawerOpen,
        //   [classes.drawerPaperClose]: !drawerOpen,
        // })}
        className={`${clsx(classes.drawer, {
          [classes.drawerPaper]: drawerOpen,
          [classes.drawerPaperClose]: !drawerOpen,
        })} drawerScrollBar`}
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
        {isMobile ? <SearchBar /> : null}
        <List>
          <ListItem
            className={classes.menuControlContainer}
            onClick={() => setDrawerOpen((prevState) => !prevState)}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {drawerOpen ? (
                <>
                  <CloseIcon />
                </>
              ) : (
                <>
                  <MenuIcon />
                </>
              )}
            </ListItemIcon>
            <ListItemText className='menu-item-text'>Menu</ListItemText>
          </ListItem>
          {drawerOpen
            ? navigationData &&
              navigationData.length > 0 && (
                <DrawerMenu
                  superUser={superUser}
                  drawerOpen={drawerOpen}
                  navigationItems={navigationData}
                  onClick={handleRouting}
                  // flag={flag}
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
