/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import useStyles from './useStyles';
import menuIcon from './menu-icon';
import Layout from 'containers/Layout';
import { makeStyles } from '@material-ui/core/styles';
import { theme } from 'highcharts';
import { ClassSharp } from '@material-ui/icons';


const MenuItem = withRouter(({ history, ...props }) => {
  const { item, onClick, onChangeMenuState, menuOpen, openParent, openMenu, drawerOpen, navigationItems } = props || {};
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [parentModule, setParentModule] = useState(false);
  const [flag, setFlag] = useState(true);
  const [childValue, setChildValue] = useState(!flag);
  const [child, setChild] = useState('');

  const useStyles = makeStyles((theme) => ({

    menuItemhover: {


      '&:hover': {
        '& span': {
          backgroundColor: theme.palette.primary.primarylight,
          color: "white",
          borderBottomLeftRadius: "26px",
          borderTopLeftRadius: "26px",
          left: "15%",
          // width: "85%",          


        },
      },
    },

    menuSelectionExpand: {
      backgroundColor: theme.palette.primary.primarydark,
      whiteSpace: 'break-spaces',
      // textOverflow: "ellipsis"

    },

    menuSelectionText: {
      '& span': {
        color: theme.palette.primary.main,
        fontWeight: "bolder",
        marginBottom: "2%",
        marginTop: "2%",
        backgroundColor: "white",
        borderBottomLeftRadius: "26px",
        borderTopLeftRadius: "26px",
        left: "15%",
        width: "85%",
        // whiteSpace:'break-spaces'
      }
    },
    menuItemIcon: {
      color: '#ffffff',
      // zIndex:1,
    },
    menuItemIconSelected: {
      // backgroundColor:'#ffffff',
      color: theme.palette.primary.main,
      zIndex: 1,
    },
    expandIcons: {
      marginLeft: '2rem',
      color: '#ffffff',
    },
  }))


  const menuSelectionArray = [
    { name: 'Take Class', Path: '/take-class' },
    { name: 'View Class', Path: '/online-class/view-class' },
    // { name: 'Attend Online Class', Path: '/online-class/attend-class' },
    // { name: 'Teacher View Class', Path: '/online-class/teacher-view-class' },
    // { name: 'Role Management', Path: '/role-management' },
    { name: 'View Role', Path: '/role-management' },
    { name: 'Deposit', Path: '/finance/DepositTab' },
    { name: 'Create Coupon', Path: '/finance/CreateCoupon' },
    { name: 'Assign Coupon', Path: '/finance/AssignCoupon' },
    { name: 'Ledger', Path: '/finance/Ledger' },
    { name: 'Master Management', Path: '/master-management' },
    { name: 'Resources', Path: '/online-class/resource' },
    { name: 'Branch', Path: '/master-management/branch-table' },
    { name: 'Branch Acad Mapping', Path: '/master-management/branch-acad-table' },
    { name: 'Subject', Path: '/master-management/subject-table' },
    { name: 'Subject Mapping', Path: '/master-management/subject-mapping-table' },
    { name: 'Section', Path: '/master-management/section-table' },
    { name: 'Section Mapping', Path: '/master-management/section-mapping-table' },
    { name: 'Grade', Path: '/master-management/grade-table' },
    { name: 'Academic Year', Path: '/master-management/academic-year-table' },
    { name: 'Chapter Creation', Path: '/master-management/chapter-type-table' },
    { name: 'Topic', Path: '/master-management/topic-table' },
    { name: 'Message Type', Path: '/master-management/message-type-table' },
    { name: 'Signature Upload', Path: '/master-management/signature-upload' },
    { name: 'Event Category', Path: '/master-management/event-category' },
    { name: 'Discussion Category', Path: '/master-management/discussion-category' },
    { name: 'Teacher Calendar', Path: '/attendance-calendar/teacher-view' }, //attendance
    { name: 'Student Calendar', Path: '/attendance-calendar/student-view' }, //
    { name: 'Course', Path: '/course-list' },
    { name: 'Course Price', Path: '/course-price' },
    { name: 'Content Mapping', Path: '/subject/grade' },
    { name: 'Create User', Path: '/user-management/create-user' },
    { name: 'View User', Path: '/user-management/view-users' },
    { name: 'Bulk Upload Status', Path: '/user-management/bulk-upload' },
    { name: 'Bulk Status Upload', Path: '/finance/BulkOperation/BulkUploadStatus' },
    { name: 'Assign Role', Path: '/user-management/assign-role' },
    { name: 'View Class', Path: '/erp-online-class' },
    { name: 'Section Shuffle', Path: '/user-management/section-shuffling' },
    { name: 'Access-Blocker', Path: '/user-management/access-blocker' },
    { name: 'Attend Online Class', Path: '/erp-online-class-student-view' },
    { name: 'Teacher View Class', Path: '/erp-online-class-teacher-view' },
    { name: 'Teacher View Attendance', Path: '/online-class/attendance-teacher-view' },
    { name: 'Create Class', Path: '/online-class/create-class' },
    { name: 'Online Class', Path: '/online-class/attend-class' },
    { name: 'Management View', Path: '/homework/coordinator' },
    { name: 'Configuration', Path: '/homework/admin' },
    { name: 'Student Homework', Path: '/homework/student' },
    { name: 'Teacher Homework', Path: '/homework/teacher' },
    { name: 'Teacher Classwork Report', Path: '/classwork-report-teacher-view' },
    { name: 'Student Classwork Report', Path: '/classwork/student-report' },
    { name: 'Teacher Homework Report', Path: '/homework-report-teacher-view' },
    { name: 'Student Homework Report', Path: '/homework/student-report' },
    // { name: 'Student Homework Report', Path: '/classwork-report-teacher-view' },
    { name: 'Assessment', Path: '/assessment' },
    { name: 'Communication', Path: '/communication' },
    { name: 'Add Group', Path: '/communication/addgroup' },
    { name: 'View&Edit Group', Path: '/communication/viewgroup' },
    { name: 'Send Message', Path: '/communication/sendmessage' },
    { name: 'Add SMS Credit', Path: '/communication/smscredit' },
    { name: 'SMS&Email Log', Path: '/communication/messageLog' },
    { name: 'Teacher View', Path: '/lesson-plan/teacher-view' },
    { name: 'Student View', Path: '/lesson-plan/student-view' },
    { name: 'Management Report', Path: '/lesson-plan/report' },
    { name: 'Graphical Report', Path: '/lesson-plan/graph-report' },
    { name: 'Student Blogs', Path: '/blog/student/dashboard' },
    { name: 'Teacher Blogs', Path: '/blog/teacher' },
    { name: 'Management Blogs', Path: '/blog/admin' },
    { name: 'Principal Blogs', Path: '/blog/principal' },
    { name: 'Genre', Path: '/blog/genre' },
    { name: 'Student Diary', Path: '/diary/student' },
    { name: 'Teacher Diary', Path: '/diary/teacher' },
    {
      name: 'Assign Transport Fees',
      Path: '/feeType/assign_other_fees'
    },
    {
      name: 'Add Transport Fees',
      Path: '/feeType/OtherFeeType'
    },
    { name: 'Ledger Tab', Path: '/student/LegerTab' },
    { name: 'Word Count Configuration', Path: '/blog/wordcount-config' },
    // { name: 'ID Cards', Path: '/student-id-card' },
    { name: 'ID Card View', Path: '/student-id-card' },
    { name: 'Student Strength', Path: '/student-strength' },
    { name: 'Teacher Circular', Path: '/teacher-circular' },
    { name: 'Student Circular', Path: '/student-circular' },

    //{ name: 'Discussion Forum', Path: '/discussion-forum' },
    { name: 'Teacher Forum', Path: '/teacher-forum' },
    { name: 'Student Forum', Path: '/student-forum' },
    { name: 'Assessment Report', Path: '/assessment-reports' },
    { name: 'Question Bank', Path: '/question-bank' },
    { name: 'Question Paper', Path: '/assessment-question' },
    { name: 'Create Test', Path: '/assesment' },
    { name: 'Take Test', Path: '/assessment' },
    { name: 'Student Attendance Report', Path: '/student-attendance-report' },
    { name: 'Student Strength', Path: '/student-strength' },

    { name: 'Griviences Teacher', Path: '/griviences/admin-view' },
    { name: 'Griviences Student', Path: '/griviences/student-view' },
    {
      name: 'Manage Orchadio',
      Path: '/orchadio/manage-orchadio',
    },
    {
      name: 'Book Appointment',
      Path: '/appointments',
    },
    {
      name: 'Manage Bank & Fee Accounts',
      Path: '/finance/BankAndFeeAccounts',
    },
    {
      name: 'Student Orchadio',
      Path: '/orchadio/view-orchadio',
    },
    {
      name: 'Teacher Homework Report',
      Path: '/homework-report-teacher-view',
    },
    {
      name: 'Teacher Classwork Report',
      Path: '/classwork-report-teacher-view',
    },
    {
      name: 'Ibook View',
      Path: '/intelligent-book/view',
    },
    {
      name: 'Concession Report',
      Path: '/finance/ConcessionReport',
    },
    {
      name: 'Wallet Report',
      Path: '/finance/WalletReport',
    },
    {
      name: 'Tally Report',
      Path: '/finance/tallyReport',
    },
    {
      name: 'Receipt Book',
      Path: '/finance/ReceiptBook',
    },
    {
      name: "Total Paid and Due Report",
      Path: '/finance/TotalPaidReport'
    },
    {
      name: "Other Fee Total Paid and Due",
      Path: '/finance/OtherFeeTotalPaidReport'
    },
    {
      name: "Bounce Report",
      Path: '/finance/ChequeBounceReport'
    },
    {
      name: "Application/registration Rece",
      Path: '/finance/Application/registration/ReceiptBook'
    },
    {
      name: "Store Report",
      Path: '/finance/StoreReport'
    },
    {
      name: "Total Forms & Report",
      Path: '/finance/TotalFormReport'
    },
    {
      name: "Transaction Status",
      Path: '/finance/TransactionStatus'
    },
    {
      name: "View School Strength",
      Path: '/student-strength'
    },
    {
      name: "Concession Settings",
      Path: "finance/ConcessionSetting"
    },
    {
      name: 'Fee Pay Request',
      Path: '/finance/Approval/Requests/FeePaymentRequests',
    },
    {
      name: "Store Pay Request",
      Path: '/finance/Approval/Requests/StorePaymentRequests'
    },
    {
      name: "Post Dated cheque",
      Path: '/finance/Approval/Requests/PostDateCheque'
    },
    {
      name: "Accept and Reject payments",
      Path: '/finance/Approval/Requests/AcceptRejectPayment'
    },
    {
      name: "Student Active/Inactive",
      Path: '/finance/Student/ActiveInactive/Admin'
    },
    {
      name: "Unassign Fee Requests",
      Path: '/finance/UnassignFeeRequests'
    },
    {
      name: "Student Shuffle Requests",
      Path: '/finance/Approval/Requests/StudentShuffleRequest'
    },
    {
      name: "Tally Report",
      Path: '/finance/TallyReport'
    },
    {
      name: "Other Fee Total Paid and Due Report",
      Path: "/finance/OtherFeeTotalPaidReport"
    },
    {
      name: "Transaction Status",
      Path: "/finance/TransactionStatus"
    },
    {
      name: "Active/Inactive",
      Path: '/finance/Student/ActiveInactive'
    },
    {
      name: "Assign Delivery charge kit books & uniform",
      Path: '/finance/student/AssignDeliveryCharge'
    },
    {
      name: "Fee Collection",
      Path: '/finance/student/FeeCollection'
    },
    {
      name: "Student Shuffle",
      Path: '/finance/StudentShuffleRequest'
    },
    {
      name: "Assign/Change fee plan",
      Path: '/finance/Student/ChnageFeePlanToStudent '
    },
    {
      name: "Student Info",
      Path: '/finance/student/studentInfo'
    },
    {
      name: "Student Promotion",
      Path: '/finance/Student/StudentPromotion'
    },
    {
      name: "QR code",
      Path: '/finance/Student/OqCodeGenerate'
    },
    {
      name: "Communications",
      Path: '/finance/student/Communication'
    },
    {
      name: "Application Form",
      Path: '/finance/accountant/applicationFrom'
    },
    {
      name: "Registration Form",
      Path: '/admissions/registrationForm/'
    },
    {
      name: "Admission Form",
      Path: '/finance/accountant/admissionForm'
    },
    {
      name: "Online Admissions",
      Path: '/finance/admissions/OnlineAdmission'
    },
    {
      name: "Account Login",
      Path: '/finance/BulkOperation/AccountantLogin'
    },
    {
      name: "Permanent Active/Inactive",
      Path: '/finance/BulkOperation/BulkActiveInactive'
    },
    {
      name: "Temporary Active/Inactive",
      Path: '/finance/BulkOperation/BulkActiveInactiveParent'
    },
    {
      name: "Fee Structure Upload",
      Path: '/finance/BulkOperation/Feestructure'
    },
    {
      name: "Bulk Report Upload",
      Path: '/finance/BulkOperation/BulkReportUpload'
    },
    {
      name: "Upload Online Payments",
      Path: '/finance/BulkOperation/UploadOnlinePayment'
    },
    {
      name: "Bulk Status Upload",
      Path: '/finance/BulkOperation/BulkUploadStatus'
    },
    {
      name: "Report Settings",
      Path: '/finance/Setting/ReceiptSettings'
    },
    {
      name: "Last Date Settings",
      Path: '/finance/Setting/LastDateSetting'
    },
    {
      name: "Income Tax Certificate",
      Path: '/finance/Student/IncomeTaxCertificate'
    },
    {
      name: "Create Receipt Ranges",
      Path: '/finance/ReceiptRange'
    },
    {
      name: "Petty Cash Expense",
      Path: '/finance/Expanse%20Management/PettyExpense'
    },
    {
      name: "Party List",
      Path: '/finance/Expanse%20Management/PartyList'
    },
    {
      name: "View Publication",
      Path: '/publications'
    },
    {
      name: "Ebook View",
      Path: '/ebook/view'
    },
    {
      name: "Appointment Responder",
      Path: '/responder-view'
    },
    {
      name: "Contact Us",
      Path: '/contact-us'
    },
    {
      name: "Normal Fee Type",
      Path: '/feeType/normalFeeType'
    },
    {
      name: "Misc. Fee Type",
      Path: '/feeType/miscFeeType'
    },
    {
      name: "Curricular Fee Type",
      Path: '/feeType/CurricularFeeType'
    },
    {
      name: "App/Reg Fee Type",
      Path: '/feeType/RegistrationFee'
    },
    {
      name: "View Fee Plan",
      Path: '/feePlan/ViewFeePlan'
    },
    {
      name: "Misc. Fee Class",
      Path: '/finance/MiscFeeClass'
    },
    {
      name: "Order Details",
      Path: '/finance/E-Mandate/OrderDetails'
    },
    {
      name: "Customer Details",
      Path: '/finance/E-Mandate/CustomerDetails'
    },
    {
      name: "Billing Details",
      Path: '/finance/E-Mandate/BillingDetails'
    },
    {
      name: "Total Billing Details",
      Path: '/finance/E-Mandate/TotalBillingDetails'
    },
    {
      name: "Manage Payments",
      Path: '/finance/ManagePayments'
    },
    {
      name: "Fee Structure",
      Path: '/finance/FeeStructure'
    },
    {
      name: "Books & Uniform",
      Path: '/finance/BooksAndUniform'
    },
    {
      name: "Shipping Payment",
      Path: '/finance/ShippingPayment'
    },
    {
      name: "sub Category allow",
      Path: '/finance/ShippingPayment'
    },
    {
      name: "School store",
      Path: '/Store/AddItems'
    },
    {
      name: "Kit",
      Path: '/Store/CreateKit'
    },
    {
      name: "Store Report",
      Path: '/finance/StoreReport'
    },
    {
      name: "Add Gst",
      Path: '/Store/AddGst'
    },
    {
      name: "Order Status Upload",
      Path: '/Store/OrderStatusUpload'
    },




  ];


  useEffect(() => {
    // console.log("array:",menuSelectionArray)
    menuSelectionArray.forEach((items, index) => {
      if (items.Path === history.location.pathname) {
        setSelectedIndex(index);
        setChild(items.name);
      }
    });
  }, [history.location.pathname]);

  useEffect(() => {
    var count = 0;
    var stateval = false;
    // setChildValue(false);
    navigationItems.forEach((items, index) => {
      // console.log("openMenu:",openMenu);
      if (items.parent_modules === openMenu) {
        // setParent1(openMenu);
        if (child) {
          items.child_module.forEach((childitem, index) => {
            // console.log("Path:",);
            if (childitem.child_name === child) {
              stateval = true;
              // console.log('items:',items);
              count = count + 1;
              // setChildValue(true);
            }
            if (stateval && count != 0) {
              setChildValue(true);
            }
            else {
              setChildValue(false);
            }
          })
        }

      }
    }
    )

    //  else{setChildValue(false);}
  }, [child, openMenu]);


  const classes = useStyles();
  return (
    <>
      <ListItem
        button
        onClick={() => {
          // setMasterIndex(index)
          if (item.child_module.length > 0) {
            onChangeMenuState();
          } else {
            onClick(item.parent_modules);
          }
        }}

        className={menuOpen && childValue && drawerOpen === false ? `menu-item-parent-selection` : ''}
      >

        <ListItemIcon className={menuOpen && childValue && drawerOpen === false ? classes.menuItemIconSelected : classes.menuItemIcon} onClick={() => { onClick(true) }}>
          {/* <MenuIcon name={item.parent_modules} /> */}
          {menuIcon(item.parent_modules)}
        </ListItemIcon>
        <ListItemText primary={item.parent_modules} className='menu-item-text' />
        {item.child_module && item.child_module.length > 0 ? (
          menuOpen ? (
            <ExpandLess className={classes.expandIcons} />
          ) : (

            <ExpandMore className={classes.expandIcons} />
          )
        ) : ''}
      </ListItem>
      {item.child_module && item.child_module.length > 0 && drawerOpen && (
        <Collapse in={menuOpen} className={classes.menuSelectionExpand} >
          {/* <Divider /> */}
          <List >
            {item.child_module.map((child) => (
              <ListItem
                button
                style={{ background: 'none' }}
                className={
                  selectedIndex &&
                    child.child_name === menuSelectionArray[selectedIndex].name
                    ? classes.menuSelectionText
                    : classes.menuItemhover
                }
                onClick={() => {
                  onClick(child.child_name);
                }
                }
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  {/* <MenuIcon name={child.child_name} /> */}
                  {/* {menuIcon(child.child_name)} */}
                </ListItemIcon>
                <ListItemText primary={child.child_name} className='menu-item-text-expand' />
              </ListItem>
            ))}
          </List>
        </Collapse>
      )
      }

    </>
  );
});

export default MenuItem;
