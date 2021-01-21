import {
  Dashboard,
  Payment,
  People,
  ContactSupport,
  Face,
  SupervisorAccount,
  Settings,
  CalendarToday,
  Receipt,
  CloudDownload,
  Timeline,
  Schedule,
  School,
  LibraryBooks,
  //  Textsms,
  PermMedia,
  Pages,
  TextRotateVertical,
  VerticalSplit,
  AccountBalance,
  BusinessCenter,
  MeetingRoom,
  TableChart,
  PermIdentity,
  QuestionAnswer,
  Assessment,
  Subject,
  Class,
  Create,
  Shop,
  Add,
  BorderColor,
  Toll,
  FlipToFront,
  FlipToBack,
  Folder,
  Edit,
  TurnedIn,
  SettingsOverscan,
  Drafts,
  ViewHeadline,
  ImportContacts,
  Toc,
  Sync,
  Description,
  CalendarViewDay,
  CheckCircle,
  BlurCircular,
  CloudUpload,
  Visibility,
  FileCopy,
  Message,
  FormatListNumbered,
  CheckBox,
  AttachMoney,
  Functions,
  HowToVote,
  // CreateNewFolder,
  Money,
  Store,
  BusinessCenterRounded,
  AddBox,
  VideoLibrary,
  Announcement,
  Feedback,
  LibraryAdd,
  RssFeed,
  Chat,
  Report,
  ListAlt,
  Dvr,
  AllInbox,
  RemoveRedEye,
  PeopleOutline,
  Assignment,
  Fastfood,
  // MessageSharp,
  Map,
  PollRounded,
  MenuBook,
  AddCircle,
  LocalLibrary,
  WebAsset,
  Duo,
  AlternateEmail as EmailIcon,
  Group,
  PostAdd,
  Publish,
  PlaylistAddCheck,
  Radio as RadioIcon,
  Equalizer,
  ImportContactsRounded,
  SportsEsports as SportsEsportsIcon
  // BookSharp
} from '@material-ui/icons'
import ForumIcon from '@material-ui/icons/Forum'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import CreateIcon from '@material-ui/icons/Create'
import GroupIcon from '@material-ui/icons/Group'
import TimelineIcon from '@material-ui/icons/Timeline'
import './style.css'

const studentRoutesFinance = () => {
  // const branchId = JSON.parse(localStorage.getItem('user_profile')).branch_id
  const a = true
  // const alwdBrnchFin = [57, 8, 17, 21, 10, 72, 7, 24, 18, 12, 30, 27, 69, 94, 14, 92, 82, 81, 100]
  if (a) {
    return [{
      path: '/finance/student_store',
      sidebarName: 'Books & Uniform',
      navbarName: 'Books & Uniform',
      icon: Store
    }]
  }
  return []
}

// roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'FOE', 'Teacher', 'CFO']
//     path: '/student/promotions/academic/',

// const discussionFormFeature = () => {
//   const branchId = JSON.parse(localStorage.getItem('user_profile'))
//   const alwdBrnchFin = [13]
//   if (alwdBrnchFin.includes(+((branchId.academic_profile && branchId.academic_profile.branch_id && branchId.academic_profile.branch_id) || (branchId.branch_id) || ''))) {
//     return (
//       {
//         path: '/discussionForm',
//         sidebarName: 'Discussion Forum',
//         navbarName: 'Discussion Forum',
//         icon: ForumIcon
//       })
//   }
//   return {}
// }

const getJournals = () => {
  const { grade_name: gradeName } = JSON.parse(localStorage.getItem('user_profile'))
  const gradeNamesToExcludeJournal = ['Pre-Nursery', 'Nursery', 'K1', 'K2', 'UKG', 'LKG', 'Pre KG1']
  if (!gradeNamesToExcludeJournal.includes(gradeName)) {
    return {
      path: '/lockdown_journals',
      sidebarName: 'Journal',
      navbarName: 'Journal',
      icon: Visibility
    }
  }
  return {}
}

const SideBarRoutes = {
  StoreAdmin: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    {
      path: '#',
      sidebarName: 'School Store',
      navbarName: 'School Store',
      icon: Store,
      content: [
        {
          path: '/store/additems',
          sidebarName: 'View Items',
          navbarName: 'View Items'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Kit',
      navbarName: 'Kit',
      icon: BusinessCenterRounded,
      content: [
        {
          path: '/store/addkit',
          sidebarName: 'Create Kit',
          navbarName: 'Create Kit'
        }
      ]
    },
    {
      path: '/store/storereports',
      sidebarName: 'Store Report',
      navbarName: 'Store Report',
      icon: Sync
    },
    {
      path: '/store/addGst',
      sidebarName: 'Add GST',
      navbarName: 'Add GST',
      icon: Money
    },
    {
      path: '/store/orderStatusUpload',
      sidebarName: 'Order Status Upload',
      navbarName: 'Order Status Upload',
      icon: LibraryBooks
    },
    {
      path: '/store/subcategoryallow',
      sidebarName: 'Sub Category Allow',
      navbarName: 'Sub Category Allow',
      icon: BusinessCenterRounded
    }
  ],
  FinanceAdmin: [
    {
      path: '/finance/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    {
      path: '#',
      sidebarName: 'E-Mandate',
      navbarName: 'E-Mandate',
      icon: LibraryBooks,
      content: [
        {
          path: '/finance/billingDetails',
          sidebarName: 'Billing Details',
          navbarName: 'Billing Details',
          icon: Money
        },
        {
          path: '/finance/e-customerdetail',
          sidebarName: 'Customer Details',
          navbarName: 'Customer Details',
          icon: Money
        },
        {
          path: '/finance/e-orderdetail',
          sidebarName: 'Order Details',
          navbarName: 'Order Details',
          icon: Money
        },
        {
          path: '/finance/dailybillingdeatils',
          sidebarName: 'Total Billing Details',
          navbarName: 'Total Billing Details',
          icon: Money
        }
      ]
    },
    {
      path: '/finance/onlineAdmissions',
      sidebarName: 'Online Admission',
      navbarName: 'Online Admission',
      icon: Money
    },
    {
      path: '/finance/uploadOnlinePayments',
      sidebarName: 'Upload Online Payments',
      navbarName: 'Upload Online Payments',
      icon: Money
    },
    {
      path: '#',
      sidebarName: 'Create Fee Type',
      navbarName: 'Create Fee Type',
      icon: LibraryBooks,
      content: [
        {
          path: '/finance/feeType',
          sidebarName: 'Normal Fee Type',
          navbarName: 'Normal Fee Type'
        },
        {
          path: '/finance/misc_feeType',
          sidebarName: 'Misc Fee Type',
          navbarName: 'Misc Fee Type'
        },
        {
          path: '/finance/currFeeType',
          sidebarName: 'Curr Fee Type',
          navbarName: 'Curr Fee Type'
        },
        {
          path: '/finance/registration_feeType',
          sidebarName: 'Registration/Application Fee Type',
          navbarName: 'Registration/Application Fee Type'
        }
        // {
        //   path: '/finance/other_feeType',
        //   sidebarName: 'Other Fee Type',
        //   navbarName: 'Other Fee Type'
        // }
      ]
    },
    {
      path: '#',
      sidebarName: 'Fee Plan',
      navbarName: 'Fee Plan',
      icon: LibraryBooks,
      content: [
        {
          path: '/finance/view_feePlan',
          sidebarName: 'View Fee Plan',
          navbarName: 'View Fee Plan'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Misc Fee To Class',
      navbarName: 'Misc Fee To Class',
      icon: LibraryBooks,
      content: [
        {
          path: '/finance/misc_feeClass',
          sidebarName: 'Misc Fee Class',
          navbarName: 'Misc Fee Class'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Bank & Fee Accounts',
      navbarName: 'Bank & Fee Accounts',
      icon: LibraryBooks,
      content: [
        {
          path: '/finance/corporate_bank',
          sidebarName: 'Manage Bank & Fee Accounts',
          navbarName: 'Manage Bank & Fee Accounts'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Other Fees',
      navbarName: 'Other Fees',
      icon: AddBox,
      content: [
        {
          path: '/finance/other_fee',
          sidebarName: 'Add Other Fees',
          navbarName: 'Add Other Fees'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Approvals/Requests',
      navbarName: 'Fee Plan',
      icon: Dvr,
      content: [
        {
          path: '/finance/unassign_feeRequest',
          sidebarName: 'Unassign Fee Request',
          navbarName: 'Unassign Fee Request'
        },
        {
          path: '/finance/student_shuffle',
          sidebarName: 'Student Shuffle Request',
          navbarName: 'Student Shuffle Request'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Receipt Ranges',
      navbarName: 'Receipt Ranges',
      icon: LibraryBooks,
      content: [
        {
          path: '/finance/create_receipt',
          sidebarName: 'Create Receipt Ranges',
          navbarName: 'Create Receipt Ranges'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Manage Concession',
      navbarName: 'Manage Concession',
      icon: LibraryBooks,
      content: [
        {
          path: '/finance/concession_settings',
          sidebarName: 'Concession Settings',
          navbarName: 'Concession Settings'
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Concession Report',
    //   navbarName: 'Concession Report',
    //   icon: LibraryBooks,
    //   content: [
    //     {
    //       path: '/finance/concession_report',
    //       sidebarName: 'Concession Report',
    //       navbarName: 'Concession Report'
    //     }
    //   ]
    // },
    {
      path: '#',
      sidebarName: 'Transaction',
      navbarName: 'Transaction',
      icon: LibraryBooks,
      content: [
        {
          path: '/finance/transaction_status',
          sidebarName: 'Transaction Status',
          navbarName: 'Transaction Status'
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Normal Fee Reports',
    //   navbarName: 'Normal Fee Reports',
    //   icon: CloudDownload,
    //   content: [
    //     {
    //       path: '/finance/tally_reports',
    //       sidebarName: 'Tally Reports',
    //       navbarName: 'Tally Reports'
    //     },
    //     {
    //       path: '/finance/receipt_book',
    //       sidebarName: 'Receipt Book',
    //       navbarName: 'Receipt Book'
    //     },
    //     {
    //       path: '/finance/total_paid_due_reports',
    //       sidebarName: 'Total Paid & Due Reports',
    //       navbarName: 'Total Paid & Due Reports'
    //     },
    //     {
    //       path: '/finance/chequeBounceReports',
    //       sidebarName: 'Bounce Reports',
    //       navbarName: 'Bounce Reports'
    //     }
    //   ]
    // },
    {
      path: '#',
      sidebarName: 'Reports',
      navbarName: 'Reports',
      icon: CloudDownload,
      content: [
        {
          path: '/finance/concession_report',
          sidebarName: 'Concession Report',
          navbarName: 'Concession Report'
          // icon: CloudDownload
        },
        {
          path: '/finance/wallet_report',
          sidebarName: 'Wallet Report',
          navbarName: 'Wallet Report'
          // icon: Report
        },
        {
          path: '/finance/tally_reports',
          sidebarName: 'Tally Reports',
          navbarName: 'Tally Reports'
        },
        {
          path: '/finance/receipt_book',
          sidebarName: 'Receipt Book',
          navbarName: 'Receipt Book'
        },
        {
          path: '/finance/total_paid_due_reports',
          sidebarName: 'Total Paid & Due Reports',
          navbarName: 'Total Paid & Due Reports'
        },
        {
          path: '/finance/Other_fee_total_paid_due_reports',
          sidebarName: 'Other Fee Total Paid & Due Reports',
          navbarName: 'Other Fee Total Paid & Due Reports'
        },
        {
          path: '/finance/chequeBounceReports',
          sidebarName: 'Bounce Reports',
          navbarName: 'Bounce Reports'
        },
        {
          path: '/finance/adm_receipt_book',
          sidebarName: 'Application/Registration Receipt Book',
          navbarName: 'Application/Registration Receipt Book'
        },
        {
          path: '/store/storereports',
          sidebarName: 'Store Report',
          navbarName: 'Store Report'
          // icon: Sync
        },
        {
          path: '/finance/totalformcount',
          sidebarName: 'Total Form & Reports',
          navbarName: 'Total Form & Reports'
          // icon: Report
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Application/Registration Fee Reports',
    //   navbarName: 'Application/Registration Fee Reports',
    //   icon: CloudDownload,
    //   content: [
    //     {
    //       path: '/finance/adm_receipt_book',
    //       sidebarName: 'Receipt Book',
    //       navbarName: 'Receipt Book'
    //     }
    //   ]
    // },
    // {
    //   path: '/store/storereports',
    //   sidebarName: 'Store Report',
    //   navbarName: 'Store Report',
    //   icon: Sync
    // },
    {
      path: '#',
      sidebarName: 'Expense Management',
      navbarName: 'Expense Management',
      icon: HowToVote,
      content: [
        {
          path: '/finance/expmngmt/deposit',
          sidebarName: 'Deposit',
          navbarName: 'Deposit'
        },
        {
          path: '/finance/expmngmt/ledger',
          sidebarName: 'Ledger',
          navbarName: 'Ledger'
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Admission',
    //   navbarName: 'Admission',
    //   icon: HowToVote,
    //   content: [
    //     {
    //       path: '/finance/totalformcount',
    //       sidebarName: 'Total Form & Reports',
    //       navbarName: 'Total Form & Reports',
    //       icon: Report
    //     }
    //   ]
    // },
    {
      path: '/finance/studentPromotion',
      sidebarName: 'Student Promotion',
      navbarName: 'Student Promotion',
      icon: HowToVote
    },
    {
      path: '/finance/lastDateSettings',
      sidebarName: 'Last Date Settings',
      navbarName: 'Last Date Settings',
      icon: Settings
    },
    {
      path: '/finance/communicationsms',
      sidebarName: 'Communication',
      navbarName: 'Communication',
      icon: Chat
    },
    {
      path: '/finance/changeFeePaymentRequests',
      sidebarName: 'Fee Pay Requests',
      navbarName: 'Fee Pay Requests',
      icon: Drafts
    },
    {
      path: '/finance/storePayRequests',
      sidebarName: 'Store Pay Requests',
      navbarName: 'Store Pay Requests',
      icon: Drafts
    },
    {
      path: '/finance/incomeTaxCertificate',
      sidebarName: 'Income Tax Certificate',
      navbarName: 'Income Tax Certificate',
      icon: Money
    },
    // {
    //   path: '/finance/e-mandate',
    //   sidebarName: 'E-Mandate',
    //   navbarName: 'E-Mandate',
    //   icon: Money
    // },
    {
      path: '/finance/e-customerdetails',
      sidebarName: 'Add Customer Details',
      navbarName: 'Add Customer Details',
      icon: Money
    },
    // {
    //   path: '/finance/billingDetails',
    //   sidebarName: 'Billing Deatils',
    //   navbarName: 'Billing Deatils',
    //   icon: Money
    // },
    {
      path: '/finance/receiptSettings',
      sidebarName: 'Receipt Settings',
      navbarName: 'Receipt Settings',
      icon: Receipt
    },
    {
      path: '/finance/studentInfo',
      sidebarName: 'Student Info',
      navbarName: 'Student Info',
      icon: HowToVote
    },
    {
      path: '#',
      sidebarName: 'Bulk Operations',
      navbarName: 'Bulk Operations',
      icon: AllInbox,
      content: [
        {
          path: '/finance/bulkactiveinactivestudent',
          sidebarName: 'Permanent Active / Inactive',
          navbarName: 'Permanent Active / Inactive'
        },
        {
          path: '/finance/bulkactiveinactiveparent',
          sidebarName: 'Temporary Active / Inactive ',
          navbarName: 'Temporary Active / Inactive'
        },
        {
          path: '/finance/bulkaccountantlogin',
          sidebarName: 'Accountant Login',
          navbarName: 'Accountant Login'
        },
        {
          path: '/finance/bulkFeeUpload',
          sidebarName: 'Fee Structure Upload',
          navbarName: 'Fee Structure Upload'
        },
        {
          path: '/finance/bulkReportUpload',
          sidebarName: 'Bulk Report Upload',
          navbarName: 'Bulk Report Upload'
        },
        {
          path: '/finance/bulkReportStatus',
          sidebarName: 'Bulk Upload Status',
          navbarName: 'Bulk Upload Status'
        },
        {
          path: '/finance/onlinepaymentupload',
          sidebarName: 'Online Payment Upload',
          navbarName: 'OnlinePaymentUpload'
        }
      ]
    },
    {
      path: '/finance/qrcodegenerator',
      sidebarName: 'QR Code',
      navbarName: 'QR Code',
      icon: PermIdentity
    },
    {
      path: '/finance/createcoupon',
      sidebarName: 'Create Coupon',
      navbarName: 'Create Coupon',
      icon: PermIdentity
    },
    {
      path: '/finance/assigncoupon',
      sidebarName: 'Assign Coupon',
      navbarName: 'Assign Coupon',
      icon: PermIdentity
    },
    {
      path: '/finance/studentwallet',
      sidebarName: 'Student Wallet',
      navbarName: 'Student Wallet',
      icon: PermIdentity
    }
    // {
    //   path: '#',
    //   sidebarName: 'Scool Meal',
    //   navbarName: 'Scool Meal',
    //   icon: Fastfood,
    //   content: [
    //     {
    //       path: '/finance/scoolmeal/termsandconditions',
    //       sidebarName: 'Terms & Conditions',
    //       navbarName: 'Terms & Conditions'
    //     }
    //   ]
    // }
  ],
  FinanceAccountant: [
    {
      path: '/financeAcc/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    {
      path: '/finance/onlineAdmissions',
      sidebarName: 'Online Admission',
      navbarName: 'Online Admission',
      icon: Money
    },
    {
      path: '#',
      sidebarName: 'E-Mandate',
      navbarName: 'E-Mandate',
      icon: LibraryBooks,
      content: [
        {
          path: '/finance/billingDetails',
          sidebarName: 'Billing Details',
          navbarName: 'Billing Details',
          icon: Money
        },
        {
          path: '/finance/e-customerdetail',
          sidebarName: 'Customer Details',
          navbarName: 'Customer Details',
          icon: Money
        },
        {
          path: '/finance/e-orderdetail',
          sidebarName: 'Order Details',
          navbarName: 'Order Details',
          icon: Money
        },
        {
          path: '/finance/dailybillingdeatils',
          sidebarName: 'Total Billing Details',
          navbarName: 'Total Billing Details',
          icon: Money
        }
      ]
    },
    {
      path: '/finance/studentLedger',
      sidebarName: 'Ledger Tab',
      navbarName: 'Ledger Tab',
      icon: Payment
    },
    {
      path: '/finance/accountant/postdatecheque',
      sidebarName: 'Post Date Cheque',
      navbarName: 'PDC',
      icon: BusinessCenterRounded
    },
    {
      path: '/finance/accountant/assignfeeplantostudent',
      sidebarName: 'Assign/Change Fee Plan',
      navbarName: 'Assign/Change Fee Plan',
      icon: People
    },
    // {
    //   path: '/finance/transaction_status',
    //   sidebarName: 'All Transaction',
    //   navbarName: 'All Transaction',
    //   icon: AccountBalance
    // },
    {
      path: '#',
      sidebarName: 'Other Fees',
      navbarName: 'Other Fees',
      icon: HowToVote,
      content: [
        // {
        //   path: '/finance/otherFees_payment',
        //   sidebarName: 'Other Fees Payment',
        //   navbarName: 'Other Fees Payment'
        // },
        {
          path: '/finance/assign_otherFees',
          sidebarName: 'Assign Other Fees',
          navbarName: 'Assign Other Fees'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Admission',
      navbarName: 'Admission',
      icon: HowToVote,
      content: [
        {
          path: '/finance/accountant/applicationForm',
          sidebarName: 'Application Form',
          navbarName: 'Application Form',
          icon: Face
        },
        {
          path: '/finance/accountant/registrationForm',
          sidebarName: 'Registration Form',
          navbarName: 'Registration Form',
          icon: Face
        },
        {
          path: '/finance/AdmissionForm',
          sidebarName: 'Admission Form',
          navbarName: 'Admission Form',
          icon: AttachMoney
        }
        // {
        //   path: '/finance/totalformcount',
        //   sidebarName: 'Total Form & Reports',
        //   navbarName: 'Total Form & Reports',
        //   icon: Report
        // }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Normal Fee Reports',
    //   navbarName: 'Normal Fee Reports',
    //   icon: LibraryBooks,
    //   content: [
    //     {
    //       path: '/finance/tally_reports',
    //       sidebarName: 'Tally Reports',
    //       navbarName: 'Tally Reports'
    //     },
    //     {
    //       path: '/finance/receipt_book',
    //       sidebarName: 'Receipt Book',
    //       navbarName: 'Receipt Book'
    //     },
    //     {
    //       path: '/finance/total_paid_due_reports',
    //       sidebarName: 'Total Paid & Due Reports',
    //       navbarName: 'Total Paid & Due Reports'
    //     },
    //     {
    //       path: '/finance/chequeBounceReports',
    //       sidebarName: 'Bounce Reports',
    //       navbarName: 'Bounce Reports'
    //     }
    //   ]
    // },
    {
      path: '#',
      sidebarName: 'Reports',
      navbarName: 'Reports',
      icon: CloudDownload,
      content: [
        {
          path: '/finance/concession_report',
          sidebarName: 'Concession Report',
          navbarName: 'Concession Report'
          // icon: CloudDownload
        },
        {
          path: '/finance/tally_reports',
          sidebarName: 'Tally Reports',
          navbarName: 'Tally Reports'
        },
        {
          path: '/finance/receipt_book',
          sidebarName: 'Receipt Book',
          navbarName: 'Receipt Book'
        },
        {
          path: '/finance/total_paid_due_reports',
          sidebarName: 'Total Paid & Due Reports',
          navbarName: 'Total Paid & Due Reports'
        },
        {
          path: '/finance/Other_fee_total_paid_due_reports',
          sidebarName: 'Other Fee Total Paid & Due Reports',
          navbarName: 'Other Fee Total Paid & Due Reports'
        },
        {
          path: '/finance/totalformcount',
          sidebarName: 'Total Form & Reports',
          navbarName: 'Total Form & Reports'
          // icon: Report
        },
        {
          path: '/finance/chequeBounceReports',
          sidebarName: 'Bounce Reports',
          navbarName: 'Bounce Reports'
        },
        {
          path: '/finance/adm_receipt_book',
          sidebarName: 'Application/Registration Receipt Book',
          navbarName: 'Application/Registration Receipt Book'
        },
        {
          path: '/finance/transaction_status',
          sidebarName: 'All Transaction',
          navbarName: 'All Transaction'
          // icon: AccountBalance
        },
        {
          path: '/store/storereports',
          sidebarName: 'Store Report',
          navbarName: 'Store Report'
          // icon: Sync
        },
        {
          path: '/finance/shufflereports',
          sidebarName: 'Student Shuffle Reports',
          navbarName: 'Student Shuffle Reports'
        },
        {
          path: '/finance/contactdetailsreeport',
          sidebarName: 'Student Contact Details Report',
          navbarName: 'Student Contact Details Report'
        },
        {
          path: '/finance/wallet_report',
          sidebarName: 'Wallet Report',
          navbarName: 'Wallet Report'
          // icon: Report
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Application/Registration Fee Reports',
    //   navbarName: 'Application/Registration Fee Reports',
    //   icon: CloudDownload,
    //   content: [
    //     {
    //       path: '/finance/adm_receipt_book',
    //       sidebarName: 'Application/Registration Receipt Book',
    //       navbarName: 'Application/Registration Receipt Book'
    //     }
    //   ]
    // },
    // {
    //   path: '/store/storereports',
    //   sidebarName: 'Store Report',
    //   navbarName: 'Store Report',
    //   icon: Sync
    // },
    {
      path: '#',
      sidebarName: 'Expense Management',
      navbarName: 'Expense Management',
      icon: HowToVote,
      content: [
        {
          path: '/finance/accountant/pettyexpnc',
          sidebarName: 'Petty Cash Expense',
          navbarName: 'Petty Cash Expense'
        },
        {
          path: '/finance/accountant/partylist',
          sidebarName: 'Party List',
          navbarName: 'Party List'
        }
      ]
    },
    {
      path: '/finance/acceptrejectPayment',
      sidebarName: 'Accept/Reject Payment',
      navbarName: 'Accept/Reject Payment',
      icon: Payment
    },
    {
      path: '/finance/communicationsms',
      sidebarName: 'Communication',
      navbarName: 'Communication',
      icon: Chat
    },
    {
      path: '/finance/studentshuffle',
      sidebarName: 'Student Shuffle',
      navbarName: 'Student Shuffle',
      icon: HowToVote
    },
    {
      path: '#',
      sidebarName: 'Bulk Operations',
      navbarName: 'Bulk Operations',
      icon: AllInbox,
      content: [
        {
          path: '/finance/bulkFeeUpload',
          sidebarName: 'Fee Structure Upload',
          navbarName: 'Fee Structure Upload'
        },
        {
          path: '/finance/bulkReportUpload',
          sidebarName: 'Bulk Report Upload',
          navbarName: 'Bulk Report Upload'
        },
        {
          path: '/finance/bulkReportStatus',
          sidebarName: 'Bulk Upload Status',
          navbarName: 'Bulk Upload Status'
        }
      ]
    },
    // {
    //   path: '/finance/accountant/store',
    //   sidebarName: 'Store',
    //   navbarName: 'Store',
    //   icon: HowToVote
    // },
    // {
    //   path: '/finance/certificate',
    //   sidebarName: 'IT Certificate',
    //   navbarName: 'IT Certificate',
    //   icon: Dashboard
    // },
    {
      path: '/finance/FeeCollection',
      sidebarName: 'Fee Collection',
      navbarName: 'Fee Collection',
      icon: AttachMoney
    },
    {
      path: '/finance/assignDeliveryCharge',
      sidebarName: 'Assign Delivery Charge Kit Books & Uniform',
      navbarName: 'Assign Delivery Charge Kit Books & Uniform',
      icon: BusinessCenterRounded
    },
    {
      path: '/finance/StudentActivateInactiveAcc',
      sidebarName: 'Student Reactivate/Inactive',
      navbarName: 'Student Reactivate/Inactive',
      icon: HowToVote
    }
    // {
    //   path: '#',
    //   sidebarName: 'Reports',
    //   navbarName: 'Reports',
    //   icon: CloudDownload,
    //   content: [
    //     {
    //       path: '/finance/concession_report',
    //       sidebarName: 'Concession Report',
    //       navbarName: 'Concession Report',
    //       icon: CloudDownload
    //     }
    //   ]
    // }
  ],
  Admin: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    // {
    //   path: '/homework/dashboard',
    //   sidebarName: 'Homework Dashboard',
    //   navbarName: 'Homework Dashboard',
    //   icon: Assignment
    // },
    {
      path: '#',
      sidebarName: 'Homework Dashboard',
      navbarName: 'Homework Dashboard',
      icon: Assignment,
      content: [
        {
          path: '/homework/dashboard',
          sidebarName: 'Homework',
          navbarName: 'Homework'
          // icon: Assignment
        },
        {
          path: '/homework/report',
          sidebarName: 'Report',
          navbarName: 'Report'
          // icon: Assignment
        }
      ]
    },
    {
      path: '/game',
      sidebarName: 'Game',
      navbarName: 'Game',
      icon: SportsEsportsIcon
    },
    {
      path: '#',
      sidebarName: 'Masters',
      navbarName: 'Masters',
      icon: People,
      content: [
        {
          path: '/staff',
          sidebarName: 'Staff',
          navbarName: 'Staff',
          icon: SupervisorAccount
        },
        {
          path: '/student',
          sidebarName: 'Students',
          navbarName: 'Students',
          icon: Face
        },
        {
          path: '/student/upload',
          sidebarName: 'Students Data Upload',
          navbarName: 'Students Data Upload',
          icon: CloudUpload
        },
        {
          path: '/student/shuffle',
          sidebarName: 'Students Shuffle Upload',
          navbarName: 'Students Shuffle Upload',
          icon: CloudUpload
        },
        {
          path: '/bulkExcelDownloadStudentStaff',
          sidebarName: 'Bulk Download',
          navbarName: 'BulkExcelDownloadStudentStaff',
          icon: CloudDownload
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Master Management',
      navbarName: 'Master Management',
      icon: Settings,
      content: [
        {
          path: '#',
          sidebarName: 'Manage Subjects',
          navbarName: 'Manage Subjects',
          icon: LibraryBooks,
          content: [
            {
              path: '/subject',
              sidebarName: 'Subject',
              navbarName: 'Subject'
            },
            {
              path: '/subjectMapping',
              sidebarName: 'Subject Mapping',
              navbarName: 'Subject Mapping'
            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Manage Grades',
          navbarName: 'Manage Grades',
          icon: TextRotateVertical,
          content: [
            {
              path: '/grade',
              sidebarName: 'Grade',
              navbarName: 'Grade'
            },
            {
              path: '/gradeMapping',
              sidebarName: 'Grade Mapping',
              navbarName: 'Grade Mapping'
            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Manage Sections',
          navbarName: 'Manage Sections',
          icon: VerticalSplit,
          content: [
            {
              path: '/section',
              sidebarName: 'Section',
              navbarName: 'Section'
            },
            {
              path: '/sectionMapping',
              sidebarName: 'Section Mapping',
              navbarName: 'Section Mapping'
            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Manage Branches',
          navbarName: 'Manage Branches',
          icon: AccountBalance,
          content: [
            {
              path: '/branch',
              sidebarName: 'Branches',
              navbarName: 'Branches'
            },
            {
              path: '/session',
              sidebarName: 'Session',
              navbarName: 'Session'
            }
          ]
        },
        {
          path: '/designation',
          sidebarName: 'Designation',
          navbarName: 'Designation',
          icon: BusinessCenter
        },
        // {
        //   path: '/classGroup',
        //   sidebarName: 'Class Group',
        //   navbarName: 'Class Group',
        //   icon: Group
        // },
        {
          path: '/gradeCategory',
          sidebarName: 'Grade Category',
          navbarName: 'Grade Category',
          icon: TableChart
        },
        // {
        //   path: '/vacation',
        //   sidebarName: 'Vacation',
        //   navbarName: 'Vacation',
        //   icon: GolfCourse
        // },
        // {
        //   path: '/vacationType',
        //   sidebarName: 'Vacation Type',
        //   navbarName: 'Vacation Type',
        //   icon: GolfCourse
        // },
        // {
        //   path: '/period',
        //   sidebarName: 'Period',
        //   navbarName: 'Period',
        //   icon: HorizontalSplit
        // },
        {
          path: '/role',
          sidebarName: 'Role',
          navbarName: 'Role',
          icon: PermIdentity
        },
        {
          path: '/department',
          sidebarName: 'Department',
          navbarName: 'Department',
          icon: MeetingRoom
        }
      ]
    },
    // {
    //   path: '/report_analysis',
    //   sidebarName: 'Report Analysis',
    //   navbarName: 'Report Analysis',
    //   icon: Timeline
    // },
    {
      path: '/orchadio/admin',
      sidebarName: 'Manage Orchadio',
      navbarName: 'Manage Orchadio',
      icon: RadioIcon
    },
    {
      path: '/reviews',
      sidebarName: 'Student Reviews',
      navbarName: 'Student Reviews',
      icon: Feedback
    },
    {
      path: '/calendar',
      sidebarName: 'Calendar',
      navbarName: 'Calendar',
      icon: CalendarToday
    },
    {
      path: '#',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday,
      content: [
        {
          path: '/publications',
          sidebarName: 'View Publications',
          navbarName: 'View Publications'
        },
        {
          path: '/uploadpublications',
          sidebarName: 'Upload Publications',
          navbarName: 'Upload Publications'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'SMS/Email',
      navbarName: 'SMS/Email',
      icon: Drafts,
      content: [
        // {
        //   path: '/sms/classWiseSms',
        //   sidebarName: 'Class Wise SMS',
        //   navbarName: 'Class Wise SMS',
        //   icon: Announcement
        // },
        // {
        //   path: '/sms/sectionWiseSms/',
        //   sidebarName: 'Section Wise SMS',
        //   navbarName: 'Section Wise SMS',
        //   icon: Textsms
        // },
        // {
        //   path: '/sms/classGroupSms/',
        //   sidebarName: 'Class Group SMS',
        //   navbarName: 'Class Group SMS',
        //   icon: Message
        // },
        {
          path: '/emailsms/',
          sidebarName: 'Send Email/SMS',
          navbarName: 'Send Email/SMS',
          icon: EmailIcon
        },
        {
          path: '/sms/log/',
          sidebarName: 'Email/SMS Logs',
          navbarName: 'Email/SMS Logs',
          icon: Message
        },
        {
          path: '/sms/offlineSms/',
          sidebarName: 'Offline SMS',
          navbarName: 'Offline SMS',
          icon: Chat
        },
        {
          path: '/sms/addSMSCredits/',
          sidebarName: 'SMS Credits',
          navbarName: 'SMS Credits',
          icon: Chat
        }
      ]
    },
    {
      path: '/excelReportsDownloadAdmin',
      sidebarName: 'ConsolidationReports',
      navbarName: 'ExcelReports',
      icon: Report

    }, {
      path: '#',
      sidebarName: 'Attendance',
      icon: CheckCircle,
      content: [
        {
          path: '/attendance',
          sidebarName: 'Take Attendance',
          icon: CalendarToday
        },
        {
          path: '/attendance/view',
          sidebarName: 'View Attendance',
          icon: CalendarViewDay
        },
        {
          path: '/attendance/excelreport',
          sidebarName: 'Excel Reports ',
          icon: CloudDownload
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Practice Questions',
      icon: Toc,
      content: [
        {
          path: '/questbox/PracticeQuestions/edit_chapters',
          sidebarName: 'Revise Practice Questions',
          navbarName: 'Revise Practice Questions',
          icon: TableChart
        },
        {
          path: '/questbox/PracticeQuestions/view_analysis',
          sidebarName: 'Analytics',
          navbarName: 'Analytics',
          icon: PollRounded
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Circular',
      icon: BlurCircular,
      content: [
        {
          path: '/v2/circular',
          sidebarName: 'Upload Circular',
          navbarName: 'Upload Circular',
          icon: CloudUpload
        },
        {
          path: '/v2/circular/view',
          sidebarName: 'View Circular',
          navbarName: 'View Circular',
          icon: Visibility
        },
        {
          path: '/v2/circular/template/add',
          sidebarName: 'Add Circular Template',
          navbarName: 'Add Circular Template',
          icon: AddCircle
        },
        {
          path: '/v2/circular/template/view',
          sidebarName: 'View Circular Template',
          navbarName: 'View Circular Template',
          icon: Visibility
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'ID Card',
      navbarName: 'IDCard',
      icon: People,
      content: [
        {
          path: '/staffIdCard/0',
          sidebarName: 'Staff ID Card',
          navbarName: 'Staff ID Card',
          icon: People
        },
        {
          path: '/studentIdCard/0',
          sidebarName: 'Student ID Card',
          navbarName: 'Student ID card',
          icon: People
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Class Group',
      navbarName: 'Class Group',
      icon: LibraryAdd,
      content: [
        {
          path: '/addClassGroup/',
          sidebarName: 'Add Class Group ',
          navbarName: 'Add Class Group',
          icon: LibraryAdd
        },
        {
          path: '/classGroup/view',
          sidebarName: 'View Class Group ',
          navbarName: 'View Class Group',
          icon: LibraryAdd
        }
      ]
    },
    {
      path: '/timetable',
      sidebarName: 'Time Table',
      navbarName: 'Time Table',
      icon: Timeline
    },
    {
      path: '#',
      sidebarName: 'Teacher Management',
      icon: School,
      content: [
        {
          path: '/assignSubjectTeacher',
          sidebarName: 'Assign Subject Teacher',
          navbarName: 'Assign Subject Teacher'
        },
        {
          path: '/teacher-report/view',
          sidebarName: 'Teacher Report',
          navbarName: 'Teacher Report'
        },
        {
          path: '/teacher-lagging-report',
          sidebarName: 'Teacher Lagging Report',
          navbarName: 'Teacher Lagging Report'
        },
        {
          path: '/teacher-list',
          sidebarName: 'Teacher List',
          navbarName: 'Teacher List'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Questbox',
      icon: QuestionAnswer,
      content: [
        {
          path: '/questbox/dashboard',
          sidebarName: 'Dashboard',
          navbarName: 'Dashboard',
          icon: Dashboard
        },
        {
          path: '#',
          sidebarName: 'Questions',
          navbarName: 'Questions',
          icon: Subject,
          content: [
            {
              path: '/questbox/addquestion',
              sidebarName: 'Create Question',
              navbarName: 'Create Question',
              icon: Create
            },
            {
              path: '/questbox/uploadQuestionExcel',
              sidebarName: 'Upload Question from Excel',
              navbarName: 'Upload Question from Excel',
              icon: Shop
            },
            {
              path: '/questbox/createquestionpaper',
              sidebarName: 'Create Question Paper',
              navbarName: 'Create Question Paper',
              icon: BorderColor
            },
            {
              path: '/questbox/questionpaper',
              sidebarName: 'View Question Paper',
              navbarName: 'View Question Paper',
              icon: Toll
            },
            {
              path: '/questbox/add',
              sidebarName: 'Add Question paper Type and Sub Type',
              navbarName: 'Add Question paper Type and Sub Type',
              icon: Map
            },
            {
              path: '/questbox/view',
              sidebarName: 'View Question paper Type and Sub Type',
              navbarName: 'View Question paper Type and Sub Type',
              icon: Map
            },

            {
              path: '/questbox/listquestion',
              sidebarName: 'List Question',
              navbarName: 'List Question',
              icon: FlipToFront
            },
            {
              path: '/questbox/list_comprehension_question',
              sidebarName: 'List Comprehension Question',
              navbarName: 'List Comprehension Question',
              icon: FlipToBack
            },
            {
              path: '/questbox/questions/view/reported_questions',
              sidebarName: 'View Reported Questions',
              navbarName: 'View Reported Questions',
              icon: Visibility
            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Chapters',
          navbarName: 'Chapters',
          icon: Class,
          content: [
            {
              path: '/questbox/addchapter',
              sidebarName: 'Add Chapter',
              navbarName: 'Add Chapter',
              icon: Add
            },
            {
              path: '/questbox/viewchapter',
              sidebarName: 'View Chapter',
              navbarName: 'View Chapter',
              icon: RemoveRedEye
            }
          ]
        },
        {
          path: '/files',
          sidebarName: 'Files',
          navbarName: 'Files',
          icon: Folder
        },
        {
          path: '#',
          sidebarName: 'Assessment',
          navbarName: 'Assessment',
          icon: Assessment,
          content: [
            {
              path: '/questbox/create_assessment',
              sidebarName: 'Create Assessment',
              navbarName: 'Create Assessment',
              icon: Edit
            },
            {
              path: '/questbox/assessment/view',
              sidebarName: 'View Assessment',
              navbarName: 'View Assessment',
              icon: TurnedIn
            },
            {
              path: '/questbox/upload_result_excel',
              sidebarName: 'Upload Result',
              navbarName: 'Upload Result',
              icon: SettingsOverscan
            },
            {
              path: '/questbox/configuration',
              sidebarName: 'Configuration Mappings',
              navbarName: 'Configuration Mappings',
              icon: Map
            },
            {
              path: '/UploadAssessmentExcel',
              sidebarName: 'Upload Assessment Excel',
              icon: CloudUpload

            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Tests',
          navbarName: 'Tests',
          icon: CheckBox,
          content: [
            {
              path: '/questbox/createTest',
              sidebarName: 'Create Test',
              navbarName: 'Create Test',
              icon: Create
            },
            {
              path: '/questbox/viewTests',
              sidebarName: 'View Tests',
              navbarName: 'View Tests',
              icon: FormatListNumbered
            }
          ]
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Finance',
    //   navbarName: 'Finance',
    //   icon: People ,
    //   content: [

    //   ]
    // },
    {
      path: '/change_Password',
      sidebarName: 'Change Password',
      navbarName: 'Change Password',
      icon: Sync
    },
    {
      path: '/generalDiary',
      sidebarName: 'General Diary',
      icon: ListAlt
    },
    {
      path: '#',
      sidebarName: 'Certificate',
      icon: PostAdd,
      content: [
        {
          path: '/certificate',
          sidebarName: 'Give Certificate',
          navbarName: 'Certificate',
          icon: PostAdd
        },
        {
          path: '/certificate/signatureManager',
          sidebarName: 'Signature Upload',
          navbarName: 'Signature Upload',
          icon: Publish
        },
        {
          path: '/certificate/signatureList',
          sidebarName: 'Signature List',
          navbarName: 'Signature List',
          icon: PlaylistAddCheck
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Developer Tools',
      navbarName: 'Developer Tools',
      icon: CheckBox,
      content: [
        {
          path: '/crashreport',
          sidebarName: 'Crash report',
          navbarName: 'Crash report',
          icon: Dashboard
        },
        {
          path: '/integrationtestreport',
          sidebarName: 'IntegrationTest report',
          navbarName: 'IntegrationTest report',
          icon: Dashboard
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'LMS',
      icon: VideoLibrary,
      content: [
        {
          path: '/video/upload/',
          sidebarName: 'Upload Video',
          icon: VideoLibrary
        },
        {
          path: '/video/view/',
          sidebarName: 'View Video',
          icon: VideoLibrary
        }
      ]
    },
    {
      path: '/feedback/view',
      sidebarName: 'Feedback',
      icon: Feedback
    },
    {
      path: '/grievance/view',
      sidebarName: 'Grievance',
      icon: Visibility
    },
    {
      path: '#',
      sidebarName: 'Feeds',
      icon: RssFeed,
      content: [
        {
          path: '/feeds/upload',
          sidebarName: 'Upload feed',
          icon: RssFeed
        },
        {
          path: '/feeds/view',
          sidebarName: 'View feed',
          icon: RssFeed
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Gradebook',
      icon: ImportContacts,
      content: [
        {
          path: '/gradebook',
          sidebarName: 'Gradebook Details',
          icon: ImportContacts
        }, {
          path: '/gradebook/reports',
          sidebarName: 'Gradebook Reports',
          icon: Assignment

        }, {
          path: '/gradebook/marksxls',
          sidebarName: 'GradeBook Bulk Download',
          icon: CloudDownload
        }, {
          path: '/gradebook/evaluationcriteria/view',
          sidebarName: 'Gradebook Evaluation Criteria',
          icon: Assignment

        },
        {
          path: '/gradebook/analytics/view',
          sidebarName: 'Gradebook Analytics',
          navbarName: 'Gradebook Analytics',
          icon: PollRounded
        }

      ]
    },
    // {
    //   path: '/communication',
    //   sidebarName: 'Communication',
    //   navbarName: 'Communication',
    //   icon: MessageSharp
    // },
    {
      path: '/academic/questioncount',
      sidebarName: 'Question Count',
      navbarName: 'Question Count',
      icon: Create
    },
    // {
    //   path: '/communication',
    //   sidebarName: 'Communication',
    //   navbarName: 'Communication',
    //   icon: MessageSharp
    // }
    {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/add_new',
          sidebarName: 'Add Class',
          icon: AddCircle
        },
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        },
        {
          path: '/onlineclass/branchwisexls',
          sidebarName: 'Excel Download',
          icon: ArrowDownwardIcon
        },
        {
          path: '/online_class/create/group',
          sidebarName: 'Group Guest Students',
          icon: Group
        },
        {
          path: '/class/group',
          sidebarName: 'Class Group Details',
          icon: GroupIcon
        },
        {
          path: '/classGroup/list',
          sidebarName: 'List Class Group ',
          navbarName: 'List Class Group',
          icon: LibraryAdd
        },
        {
          path: '/class/interest',
          sidebarName: 'Class Statistics',
          navbarName: 'Class Statistics',
          icon: PollRounded
        }
      ]
    },
    {
      path: '/zoomusers/view',
      sidebarName: 'Zoom Users',
      navbarName: 'Zoom Users',
      icon: PeopleOutline
    }, {
      path: '#',
      sidebarName: 'Academic Promotions',
      icon: School,
      content: [
        {
          path: '/student/promotions/academic',
          sidebarName: 'Initiate',
          icon: CreateIcon
        },
        {
          path: '/student/promotions/academic/view',
          sidebarName: 'View Promoted',
          icon: Visibility
        }
      ]
    }, {
      path: '#',
      sidebarName: 'Blogs',
      icon: WebAsset,
      content: [
        {
          path: '/blog/view/reviewer',
          sidebarName: 'View Blogs',
          icon: Visibility
        }
      ]
    },
    {
      path: '/student/guest',
      sidebarName: 'Guest Student',
      icon: Face

    },
    {
      path: '#',
      sidebarName: 'Discussion Forum',
      icon: WebAsset,
      content: [
        { path: '#',
          sidebarName: 'Admin',
          icon: Face,
          content: [
            {
              path: '/discussion-form_add_Category',
              sidebarName: 'Add Category',
              icon: Add
            },
            {
              path: '/discussion-form_add_Sub_Category',
              sidebarName: 'Add Sub Category',
              icon: Add
            },
            {
              path: '/discussion-form_add_Sub_Sub_Category',
              sidebarName: 'Add Sub Sub Category',
              icon: Add
            }
          ] },
        // { path: '#',
        //  sidebarName: 'Super Admin',
        //   icon: Group,
        //  content: [

        // ] },
        // { path: '#',
        //  sidebarName: 'Moderator',
        //  icon: Announcement,
        //  content: [
        //   {
        //      path: '/discussion-form_edit_Post',
        //      sidebarName: 'Edit And View Post',
        //     icon: Edit
        //    }
        //  ] },
        {
          path: '/discussion-form_user_access_view',
          sidebarName: 'User Access View',
          icon: Add
        },
        {
          path: '/discussion_dashboard',
          sidebarName: 'Discussion Dashboard',
          icon: WebAsset
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Ebook',
      icon: ImportContacts,
      content: [
        {
          path: '/ebook/upload',
          sidebarName: 'Upload Ebook',
          icon: CloudUpload
        },
        {
          path: '/ebook/view',
          sidebarName: 'View Ebook',
          icon: Visibility
        }

      ]
    },
    {
      path: '#',
      sidebarName: 'Quiz Stats',
      icon: Equalizer,
      content: [
        {
          path: '/quiz/stats',
          sidebarName: 'Quiz Stats',
          icon: Equalizer
        }
      ]
    }

  ],
  AOLAdmin: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    {
      path: '/student/guest',
      sidebarName: 'Guest Student',
      icon: Face
    },
    {
      path: '#',
      sidebarName: 'Reports',
      icon: CloudDownload,
      content: [
        {
          path: '/engagement/report',
          sidebarName: 'Engagement Report',
          icon: CloudDownload
        },

        {
          path: '/participant/report',
          sidebarName: 'participant Report',
          icon: ArrowDownwardIcon
        }
      ] },
    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },
    {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/add_new',
          sidebarName: 'Add Class',
          icon: AddCircle
        },
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        },
        {
          path: '/onlineclass/branchwisexls',
          sidebarName: 'Excel Download',
          icon: ArrowDownwardIcon
        },
        {
          path: '/online_class/create/group',
          sidebarName: 'Group Guest Students',
          icon: Group
        },
        {
          path: '/class/group',
          sidebarName: 'Class Group Details',
          icon: GroupIcon
        },
        {
          path: '/classGroup/list',
          sidebarName: 'List Class Group ',
          navbarName: 'List Class Group',
          icon: LibraryAdd
        },
        {
          path: '/class/interest',
          sidebarName: 'Class Statistics',
          navbarName: 'Class Statistics',
          icon: PollRounded
        },
        {
          path: '/bulkClass/create',
          sidebarName: 'Bulk Class Creation',
          navbarName: 'Bulk Class Creation',
          icon: AddCircle
        }

      ]
    }

  ],
  AcademicCoordinator: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    {
      path: '/homework/dashboard',
      sidebarName: 'Homework Dashboard',
      navbarName: 'Homework Dashboard',
      icon: Assignment
    },
    {
      path: '/game',
      sidebarName: 'Game',
      navbarName: 'Game',
      icon: SportsEsportsIcon
    },
    {
      path: '#',
      sidebarName: 'Discussion Forum',
      icon: ForumIcon,
      content: [
        {
          path: '/discussion_dashboard',
          sidebarName: 'Discussion Dashboard',
          icon: WebAsset
        },
        {
          path: '/discussionForm',
          sidebarName: 'Discussion Forum',
          navbarName: 'Discussion Forum',
          icon: Dashboard
        }
      ] },
    {
      path: '#',
      sidebarName: 'Masters',
      navbarName: 'Masters',
      icon: People,
      content: [
        {
          path: '/staff',
          sidebarName: 'Staff',
          navbarName: 'Staff',
          icon: SupervisorAccount
        },
        {
          path: '/student',
          sidebarName: 'Students',
          navbarName: 'Students',
          icon: Face
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Master Management',
    //   navbarName: 'Master Management',
    //   icon: Settings ,
    //   content: [
    //     {
    //       path: '#',
    //       sidebarName: 'Manage Subjects',
    //       navbarName: 'Manage Subjects',
    //       icon: LibraryBooks ,
    //       content: [
    //         {
    //           path: '/subject',
    //           sidebarName: 'Subject',
    //           navbarName: 'Subject'
    //         },
    //         {
    //           path: '/subjectMapping',
    //           sidebarName: 'Subject Mapping',
    //           navbarName: 'Subject Mapping'
    //         }
    //       ]
    //     },
    //     {
    //       path: '#',
    //       sidebarName: 'Manage Grades',
    //       navbarName: 'Manage Grades',
    //       icon: TextRotateVertical ,
    //       content: [
    //         {
    //           path: '/grade',
    //           sidebarName: 'Grade',
    //           navbarName: 'Grade'
    //         },
    //         {
    //           path: '/gradeMapping',
    //           sidebarName: 'Grade Mapping',
    //           navbarName: 'Grade Mapping'
    //         }
    //       ]
    //     },
    //     {
    //       path: '#',
    //       sidebarName: 'Manage Sections',
    //       navbarName: 'Manage Sections',
    //       icon: VerticalSplit ,
    //       content: [
    //         {
    //           path: '/section',
    //           sidebarName: 'Section',
    //           navbarName: 'Section'
    //         },
    //         {
    //           path: '/sectionMapping',
    //           sidebarName: 'Section Mapping',
    //           navbarName: 'Section Mapping'
    //         }
    //       ]
    //     },
    //     // {
    //     //   path: '/classGroup',
    //     //   sidebarName: 'Class Group',
    //     //   navbarName: 'Class Group',
    //     //   icon: Group
    //     // },
    //     {
    //       path: '/gradeCategory',
    //       sidebarName: 'Grade Category',
    //       navbarName: 'Grade Category',
    //       icon: TableChart
    //     }
    //     // {
    //     //   path: '/vacation',
    //     //   sidebarName: 'Vacation',
    //     //   navbarName: 'Vacation',
    //     //   icon: GolfCourse
    //     // },
    //     // {
    //     //   path: '/vacationType',
    //     //   sidebarName: 'Vacation Type',
    //     //   navbarName: 'Vacation Type',
    //     //   icon: GolfCourse
    //     // },
    //     // {
    //     //   path: '/period',
    //     //   sidebarName: 'Period',
    //     //   navbarName: 'Period',
    //     //   icon: HorizontalSplit
    //     // },
    //   ]
    // },
    // {
    //   path: '/certificate',
    //   sidebarName: 'Certificate',
    //   navbarName: 'Give Certificate',
    //   icon: PostAdd
    // },
    {
      path: '#',
      sidebarName: 'Reports',
      icon: FileCopy,
      content: [
        {
          path: '/teacher-report/add',
          sidebarName: 'Daily Report',
          navbarName: 'Daily Report',
          icon: Add
        }
      ]
    },
    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    {
      path: '/reviews',
      sidebarName: 'Student Reviews',
      navbarName: 'Student Reviews',
      icon: Feedback
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },
    {
      path: '#',
      sidebarName: 'Teacher Management',
      icon: School,
      content: [
        {
          path: '/assignSubjectTeacher',
          sidebarName: 'Assign Subject Teacher',
          navbarName: 'Assign Subject Teacher'
        },

        {
          path: '/teacher-report/view',
          sidebarName: 'Teacher Report',
          navbarName: 'Teacher Report'
        },
        {
          path: '/teacher-lagging-report',
          sidebarName: 'Teacher Lagging Report',
          navbarName: 'Teacher Lagging Report'
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Uniform Size',
    //   navbarName: 'Uniform Size',
    //   icon: FormatListNumbered,
    //   content: [
    //     {
    //       path: '/store/bulkUniform',
    //       sidebarName: 'Bulk Uniform Upload',
    //       navbarName: 'Bulk Uniform Upload',
    //       icon: LibraryBooks
    //     },
    //     {
    //       path: '/store/bulkUniformVedio',
    //       sidebarName: 'Uniform Video',
    //       navbarName: 'Uniform Video',
    //       icon: VideoLibrary
    //     },
    //     {
    //       path: '/store/uniformChart',
    //       sidebarName: 'View Uniform Chart',
    //       navbarName: 'View Uniform Chart',
    //       icon: FormatListNumbered
    //     }
    //   ]
    // },
    // {
    //   path: '#',
    //   sidebarName: 'SMS',
    //   navbarName: 'SMS',
    //   icon: Drafts ,
    //   content: [
    //     {
    //       path: '/sms/',
    //       sidebarName: 'Send SMS',
    //       navbarName: 'Send SMS',
    //       icon: Message
    //     },
    //     {
    //       path: '/sms/addSMSCredits/',
    //       sidebarName: 'SMS Credits',
    //       navbarName: 'SMS Credits',
    //       icon: Chat
    //     }
    //   ]
    // },
    {
      path: '#',
      sidebarName: 'Attendance',
      icon: CheckCircle,
      content: [
        {
          path: '/attendance',
          sidebarName: 'Take Attendance',
          icon: CalendarToday
        },
        {
          path: '/attendance/view',
          sidebarName: 'View Attendance',
          icon: CalendarViewDay
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'ID Card',
      navbarName: 'IDCard',
      icon: People,
      content: [
        {
          path: '/staffIdCard',
          sidebarName: 'Staff ID Card',
          navbarName: 'Staff ID Card',
          icon: People
        },
        {
          path: '/studentIdCard/0',
          sidebarName: 'Student ID Card',
          navbarName: 'Student ID card',
          icon: People
        }
      ]
    },
    {
      path: '/calendar',
      sidebarName: 'Calendar',
      navbarName: 'Calendar',
      icon: CalendarToday
    },
    {
      path: '/timetable',
      sidebarName: 'Time Table',
      navbarName: 'Time Table',
      icon: Timeline
    },
    {
      path: '#',
      sidebarName: 'Circular',
      icon: BlurCircular,
      content: [
        {
          path: '/v2/circular',
          sidebarName: 'Upload Circular',
          navbarName: 'Upload Circular',
          icon: CloudUpload
        },
        {
          path: '/v2/circular/view',
          sidebarName: 'View Circular',
          navbarName: 'View Circular',
          icon: Visibility
        },
        {
          path: '/v2/circular/template/view',
          sidebarName: 'View Circular Template',
          navbarName: 'View Circular Template',
          icon: Visibility
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Gradebook',
      icon: ImportContacts,
      content: [
        {
          path: '/gradebook',
          sidebarName: 'Gradebook Details',
          icon: ImportContacts
        }, {
          path: '/gradebook/reports',
          sidebarName: 'Gradebook Reports',
          icon: Assignment

        }

      ]
    }, {
      path: '/grievance/view',
      sidebarName: 'Grievance',
      icon: Visibility
    },
    {
      path: '#',
      sidebarName: 'Blogs',
      icon: WebAsset,
      content: [
        {
          path: '/blog/view/reviewer',
          sidebarName: 'View Blogs',
          icon: Visibility
        }
      ]
    },
    {
      path: '/meal',
      sidebarName: 'Meal',
      navbarName: 'Meal',
      icon: Fastfood
    },
    // {
    //   path: '/communication',
    //   sidebarName: 'Communication',
    //   navbarName: 'Communication',
    //   icon: MessageSharp
    // },
    {
      path: 'academic/questioncount',
      sidebarName: 'Question Count',
      navbarName: 'Question Count',
      icon: Create
    },
    {
      path: '/generalDiary',
      sidebarName: 'General Diary',
      icon: ListAlt
    },
    {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/add_new',
          sidebarName: 'Add Class',
          icon: AddCircle
        },
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        },
        {
          path: '/onlineclass/branchwisexls',
          sidebarName: 'Excel Download',
          icon: ArrowDownwardIcon
        }
      ]
    },
    // {
    //   path: '/communication',
    //   sidebarName: 'Communication',
    //   navbarName: 'Communication',
    //   icon: MessageSharp
    // }
    // {
    //   path: '#',
    //   sidebarName: 'Message',
    //   icon: Message ,
    //   content: [
    //     {
    //       path: '/message',
    //       sidebarName: 'Upload Message',
    //       navbarName: 'Upload Message',
    //       icon: CloudUpload
    //     },
    //     {
    //       path: '/message/view',
    //       sidebarName: 'View Message',
    //       navbarName: 'View Message',
    //       icon: Visibility
    //     }
    //   ]
    // }
    // {
    //   path: '/generalDiary',
    //   sidebarName: 'General Diary',
    //   icon: ListAlt
    // }
    // {
    //   path: '/feedback/view',
    //   sidebarName: 'Feedback',
    //   icon: Feedback
    // },

    {
      path: '#',
      sidebarName: 'Academic Promotions',
      icon: School,
      content: [
        {
          path: '/student/promotions/academic',
          sidebarName: 'Initiate',
          icon: CreateIcon
        },
        {
          path: '/student/promotions/academic/view',
          sidebarName: 'View Promoted',
          icon: Visibility
        }
      ]
    },
    {
      path: '/ebook/view',
      sidebarName: 'View Ebook',
      icon: Visibility
    }
  ],
  Parent: [],
  Subjecthead: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },

    {
      path: '/homework/dashboard',
      sidebarName: 'Homework Dashboard',
      navbarName: 'Homework Dashboard',
      icon: Assignment
    },
    {
      path: '/game',
      sidebarName: 'Game',
      navbarName: 'Game',
      icon: SportsEsportsIcon
    },
    {
      path: '#',
      sidebarName: 'Reports',
      icon: Drafts,
      content: [
        {
          path: '/teacher-report/view',
          icon: Receipt,
          sidebarName: 'Teacher Report',
          navbarName: 'Teacher Report'
        },
        {
          path: '/teacher-list',
          sidebarName: 'Teacher List',
          navbarName: 'Teacher List',
          icon: Description
        },
        {
          path: '/lessonplan',
          sidebarName: 'Lesson Plan',
          navbarName: 'Lesson Plan',
          icon: Description
        },
        {
          path: '/microschedule',
          icon: Receipt,
          sidebarName: 'Micro Schedule',
          navbarName: 'Micro Schedule'
        },
        {
          path: '/questbox/upload_result_excel',
          sidebarName: 'Upload Result',
          navbarName: 'Upload Result',
          icon: SettingsOverscan
        }
      ]
    },
    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    {
      path: '/reviews',
      sidebarName: 'Student Reviews',
      navbarName: 'Student Reviews',
      icon: Feedback
    },
    {
      path: '/files',
      sidebarName: 'Files',
      navbarName: 'Files',
      icon: Folder
    },
    {
      path: '#',
      sidebarName: 'Chapters',
      navbarName: 'Chapters',
      icon: Class,
      content: [
        {
          path: '/questbox/addchapter',
          sidebarName: 'Add Chapter',
          navbarName: 'Add Chapter',
          icon: Add
        },
        {
          path: '/questbox/viewchapter',
          sidebarName: 'View Chapter',
          navbarName: 'View Chapter',
          icon: RemoveRedEye
        }
      ]
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },
    {
      path: '#',
      sidebarName: 'Questbox',
      icon: QuestionAnswer,
      content: [
        {
          path: '#',
          sidebarName: 'Questions',
          navbarName: 'Questions',
          icon: Subject,
          content: [
            {
              path: '/questbox/addquestion',
              sidebarName: 'Create Question',
              navbarName: 'Create Question',
              icon: Create
            },
            {
              path: '/questbox/listquestion',
              sidebarName: 'List Question',
              navbarName: 'List Question',
              icon: FlipToFront
            },
            {
              path: '/questbox/list_comprehension_question',
              sidebarName: 'List Comprehension Question',
              navbarName: 'List Comprehension Question',
              icon: FlipToBack
            },
            {
              path: '/questbox/questions/view/reported_questions',
              sidebarName: 'View Reported Questions',
              navbarName: 'View Reported Questions',
              icon: Visibility
            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Question Paper',
          navbarName: 'Questions',
          icon: ImportContacts,
          content: [
            {
              path: '/questbox/createquestionpaper',
              sidebarName: 'Create Question Paper',
              navbarName: 'Create Question Paper',
              icon: BorderColor
            },
            {
              path: '/questbox/questionpaper',
              sidebarName: 'View Question Paper',
              navbarName: 'View Question Paper',
              icon: Toll
            },
            {
              path: '/questbox/add',
              sidebarName: 'Add Question paper Type and Sub Type',
              navbarName: 'Add Question paper Type and Sub Type',
              icon: Map
            },
            {
              path: '/questbox/view',
              sidebarName: 'View Question paper Type and Sub Type',
              navbarName: 'View Question paper Type and Sub Type',
              icon: Map
            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Tests',
          navbarName: 'Tests',
          icon: CheckBox,
          content: [
            {
              path: '/questbox/createTest',
              sidebarName: 'Create Test',
              navbarName: 'Create Test',
              icon: Create
            },
            {
              path: '/questbox/viewTests',
              sidebarName: 'View Tests',
              navbarName: 'View Tests',
              icon: FormatListNumbered
            }
          ]
        }
      ]
    },
    // {
    //   path: '/certificate',
    //   sidebarName: 'Certificate',
    //   navbarName: 'Give Certificate',
    //   icon: PostAdd
    // },
    {
      path: '#',
      sidebarName: 'Assessment',
      navbarName: 'Assessment',
      icon: Assessment,
      content: [
        {
          path: '/questbox/create_assessment',
          sidebarName: 'Create Assessment',
          navbarName: 'Create Assessment',
          icon: Edit
        },
        {
          path: '/questbox/assessment/view',
          sidebarName: 'View Assessment',
          navbarName: 'View Assessment',
          icon: TurnedIn
        },
        {
          path: '/questbox/configuration',
          sidebarName: 'Configuration Mappings',
          navbarName: 'Configuration Mappings',
          icon: Map
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'LMS',
      icon: VideoLibrary,
      content: [
        {
          path: '/video/upload/',
          sidebarName: 'Upload Video',
          icon: VideoLibrary
        },
        {
          path: '/video/view/',
          sidebarName: 'View Video',
          icon: VideoLibrary
        }
      ]
    },
    {
      path: '/feedback/view',
      sidebarName: 'Feedback',
      icon: Feedback
    },
    {
      path: '/grievance/view',
      sidebarName: 'Grievance',
      icon: Visibility
    },
    {
      path: '#',
      sidebarName: 'Feeds',
      icon: RssFeed,
      content: [
        {
          path: '/feeds/upload',
          sidebarName: 'Upload feed',
          icon: RssFeed
        },
        {
          path: '/feeds/view',
          sidebarName: 'View feed',
          icon: RssFeed
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Ebook',
      icon: ImportContacts,
      content: [
        {
          path: '/ebook/upload',
          sidebarName: 'Upload Ebook',
          icon: CloudUpload
        },
        {
          path: '/ebook/view',
          sidebarName: 'View Ebook',
          icon: Visibility
        }
        // ,
        // {
        //   path: '/ebook/custom',
        //   sidebarName: 'Ebook Pdf',
        //   icon: Visibility
        // }
      ]
    },
    {
      path: '#',
      sidebarName: 'Gradebook',
      icon: ImportContacts,
      content: [
        {
          path: '/gradebook',
          sidebarName: 'Gradebook Details',
          icon: ImportContacts
        }, {
          path: '/gradebook/reports',
          sidebarName: 'Gradebook Reports',
          icon: Assignment

        }, {
          path: '/gradebookdownload',
          sidebarName: 'GradeBook Bulk Download',
          icon: CloudDownload
        }, {
          path: '/gradebook/evaluationcriteria/view',
          sidebarName: 'Gradebook Evaluation Criteria',
          icon: Assignment

        }

      ]
    },
    {
      path: '#',
      sidebarName: 'Practice Questions',
      icon: Toc,
      content: [
        {
          path: '/questbox/PracticeQuestions/view_analysis',
          sidebarName: 'Analytics',
          navbarName: 'Analytics',
          icon: PollRounded
        }
      ]
    },
    {
      path: 'academic/questioncount',
      sidebarName: 'Question Count',
      navbarName: 'Question Count',
      icon: Create
    },
    {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Blogs',
      icon: WebAsset,
      content: [
        {
          path: '/blog/view/reviewer',
          sidebarName: 'View Blogs',
          icon: Visibility
        }
      ]
    },
    {
      path: '/questbox/uploadQuestionExcel',
      sidebarName: 'Upload Question from Excel',
      navbarName: 'Upload Question from Excel',
      icon: Shop
    }
  ],
  Student: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },

    {
      path: '/discussionForm',
      sidebarName: 'Discussion Forum',
      navbarName: 'Discussion Forum',
      icon: ForumIcon
    },
    // discussionFormFeature(),
    {
      path: '/student_report',
      sidebarName: 'Daily Diary',
      navbarName: 'Daily Diary',
      icon: FileCopy
    },
    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    {
      path: '/student_submission',
      sidebarName: 'Homework Submissions',
      navbarName: 'Homework Submissions',
      icon: LocalLibrary
    },
    {
      path: '/student_calendar',
      sidebarName: 'Calendar',
      navbarName: 'Calendar',
      icon: Receipt
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },
    {
      path: window.isMobile ? 'dailyDairy/timetable' : '/student_timetable',
      sidebarName: 'Time Table',
      navbarName: 'Time Table',
      icon: CalendarToday
    },
    {
      path: '#',
      sidebarName: 'Tests',
      icon: CheckBox,
      content: [
        {
          path: '/student_test/online',
          sidebarName: 'Online test',
          navbarName: 'Tests',
          icon: CheckBox
        },
        {
          path: '/student_test/practice',
          sidebarName: 'Practice test',
          navbarName: '',
          icon: CheckBox
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Practice Questions',
    //   icon: Toc,
    //   content: [
    //     {
    //       // path: '/questbox/PracticeQuestions',
    //       path: '/questbox/questions/practice/',
    //       sidebarName: 'Practice Questions',
    //       navbarName: 'Practice Questions',
    //       icon: TableChart
    //     },
    //     {
    //       path: '/practice_question_dashboard',
    //       sidebarName: 'Summary',
    //       navbarName: 'Summary',
    //       icon: TableChart
    //     }
    //   ]
    // },
    {
      path: '/questbox/questions/practice/',
      sidebarName: 'Practice Questions',
      navbarName: 'Practice Questions',
      icon: TableChart
    },
    {
      path: '/generalDiary',
      sidebarName: 'General Diary',
      icon: ListAlt
    },
    {
      path: '/questbox/onlineClass',
      sidebarName: 'Online Class ',
      icon: Class
    },
    // {
    //   path: '/message/view',
    //   sidebarName: 'Message',
    //   navbarName: 'View Message',
    //   icon: Drafts
    // },
    {
      path: '/report',
      sidebarName: 'Results',
      navbarName: 'Results',
      icon: Announcement
    },
    {
      path: '/remarks',
      sidebarName: 'Remarks',
      navbarName: 'Remarks',
      icon: Pages
    },
    {
      path: '/v2/circular/view',
      sidebarName: 'Circular',
      navbarName: 'View Circular',
      icon: BlurCircular
    },
    {
      path: '/ViewCertificate',
      sidebarName: 'Achievemets',
      navbarName: 'Certificate',
      icon: PostAdd
    },
    {
      path: '/attendance/view',
      sidebarName: ' Attendance',
      navbarName: 'View Attendance',
      icon: CalendarViewDay
    },
    {
      path: '/gradebook/student/report',
      sidebarName: 'Report Card',
      navbarName: 'Report Card',
      icon: PermMedia
    },
    {
      path: '/grievance',
      sidebarName: 'Grievance',
      navbarName: 'Grievance',
      icon: Visibility
    },
    {
      path: '/meal',
      sidebarName: 'Meal',
      navbarName: 'Meal',
      icon: Fastfood
    },
    {
      path: '/store/studentUniform',
      sidebarName: 'Uniform Size',
      navbarName: 'Uniform Size',
      icon: Payment
    },
    // Do not Delete This
    // ...studentRoutesFinance(),
    {
      path: '#',
      sidebarName: 'Finance',
      icon: Toc,
      content: [
        {
          path: '/finance/manage_payment',
          sidebarName: 'Manage Payment',
          navbarName: 'Manage Payment',
          icon: Functions
        },
        {
          path: '/finance/fee_structure',
          sidebarName: 'Fee Structure',
          navbarName: 'Fee Structure',
          icon: AttachMoney
        },
        ...studentRoutesFinance(),
        // {
        //   path: '/finance/student_store',
        //   sidebarName: 'Books & Uniform',
        //   navbarName: 'Books & Uniform',
        //   icon: Store
        // },
        {
          path: '/store/shippingamount',
          sidebarName: 'Shipping Payment',
          navbarName: 'Shipping Payment',
          icon: Drafts
        },
        {
          path: '/finance/studentWallets',
          sidebarName: 'Student Wallet',
          navbarName: 'Student Wallet',
          icon: AccountBalanceWalletIcon
        }
      ]
    },
    {
      path: '/video/view/',
      sidebarName: 'LMS',
      icon: VideoLibrary
    },
    {
      path: '/feedback',
      sidebarName: 'Feedback',
      navbarName: 'Feedback',
      icon: Feedback
    },
    {
      path: '/feeds/view',
      sidebarName: 'Feeds',
      icon: RssFeed
    },
    {
      path: '/ebook/view',
      sidebarName: 'View Ebook',
      icon: Visibility
    },
    // {
    //   path: '/communication',
    //   sidebarName: 'Communication',
    //   navbarName: 'Communication',
    //   icon: MessageSharp
    // },
    {
      path: '/sms/smsReceived',
      sidebarName: 'SMS Received',
      navbarName: 'SMS Received',
      icon: Drafts
    },
    {
      path: '#',
      sidebarName: 'Blogs',
      icon: WebAsset,
      content: [
        {
          path: '/blog/write',
          sidebarName: 'Write a Blog',
          navbarName: 'Write a Blog',
          icon: CreateIcon
        },
        {
          path: '/blog/view/student',
          sidebarName: 'View Blogs',
          navbarName: 'View Blogs',
          icon: Visibility
        }
      ]
    },

    getJournals()
  ],
  Planner: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    {
      path: '/homework/dashboard',
      sidebarName: 'Homework Dashboard',
      navbarName: 'Homework Dashboard',
      icon: Assignment
    },
    {
      path: '/game',
      sidebarName: 'Game',
      navbarName: 'Game',
      icon: SportsEsportsIcon
    },
    {
      path: '#',
      sidebarName: 'Reports',
      icon: Drafts,
      content: [
        {
          path: '/teacher-report/view',
          icon: Receipt,
          sidebarName: 'Teacher Report',
          navbarName: 'Teacher Report'
        },
        {
          path: '/lessonplan',
          sidebarName: 'Lesson Plan',
          navbarName: 'Lesson Plan',
          icon: Description
        },
        {
          path: '/microschedule',
          icon: Receipt,
          sidebarName: 'Micro Schedule',
          navbarName: 'Micro Schedule'
        },
        {
          path: '/teacher-list',
          icon: Description,
          sidebarName: 'Teacher List',
          navbarName: 'Teacher List'
        }
      ]
    },
    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    {
      path: '/reviews',
      sidebarName: 'Student Reviews',
      navbarName: 'Student Reviews',
      icon: Feedback
    },
    {
      path: '#',
      sidebarName: 'Questbox',
      icon: QuestionAnswer,
      content: [
        {
          path: '#',
          sidebarName: 'Chapters',
          navbarName: 'Chapters',
          icon: Class,
          content: [
            // {
            //   path: '/questbox/addchapter',
            //   sidebarName: 'Add Chapter',
            //   navbarName: 'Add Chapter',
            //   icon: Add
            // },
            {
              path: '/questbox/viewchapter',
              sidebarName: 'View Chapter',
              navbarName: 'View Chapter',
              icon: RemoveRedEye
            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Questions',
          navbarName: 'Questions',
          icon: Subject,
          content: [
            {
              path: '/questbox/addquestion',
              sidebarName: 'Create Question',
              navbarName: 'Create Question',
              icon: Create
            },
            {
              path: '/questbox/listquestion',
              sidebarName: 'List Question',
              navbarName: 'List Question',
              icon: FlipToFront
            },
            {
              path: '/questbox/list_comprehension_question',
              sidebarName: 'List Comprehension Question',
              navbarName: 'List Comprehension Question',
              icon: FlipToBack
            },
            {
              path: '/questbox/questions/view/reported_questions',
              sidebarName: 'View Reported Questions',
              navbarName: 'View Reported Questions',
              icon: Visibility
            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Question Paper',
          navbarName: 'Questions',
          icon: ImportContacts,
          content: [
            {
              path: '/questbox/createquestionpaper',
              sidebarName: 'Create Question Paper',
              navbarName: 'Create Question Paper',
              icon: BorderColor
            },
            {
              path: '/questbox/questionpaper',
              sidebarName: 'View Question Paper',
              navbarName: 'View Question Paper',
              icon: Toll
            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Tests',
          navbarName: 'Tests',
          icon: CheckBox,
          content: [
            {
              path: '/questbox/createTest',
              sidebarName: 'Create Test',
              navbarName: 'Create Test',
              icon: Create
            },
            {
              path: '/questbox/viewTests',
              sidebarName: 'View Tests',
              navbarName: 'View Tests',
              icon: FormatListNumbered
            }
          ]
        },
        {
          path: '#',
          sidebarName: 'Assessment',
          navbarName: 'Assessment',
          icon: Assessment,
          content: [
            {
              path: '/questbox/create_assessment',
              sidebarName: 'Create Assessment',
              navbarName: 'Create Assessment',
              icon: Edit
            },
            {
              path: '/questbox/assessment/view',
              sidebarName: 'View Assessment',
              navbarName: 'View Assessment',
              icon: TurnedIn
            }
          ]
        }
      ]
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },
    {
      path: '#',
      sidebarName: 'Practice Questions',
      icon: Toc,
      content: [
        {
          path: '/questbox/PracticeQuestions/view_analysis',
          sidebarName: 'Analytics',
          navbarName: 'Analytics',
          icon: PollRounded
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'LMS',
      icon: VideoLibrary,
      content: [
        {
          path: '/video/upload/',
          sidebarName: 'Upload Video',
          icon: VideoLibrary
        },
        {
          path: '/video/view/',
          sidebarName: 'View Video',
          icon: VideoLibrary
        }
      ]
    },
    // {
    //   path: '/certificate',
    //   sidebarName: 'Certificate',
    //   navbarName: 'Give Certificate',
    //   icon: PostAdd
    // },
    {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        }
      ]
    }, {
      path: '#',
      sidebarName: 'Blogs',
      icon: WebAsset,
      content: [
        {
          path: '/blog/view/reviewer',
          sidebarName: 'View Blogs',
          icon: Visibility
        }
      ]
    },
    {
      path: '/ebook/view',
      sidebarName: 'View Ebook',
      icon: Visibility
    },
    {
      path: '/questbox/uploadQuestionExcel',
      sidebarName: 'Upload Question from Excel',
      navbarName: 'Upload Question from Excel',
      icon: Shop
    }
  ],
  Reviewer: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    {
      path: '#',
      sidebarName: 'Reports',
      icon: Drafts,
      content: [
        {
          path: '/teacher-report/view',
          icon: Receipt,
          sidebarName: 'Teacher Report',
          navbarName: 'Teacher Report'
        },
        {
          path: '/lessonplan',
          sidebarName: 'Lesson Plan',
          navbarName: 'Lesson Plan',
          icon: Description
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Chapters',
      navbarName: 'Chapters',
      icon: Class,
      content: [
        // {
        //   path: '/questbox/addchapter',
        //   sidebarName: 'Add Chapter',
        //   navbarName: 'Add Chapter',
        //   icon: Add
        // },
        {
          path: '/questbox/viewchapter',
          sidebarName: 'View Chapter',
          navbarName: 'View Chapter',
          icon: RemoveRedEye
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Questions',
      navbarName: 'Questions',
      icon: Subject,
      content: [
        {
          path: '/questbox/addquestion',
          sidebarName: 'Create Question',
          navbarName: 'Create Question',
          icon: Create
        },
        {
          path: '/questbox/listquestion',
          sidebarName: 'List Question',
          navbarName: 'List Question',
          icon: FlipToFront
        },
        {
          path: '/questbox/list_comprehension_question',
          sidebarName: 'List Comprehension Question',
          navbarName: 'List Comprehension Question',
          icon: FlipToBack
        },
        {
          path: '/questbox/questions/view/reported_questions',
          sidebarName: 'View Reported Questions',
          navbarName: 'View Reported Questions',
          icon: Visibility
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Question Paper',
      navbarName: 'Questions',
      icon: ImportContacts,
      content: [
        {
          path: '/questbox/createquestionpaper',
          sidebarName: 'Create Question Paper',
          navbarName: 'Create Question Paper',
          icon: BorderColor
        },
        {
          path: '/questbox/questionpaper',
          sidebarName: 'View Question Paper',
          navbarName: 'View Question Paper',
          icon: Toll
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Assessment',
      navbarName: 'Assessment',
      icon: Assessment,
      content: [
        {
          path: '/questbox/create_assessment',
          sidebarName: 'Create Assessment',
          navbarName: 'Create Assessment',
          icon: Edit
        },
        {
          path: '/questbox/assessment/view',
          sidebarName: 'View Assessment',
          navbarName: 'View Assessment',
          icon: TurnedIn
        }
      ]
    }
  ],
  Teacher: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },

    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    // {
    //   path: '/lockdown_journals/view',
    //   sidebarName: 'LockDown Journals',
    //   navbarName: 'LockDown Journals',
    //   icon: BookSharp
    // },
    {
      path: '/student',
      sidebarName: 'Students',
      navbarName: 'Students',
      icon: Face
    },
    {
      path: '/review/view',
      sidebarName: 'Student Reviews',
      navbarName: 'Student Reviews',
      icon: Feedback
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },
    {
      path: '/homework',
      sidebarName: 'Homeworks',
      navbarName: 'Homeworks',
      icon: Assignment
    },
    // {
    //   path: '/timetable',
    //   sidebarName: 'Time Table',
    //   icon: CalendarToday
    // },
    // {
    //   path: '/daily_timetable',
    //   sidebarName: 'My Time Table',
    //   icon: CalendarToday
    // },
    {
      path: '/timetable',
      sidebarName: 'Time Table',
      navbarName: 'Time Table',
      icon: Timeline
    },
    {
      path: '#',
      sidebarName: 'Discussion Forum',
      icon: ForumIcon,
      content: [
        {
          path: '/discussion_dashboard',
          sidebarName: 'Discussion Dashboard',
          icon: WebAsset
        },
        {
          path: '/discussionForm',
          sidebarName: 'Discussion Forum',
          navbarName: 'Discussion Forum',
          icon: Dashboard
        }
      ] },
    // discussionFormFeature(),
    {
      path: '#',
      sidebarName: 'Reports',
      icon: FileCopy,
      content: [
        {
          path: '/teacher-report/add',
          sidebarName: 'Daily Report',
          navbarName: 'Daily Report',
          icon: Add
        },
        {
          path: '/teacher-report/view',
          sidebarName: 'View Reports',
          navbarName: 'View Reports',
          icon: ViewHeadline
        },
        {
          path: '/lessonplan',
          sidebarName: 'Lesson Plan',
          navbarName: 'Lesson Plan',
          icon: Description
        },
        {
          path: '/microschedule',
          icon: Receipt,
          sidebarName: 'Micro Schedule',
          navbarName: 'Micro Schedule'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Chapters',
      navbarName: 'Chapters',
      icon: Class,
      content: [
        // {
        //   path: '/questbox/addchapter',
        //   sidebarName: 'Add Chapter',
        //   navbarName: 'Add Chapter',
        //   icon: Add
        // },
        {
          path: '/questbox/viewchapter',
          sidebarName: 'View Chapter',
          navbarName: 'View Chapter',
          icon: RemoveRedEye
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Questions',
      navbarName: 'Questions',
      icon: Subject,
      content: [
        {
          path: '/questbox/addquestion',
          sidebarName: 'Create Question',
          navbarName: 'Create Question',
          icon: Create
        },
        {
          path: '/questbox/listquestion',
          sidebarName: 'List Question',
          navbarName: 'List Question',
          icon: FlipToFront
        },
        {
          path: '/questbox/list_comprehension_question',
          sidebarName: 'List Comprehension Question',
          navbarName: 'List Comprehension Question',
          icon: FlipToBack
        },
        {
          path: '/questbox/questions/view/reported_questions',
          sidebarName: 'View Reported Questions',
          navbarName: 'View Reported Questions',
          icon: Visibility
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Question Paper',
      navbarName: 'Questions',
      icon: ImportContacts,
      content: [
        {
          path: '/questbox/createquestionpaper',
          sidebarName: 'Create Question Paper',
          navbarName: 'Create Question Paper',
          icon: BorderColor
        },
        {
          path: '/questbox/questionpaper',
          sidebarName: 'View Question Paper',
          navbarName: 'View Question Paper',
          icon: Toll
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Assessment',
      navbarName: 'Assessment',
      icon: Assessment,
      content: [
        {
          path: '/questbox/create_assessment',
          sidebarName: 'Create Assessment',
          navbarName: 'Create Assessment',
          icon: Edit
        },
        {
          path: '/questbox/assessment/view',
          sidebarName: 'View Assessment',
          navbarName: 'View Assessment',
          icon: TurnedIn
        },
        {
          path: '/questbox/upload_result_excel',
          sidebarName: 'Upload Result',
          navbarName: 'Upload Result',
          icon: SettingsOverscan
        }
      ]
    },
    {
      path: '/v2/circular/view',
      sidebarName: 'Circular',
      navbarName: 'View Circular',
      icon: BlurCircular
    },

    {
      path: '#',
      sidebarName: 'Practice Questions',
      icon: Toc,
      content: [
        {
          path: '/teacher_practice',
          sidebarName: 'Questions',
          navbarName: 'Questions',
          icon: Schedule
        },
        {
          path: '/practice_question_dashboard',
          sidebarName: 'Summary',
          navbarName: 'Summary',
          icon: TableChart
        },
        {
          path: '/questbox/PracticeQuestions/view_analysis',
          sidebarName: 'Analytics',
          navbarName: 'Analytics',
          icon: PollRounded
        }
      ]
    },
    {
      path: '/meal',
      sidebarName: 'Meal',
      navbarName: 'Meal',
      icon: Fastfood
    },
    {
      path: '#',
      sidebarName: 'Tests',
      navbarName: 'Tests',
      icon: CheckBox,
      content: [
        {
          path: '/questbox/createTest',
          sidebarName: 'Create Test',
          navbarName: 'Create Test',
          icon: Create
        },
        {
          path: '/questbox/viewTests',
          sidebarName: 'View Tests',
          navbarName: 'View Tests',
          icon: FormatListNumbered
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Attendance',
      icon: CheckCircle,
      content: [
        {
          path: '/attendance',
          sidebarName: 'Take Attendance',
          icon: CalendarToday
        },
        {
          path: '/attendance/view',
          sidebarName: 'View Attendance',
          icon: CalendarViewDay
        }
      ]
    },
    {
      path: '/generalDiary',
      sidebarName: 'General Diary',
      icon: ListAlt
    },
    {
      path: '/change_Password',
      sidebarName: 'Change Password',
      navbarName: 'Change Password',
      icon: Sync
    },
    {
      path: '/video/view/',
      sidebarName: 'Video',
      icon: VideoLibrary
    },
    {
      path: '#',
      sidebarName: 'Gradebook',
      icon: ImportContacts,
      content: [
        {
          path: '/gradebook',
          sidebarName: 'Gradebook Details',
          icon: ImportContacts
        }, {
          path: '/gradebook/reports',
          sidebarName: 'Gradebook Reports',
          icon: Assignment

        }

      ]
    },
    {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/view_alloted_classes',
          sidebarName: 'Class List',
          icon: Visibility
        },
        {
          path: '/onlineclass/branchwisexls',
          sidebarName: 'Excel Download',
          icon: ArrowDownwardIcon
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Blogs',
      icon: WebAsset,
      content: [
        {
          path: '/blog/view/reviewer',
          sidebarName: 'View Blogs',
          icon: Visibility
        }
      ]
    },
    {
      path: '/ebook/view',
      sidebarName: 'View Ebook',
      icon: Visibility
    },
    {
      path: '#',
      sidebarName: 'Quiz Stats',
      icon: Equalizer,
      content: [
        {
          path: '/quiz/stats',
          sidebarName: 'Quiz Stats',
          icon: Equalizer
        }
      ]
    }
  ],
  LeadTeacher: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    {
      path: '/discussionForm',
      sidebarName: 'Discussion Forum',
      navbarName: 'Discussion Forum',
      icon: Dashboard
    },
    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    {
      path: '/review/view',
      sidebarName: 'Student Reviews',
      navbarName: 'Student Reviews',
      icon: Feedback
    },
    // {
    //   path: '/timetable',
    //   sidebarName: 'Time Table',
    //   icon: CalendarToday
    // },
    // {
    //   path: '/daily_timetable',
    //   sidebarName: 'My Time Table',
    //   icon: CalendarToday
    // },
    {
      path: '/timetable',
      sidebarName: 'Time Table',
      navbarName: 'Time Table',
      icon: Timeline
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },
    {
      path: '#',
      sidebarName: 'Reports',
      icon: FileCopy,
      content: [
        {
          path: '/teacher-report/add',
          sidebarName: 'Daily Report',
          navbarName: 'Daily Report',
          icon: Add
        },
        {
          path: '/teacher-report/view',
          sidebarName: 'View Reports',
          navbarName: 'View Reports',
          icon: ViewHeadline
        },
        {
          path: '/lessonplan',
          sidebarName: 'Lesson Plan',
          navbarName: 'Lesson Plan',
          icon: Description
        },
        {
          path: '/microschedule',
          icon: Receipt,
          sidebarName: 'Micro Schedule',
          navbarName: 'Micro Schedule'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Chapters',
      navbarName: 'Chapters',
      icon: Class,
      content: [
        // {
        //   path: '/questbox/addchapter',
        //   sidebarName: 'Add Chapter',
        //   navbarName: 'Add Chapter',
        //   icon: Add
        // },
        {
          path: '/questbox/viewchapter',
          sidebarName: 'View Chapter',
          navbarName: 'View Chapter',
          icon: RemoveRedEye
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Questions',
      navbarName: 'Questions',
      icon: Subject,
      content: [
        {
          path: '/questbox/addquestion',
          sidebarName: 'Create Question',
          navbarName: 'Create Question',
          icon: Create
        },
        {
          path: '/questbox/listquestion',
          sidebarName: 'List Question',
          navbarName: 'List Question',
          icon: FlipToFront
        },
        {
          path: '/questbox/list_comprehension_question',
          sidebarName: 'List Comprehension Question',
          navbarName: 'List Comprehension Question',
          icon: FlipToBack
        },
        {
          path: '/questbox/questions/view/reported_questions',
          sidebarName: 'View Reported Questions',
          navbarName: 'View Reported Questions',
          icon: Visibility
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Question Paper',
      navbarName: 'Questions',
      icon: ImportContacts,
      content: [
        {
          path: '/questbox/createquestionpaper',
          sidebarName: 'Create Question Paper',
          navbarName: 'Create Question Paper',
          icon: BorderColor
        },
        {
          path: '/questbox/questionpaper',
          sidebarName: 'View Question Paper',
          navbarName: 'View Question Paper',
          icon: Toll
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Assessment',
      navbarName: 'Assessment',
      icon: Assessment,
      content: [
        {
          path: '/questbox/create_assessment',
          sidebarName: 'Create Assessment',
          navbarName: 'Create Assessment',
          icon: Edit
        },
        {
          path: '/questbox/assessment/view',
          sidebarName: 'View Assessment',
          navbarName: 'View Assessment',
          icon: TurnedIn
        },
        {
          path: '/questbox/upload_result_excel',
          sidebarName: 'Upload Result',
          navbarName: 'Upload Result',
          icon: SettingsOverscan
        }
      ]
    },
    {
      path: '/v2/circular/view',
      sidebarName: 'Circular',
      navbarName: 'View Circular',
      icon: BlurCircular
    },

    {
      path: '#',
      sidebarName: 'Practice Questions',
      icon: Toc,
      content: [
        {
          path: '/teacher_practice',
          sidebarName: 'Questions',
          navbarName: 'Questions',
          icon: Schedule
        },
        {
          path: '/practice_question_dashboard',
          sidebarName: 'Summary',
          navbarName: 'Summary',
          icon: TableChart
        },
        {
          path: '/questbox/PracticeQuestions/view_analysis',
          sidebarName: 'Analytics',
          navbarName: 'Analytics',
          icon: PollRounded
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Tests',
      navbarName: 'Tests',
      icon: CheckBox,
      content: [
        {
          path: '/questbox/createTest',
          sidebarName: 'Create Test',
          navbarName: 'Create Test',
          icon: Create
        },
        {
          path: '/questbox/viewTests',
          sidebarName: 'View Tests',
          navbarName: 'View Tests',
          icon: FormatListNumbered
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Attendance',
      icon: CheckCircle,
      content: [
        {
          path: '/attendance',
          sidebarName: 'Take Attendance',
          icon: CalendarToday
        },
        {
          path: '/attendance/view',
          sidebarName: 'View Attendance',
          icon: CalendarViewDay
        }
      ]
    },
    {
      path: '/generalDiary',
      sidebarName: 'General Diary',
      icon: ListAlt
    },
    {
      path: '/change_Password',
      sidebarName: 'Change Password',
      navbarName: 'Change Password',
      icon: Sync
    },
    {
      path: '/video/view/',
      sidebarName: 'Video',
      icon: VideoLibrary
    },
    {
      path: '#',
      sidebarName: 'Gradebook',
      icon: ImportContacts,
      content: [
        {
          path: '/gradebook',
          sidebarName: 'Gradebook Details',
          icon: ImportContacts
        }, {
          path: '/gradebook/reports',
          sidebarName: 'Gradebook Reports',
          icon: Assignment

        }

      ]

    }, {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/add_new',
          sidebarName: 'Add Class',
          icon: AddCircle
        },
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        }
      ]
    },
    {
      path: '/ebook/view',
      sidebarName: 'View Ebook',
      icon: Visibility
    }
  ],
  HR: [
    {
      path: '/staff',
      sidebarName: 'Staff',
      navbarName: 'Staff',
      icon: SupervisorAccount
    }
  ],
  CFO: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    }, {
      path: '#',
      sidebarName: 'Masters',
      navbarName: 'Masters',
      icon: People,
      content: [
        {
          path: '/staff',
          sidebarName: 'Staff',
          navbarName: 'Staff',
          icon: SupervisorAccount
        },
        {
          path: '/student',
          sidebarName: 'Students',
          navbarName: 'Students',
          icon: Face
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Attendance',
      icon: CheckCircle,
      content: [
        {
          path: '/attendance/view',
          sidebarName: 'View Attendance',
          icon: CalendarViewDay
        },
        {
          path: '/attendance/excelreport',
          sidebarName: 'Excel Reports ',
          icon: CloudDownload
        }
      ]
    },
    {
      path: '/v2/circular/view',
      sidebarName: 'View Circular',
      navbarName: 'View Circular',
      icon: Visibility
    }, {
      path: '/teacher-report/view',
      sidebarName: 'Teacher Report',
      navbarName: 'Teacher Report',
      icon: School
    }, {
      path: '/generalDiary',
      sidebarName: 'General Diary',
      navbarName: 'General Diary',
      icon: ListAlt
    },

    {
      path: '/grievance/view',
      sidebarName: 'Grievance',
      navbarName: 'Grievance',
      icon: Visibility
    },
    {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/add_new',
          sidebarName: 'Add Class',
          icon: AddCircle
        },
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        }
      ]
    }
  ],
  'EA Academics': [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },

    {
      path: '#',
      sidebarName: 'Masters',
      navbarName: 'Masters',
      icon: People,
      content: [
        {
          path: '/staff',
          sidebarName: 'Staff',
          navbarName: 'Staff',
          icon: SupervisorAccount
        },
        {
          path: '/student',
          sidebarName: 'Students',
          navbarName: 'Students',
          icon: Face
        }
      ]
    },
    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    {
      path: '/reviews',
      sidebarName: 'Student Reviews',
      navbarName: 'Student Reviews',
      icon: Feedback
    },
    {
      path: '#',
      sidebarName: 'Teacher Management',
      icon: School,
      content: [
        {
          path: '/assignSubjectTeacher',
          sidebarName: 'Assign Subject Teacher',
          navbarName: 'Assign Subject Teacher'
        },
        {
          path: '/teacher-report/view',
          sidebarName: 'Teacher Report',
          navbarName: 'Teacher Report'
        },
        // {
        //   path: '/teacher-lagging-report',
        //   sidebarName: 'Teacher Lagging Report',
        //   navbarName: 'Teacher Lagging Report'
        // },
        {
          path: '/teacher-list',
          sidebarName: 'Teacher List',
          navbarName: 'Teacher List'
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'SMS/Email',
      navbarName: 'SMS/Email',
      icon: Drafts,
      content: [
        {
          path: '/emailsms/',
          sidebarName: 'Send Email/SMS',
          navbarName: 'Send Email/SMS',
          icon: EmailIcon
        },
        {
          path: '/sms/log/',
          sidebarName: 'Email/SMS Logs',
          navbarName: 'Email/SMS Logs',
          icon: Message
        },
        {
          path: '/sms/addSMSCredits/',
          sidebarName: 'SMS Credits',
          navbarName: 'SMS Credits',
          icon: Chat
        },
        {
          path: '/sms/offlineSms/',
          sidebarName: 'Offline SMS',
          navbarName: 'Offline SMS',
          icon: Chat
        }
      ]
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },
    {
      path: '#',
      sidebarName: 'Attendance',
      icon: CheckCircle,
      content: [
        {
          path: '/attendance',
          sidebarName: 'Take Attendance',
          icon: CalendarToday
        },
        {
          path: '/attendance/view',
          sidebarName: 'View Attendance',
          icon: CalendarViewDay
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'ID Card',
    //   navbarName: 'IDCard',
    //   icon: People,
    //   content: [
    //     {
    //       path: '/staffIdCard/0',
    //       sidebarName: 'Staff ID Card',
    //       navbarName: 'Staff ID Card',
    //       icon: People
    //     },
    //     {
    //       path: '/studentIdCard/0',
    //       sidebarName: 'Student ID Card',
    //       navbarName: 'Student ID card',
    //       icon: People
    //     }
    //   ]
    // },
    {
      path: '/calendar',
      sidebarName: 'Calendar',
      navbarName: 'Calendar',
      icon: CalendarToday
    },
    {
      path: '/timetable',
      sidebarName: 'Time Table',
      navbarName: 'Time Table',
      icon: Timeline
    },
    {
      path: '#',
      sidebarName: 'Circular',
      icon: BlurCircular,
      content: [
        {
          path: '/v2/circular',
          sidebarName: 'Upload Circular',
          navbarName: 'Upload Circular',
          icon: CloudUpload
        },
        {
          path: '/v2/circular/view',
          sidebarName: 'View Circular',
          navbarName: 'View Circular',
          icon: Visibility
        },
        {
          path: '/v2/circular/template/view',
          sidebarName: 'View Circular Template',
          navbarName: 'View Circular Template',
          icon: Visibility
        }
      ]
    },

    // {
    //   path: '/generalDiary',
    //   sidebarName: 'General Diary',
    //   icon: ListAlt
    // },
    // {
    //   path: '/feedback/view',
    //   sidebarName: 'Feedback',
    //   icon: Feedback
    // },
    // {
    //   path: '/grievance/view',
    //   sidebarName: 'Grievance',
    //   icon: Visibility
    // },
    {
      path: '#',
      sidebarName: 'Gradebook',
      icon: ImportContacts,
      content: [
        {
          path: '/gradebook',
          sidebarName: 'Gradebook Details',
          icon: ImportContacts
        }, {
          path: '/gradebook/reports',
          sidebarName: 'Gradebook Reports',
          icon: Assignment

        }

      ]
    },
    // {
    //   path: '/certificate',
    //   sidebarName: 'Certificate',
    //   navbarName: 'Give Certificate',
    //   icon: PostAdd
    // },
    {
      path: '#',
      sidebarName: 'Uniform Size',
      navbarName: 'Uniform Size',
      icon: FormatListNumbered,
      content: [
        {
          path: '/store/bulkUniform',
          sidebarName: 'Bulk Uniform Upload',
          navbarName: 'Bulk Uniform Upload',
          icon: LibraryBooks
        },
        {
          path: '/store/bulkUniformVedio',
          sidebarName: 'Uniform Video',
          navbarName: 'Uniform Video',
          icon: VideoLibrary
        },
        {
          path: '/store/uniformChart',
          sidebarName: 'View Uniform Chart',
          navbarName: 'View Uniform Chart',
          icon: FormatListNumbered
        }
      ]
    }, {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/add_new',
          sidebarName: 'Add Class',
          icon: AddCircle
        },
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        },
        {
          path: '/onlineclass/branchwisexls',
          sidebarName: 'Excel Download',
          icon: ArrowDownwardIcon
        }
      ]
    },
    {
      path: '/ebook/view',
      sidebarName: 'View Ebook',
      icon: Visibility
    }

    // {
    //   path: '/excelReport',
    //   sidebarName: 'ConsolidationReports',
    //   navbarName: 'ExcelReports',
    //   icon: Report
    // }
    // {
    //   path: '/meal',
    //   sidebarName: 'Meal',
    //   navbarName: 'Meal',
    //   icon: Fastfood
    // },
    // {
    //   path: '#',
    //   sidebarName: 'Practice Questions',
    //   icon: Toc,
    //   content: [
    //     {
    //       path: '/questbox/PracticeQuestions/view_analysis',
    //       sidebarName: 'Analytics',
    //       navbarName: 'Analytics',
    //       icon: PollRounded
    //     }
    //   ]
    // },
    // { path: 'academic/questioncount',
    //   sidebarName: 'Question Count',
    //   navbarName: 'Question Count',
    //   icon: Create }

  ],
  Principal: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },

    // {
    //   path: '/homework/dashboard',
    //   sidebarName: 'Homework Dashboard',
    //   navbarName: 'Homework Dashboard',
    //   icon: Assignment
    // },
    {
      path: '#',
      sidebarName: 'Homework Dashboard',
      navbarName: 'Homework Dashboard',
      icon: Assignment,
      content: [
        {
          path: '/homework/dashboard',
          sidebarName: 'Homework',
          navbarName: 'Homework'
          // icon: Assignment
        },
        {
          path: '/homework/report',
          sidebarName: 'Report',
          navbarName: 'Report'
          // icon: Assignment
        }
      ]
    },
    {
      path: '/game',
      sidebarName: 'Game',
      navbarName: 'Game',
      icon: SportsEsportsIcon
    },
    // discussionFormFeature(),
    // {
    //   path: '/discussionForm',
    //   sidebarName: 'Discussion Form',
    //   navbarName: 'Discussion Form',
    //   icon: ForumIcon
    // },
    {
      path: '#',
      sidebarName: 'Discussion Forum',
      icon: ForumIcon,
      content: [
        {
          path: '/discussion_dashboard',
          sidebarName: 'Discussion Dashboard',
          icon: WebAsset
        },
        {
          path: '/discussionForm',
          sidebarName: 'Discussion Forum',
          navbarName: 'Discussion Forum',
          icon: Dashboard
        },
        {
          path: '/discussion-form_add_Category',
          sidebarName: 'Add Category',
          icon: Add
        },
        {
          path: '/discussion-form_add_Sub_Category',
          sidebarName: 'Add Sub Category',
          icon: Add
        },
        {
          path: '/discussion-form_add_Sub_Sub_Category',
          sidebarName: 'Add Sub Sub Category',
          icon: Add
        },
        {
          path: '/discussion-form_edit_Post',
          sidebarName: 'Edit And View Post',
          icon: Edit
        }
      ] },
    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    {
      path: '#',
      sidebarName: 'Masters',
      navbarName: 'Masters',
      icon: People,
      content: [
        {
          path: '/staff',
          sidebarName: 'Staff',
          navbarName: 'Staff',
          icon: SupervisorAccount
        },
        {
          path: '/student',
          sidebarName: 'Students',
          navbarName: 'Students',
          icon: Face
        }
      ]
    },
    // {
    //   path: '/communication',
    //   sidebarName: 'Communication',
    //   navbarName: 'Communication',
    //   icon: MessageSharp
    // },
    // {
    //   path: '#',
    //   sidebarName: 'Master Management',
    //   navbarName: 'Master Management',
    //   icon: Settings ,
    //   content: [
    //     {
    //       path: '#',
    //       sidebarName: 'Manage Subjects',
    //       navbarName: 'Manage Subjects',
    //       icon: LibraryBooks ,
    //       content: [
    //         {
    //           path: '/subject',
    //           sidebarName: 'Subject',
    //           navbarName: 'Subject'
    //         },
    //         {
    //           path: '/subjectMapping',
    //           sidebarName: 'Subject Mapping',
    //           navbarName: 'Subject Mapping'
    //         }
    //       ]
    //     },
    //     {
    //       path: '#',
    //       sidebarName: 'Manage Grades',
    //       navbarName: 'Manage Grades',
    //       icon: TextRotateVertical ,
    //       content: [
    //         {
    //           path: '/grade',
    //           sidebarName: 'Grade',
    //           navbarName: 'Grade'
    //         },
    //         {
    //           path: '/gradeMapping',
    //           sidebarName: 'Grade Mapping',
    //           navbarName: 'Grade Mapping'
    //         }
    //       ]
    //     },
    //     {
    //       path: '#',
    //       sidebarName: 'Manage Sections',
    //       navbarName: 'Manage Sections',
    //       icon: VerticalSplit ,
    //       content: [
    //         {
    //           path: '/section',
    //           sidebarName: 'Section',
    //           navbarName: 'Section'
    //         },
    //         {
    //           path: '/sectionMapping',
    //           sidebarName: 'Section Mapping',
    //           navbarName: 'Section Mapping'
    //         }
    //       ]
    //     },
    //     // {
    //     //   path: '/classGroup',
    //     //   sidebarName: 'Class Group',
    //     //   navbarName: 'Class Group',
    //     //   icon: Group
    //     // },
    //     {
    //       path: '/gradeCategory',
    //       sidebarName: 'Grade Category',
    //       navbarName: 'Grade Category',
    //       icon: TableChart
    //     }
    //     // {
    //     //   path: '/vacation',
    //     //   sidebarName: 'Vacation',
    //     //   navbarName: 'Vacation',
    //     //   icon: GolfCourse
    //     // },
    //     // {
    //     //   path: '/vacationType',
    //     //   sidebarName: 'Vacation Type',
    //     //   navbarName: 'Vacation Type',
    //     //   icon: GolfCourse
    //     // },
    //     // {
    //     //   path: '/period',
    //     //   sidebarName: 'Period',
    //     //   navbarName: 'Period',
    //     //   icon: HorizontalSplit
    //     // },
    //   ]
    // },
    {
      path: '#',
      sidebarName: 'Teacher Management',
      icon: School,
      content: [
        {
          path: '/assignSubjectTeacher',
          sidebarName: 'Assign Subject Teacher',
          navbarName: 'Assign Subject Teacher'
        },
        {
          path: '/teacher-report/view',
          sidebarName: 'Teacher Report',
          navbarName: 'Teacher Report'
        },
        {
          path: '/teacher-lagging-report',
          sidebarName: 'Teacher Lagging Report',
          navbarName: 'Teacher Lagging Report'
        },
        {
          path: '/teacher-list',
          sidebarName: 'Teacher List',
          navbarName: 'Teacher List'
        }
      ]
    },
    {
      path: '/certificate',
      sidebarName: 'Certificate',
      navbarName: 'Give Certificate',
      icon: PostAdd
    },
    {
      path: '/reviews',
      sidebarName: 'Student Reviews',
      navbarName: 'Student Reviews',
      icon: Feedback
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },
    {
      path: '#',
      sidebarName: 'SMS/Email',
      navbarName: 'SMS/Email',
      icon: Drafts,
      content: [
        {
          path: '/emailsms/',
          sidebarName: 'Send Email/SMS',
          navbarName: 'Send Email/SMS',
          icon: EmailIcon
        },
        {
          path: '/sms/log/',
          sidebarName: 'Email/SMS Logs',
          navbarName: 'Email/SMS Logs',
          icon: Message
        },
        {
          path: '/sms/addSMSCredits/',
          sidebarName: 'SMS Credits',
          navbarName: 'SMS Credits',
          icon: Chat
        },
        {
          path: '/sms/offlineSms/',
          sidebarName: 'Offline SMS',
          navbarName: 'Offline SMS',
          icon: Chat
        }
      ]
    },
    {
      path: '/videoSms/external',
      sidebarName: 'Video Message',
      navbarName: 'Video Message',
      icon: Duo
    },
    {
      path: '#',
      sidebarName: 'Attendance',
      icon: CheckCircle,
      content: [
        {
          path: '/attendance',
          sidebarName: 'Take Attendance',
          icon: CalendarToday
        },
        {
          path: '/attendance/view',
          sidebarName: 'View Attendance',
          icon: CalendarViewDay
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'ID Card',
      navbarName: 'IDCard',
      icon: People,
      content: [
        {
          path: '/staffIdCard/0',
          sidebarName: 'Staff ID Card',
          navbarName: 'Staff ID Card',
          icon: People
        },
        {
          path: '/studentIdCard/0',
          sidebarName: 'Student ID Card',
          navbarName: 'Student ID card',
          icon: People
        }
      ]
    },
    {
      path: '/calendar',
      sidebarName: 'Calendar',
      navbarName: 'Calendar',
      icon: CalendarToday
    },
    {
      path: '/timetable',
      sidebarName: 'Time Table',
      navbarName: 'Time Table',
      icon: Timeline
    },
    {
      path: '#',
      sidebarName: 'Circular',
      icon: BlurCircular,
      content: [
        {
          path: '/v2/circular',
          sidebarName: 'Upload Circular',
          navbarName: 'Upload Circular',
          icon: CloudUpload
        },
        {
          path: '/v2/circular/view',
          sidebarName: 'View Circular',
          navbarName: 'View Circular',
          icon: Visibility
        },
        {
          path: '/v2/circular/template/view',
          sidebarName: 'View Circular Template',
          navbarName: 'View Circular Template',
          icon: Visibility
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Blogs',
      icon: WebAsset,
      content: [
        {
          path: '/blog/view/reviewer',
          sidebarName: 'View Blogs',
          icon: Visibility
        }
      ]
    },
    // {
    //   path: '#',
    //   sidebarName: 'Message',
    //   icon: Message ,
    //   content: [
    //     {
    //       path: '/message',
    //       sidebarName: 'Upload Message',
    //       navbarName: 'Upload Message',
    //       icon: CloudUpload
    //     },
    //     {
    //       path: '/message/view',
    //       sidebarName: 'View Message',
    //       navbarName: 'View Message',
    //       icon: Visibility
    //     }
    //   ]
    // }
    {
      path: '/generalDiary',
      sidebarName: 'General Diary',
      icon: ListAlt
    },
    {
      path: '/feedback/view',
      sidebarName: 'Feedback',
      icon: Feedback
    },
    {
      path: '/grievance/view',
      sidebarName: 'Grievance',
      icon: Visibility
    },
    {
      path: '#',
      sidebarName: 'Gradebook',
      icon: ImportContacts,
      content: [
        {
          path: '/gradebook',
          sidebarName: 'Gradebook Details',
          icon: ImportContacts
        }, {
          path: '/gradebook/reports',
          sidebarName: 'Gradebook Reports',
          icon: Assignment

        }

      ]
    },
    {
      path: '/excelReport',
      sidebarName: 'ConsolidationReports',
      navbarName: 'ExcelReports',
      icon: Report
    },
    {
      path: '/meal',
      sidebarName: 'Meal',
      navbarName: 'Meal',
      icon: Fastfood
    },
    {
      path: '#',
      sidebarName: 'Practice Questions',
      icon: Toc,
      content: [
        {
          path: '/questbox/PracticeQuestions/view_analysis',
          sidebarName: 'Analytics',
          navbarName: 'Analytics',
          icon: PollRounded
        }
      ]
    },
    {
      path: 'academic/questioncount',
      sidebarName: 'Question Count',
      navbarName: 'Question Count',
      icon: Create
    },
    {
      path: '#',
      sidebarName: 'Uniform Size',
      navbarName: 'Uniform Size',
      icon: FormatListNumbered,
      content: [
        {
          path: '/store/bulkUniform',
          sidebarName: 'Bulk Uniform Upload',
          navbarName: 'Bulk Uniform Upload',
          icon: LibraryBooks
        },
        {
          path: '/store/bulkUniformVedio',
          sidebarName: 'Uniform Video',
          navbarName: 'Uniform Video',
          icon: VideoLibrary
        },
        {
          path: '/store/uniformChart',
          sidebarName: 'View Uniform Chart',
          navbarName: 'View Uniform Chart',
          icon: FormatListNumbered
        }
      ]
    }, {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/add_new',
          sidebarName: 'Add Class',
          icon: AddCircle
        },
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        },
        {
          path: '/onlineclass/branchwisexls',
          sidebarName: 'Excel Download',
          icon: ArrowDownwardIcon
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Academic Promotions',
      icon: School,
      content: [
        {
          path: '/student/promotions/academic',
          sidebarName: 'Initiate',
          icon: CreateIcon
        },
        {
          path: '/student/promotions/academic/view',
          sidebarName: 'View Promoted',
          icon: Visibility
        }
      ]
    },
    {
      path: '/ebook/view',
      sidebarName: 'View Ebook',
      icon: Visibility
    },
    {
      path: '#',
      sidebarName: 'Quiz Stats',
      icon: Equalizer,
      content: [
        {
          path: '/quiz/stats',
          sidebarName: 'Quiz Stats',
          icon: Equalizer
        }
      ]
    }
  ],
  BDM: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    {
      path: '#',
      sidebarName: 'Masters',
      navbarName: 'Masters',
      icon: People,
      content: [
        {
          path: '/staff',
          sidebarName: 'Staff',
          navbarName: 'Staff',
          icon: SupervisorAccount
        },
        {
          path: '/student',
          sidebarName: 'Students',
          navbarName: 'Students',
          icon: Face
        }
      ]
    },
    {
      path: '/calendar',
      sidebarName: 'Calendar',
      navbarName: 'Calendar',
      icon: CalendarToday
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },
    {
      path: '/timetable',
      sidebarName: 'Time Table',
      navbarName: 'Time Table',
      icon: Timeline
    },
    {
      path: '/attendance/view',
      sidebarName: 'Attendance',
      navbarName: 'View Attendance',
      icon: CheckCircle
    },
    {
      path: '/grievance/view',
      sidebarName: 'Grievance',
      navbarName: 'Grievance',
      icon: Visibility
    },
    {
      path: '#',
      sidebarName: 'Uniform Size',
      navbarName: 'Uniform Size',
      icon: FormatListNumbered,
      content: [
        {
          path: '/store/bulkUniform',
          sidebarName: 'Bulk Uniform Upload',
          navbarName: 'Bulk Uniform Upload',
          icon: LibraryBooks
        },
        {
          path: '/store/bulkUniformVedio',
          sidebarName: 'Uniform Video',
          navbarName: 'Uniform Video',
          icon: VideoLibrary
        },
        {
          path: '/store/uniformChart',
          sidebarName: 'View Uniform Chart',
          navbarName: 'View Uniform Chart',
          icon: FormatListNumbered
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/add_new',
          sidebarName: 'Add Class',
          icon: AddCircle
        },
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        }
      ]
    },
    {
      path: '/v2/circular/template/view',
      sidebarName: 'View Circular Template',
      navbarName: 'View Circular Template',
      icon: Visibility
    }
  ],
  Applicant: [
    {
      path: '/questbox/viewTests',
      sidebarName: 'View Tests',
      navbarName: 'View Tests',
      icon: FormatListNumbered
    }
  ],
  ExaminationHead: [
    {
      path: '#',
      sidebarName: 'Tests',
      navbarName: 'Tests',
      icon: CheckBox,
      content: [
        {
          path: '/questbox/createTest',
          sidebarName: 'Create Test',
          navbarName: 'Create Test',
          icon: Create
        },
        {
          path: '/questbox/viewTests',
          sidebarName: 'View Tests',
          navbarName: 'View Tests',
          icon: FormatListNumbered
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'Assessment',
      navbarName: 'Assessment',
      icon: Assessment,
      content: [
        {
          path: '/questbox/create_assessment',
          sidebarName: 'Create Assessment',
          navbarName: 'Create Assessment',
          icon: Edit
        },
        {
          path: '/questbox/assessment/view',
          sidebarName: 'View Assessment',
          navbarName: 'View Assessment',
          icon: TurnedIn
        },
        {
          path: '/questbox/configuration',
          sidebarName: 'Configuration Mappings',
          navbarName: 'Configuration Mappings',
          icon: Map
        }

      ]
    },
    {
      path: '#',
      sidebarName: 'Questions',
      navbarName: 'Questions',
      icon: BorderColor,
      content: [
        {
          path: '/questbox/add',
          sidebarName: 'Add Question paper Type and Sub Type',
          navbarName: 'Add Question paper Type and Sub Type',
          icon: Map
        },
        {
          path: '/questbox/view',
          sidebarName: 'View Question paper Type and Sub Type',
          navbarName: 'View Question paper Type and Sub Type',
          icon: Map
        }
      ]
    }
  ],
  FOE: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },
    {
      path: '#',
      sidebarName: 'Attendance',
      icon: CheckCircle,
      content: [
        {
          path: '/attendance',
          sidebarName: 'Take Attendance',
          icon: CalendarToday
        },
        {
          path: '/attendance/view',
          sidebarName: 'View Attendance',
          icon: CalendarViewDay
        }
      ]
    },
    {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    },
    {
      path: '#',
      sidebarName: 'Uniform Size',
      navbarName: 'Uniform Size',
      icon: FormatListNumbered,
      content: [
        {
          path: '/store/bulkUniform',
          sidebarName: 'Bulk Uniform Upload',
          navbarName: 'Bulk Uniform Upload',
          icon: LibraryBooks
        },
        {
          path: '/store/bulkUniformVedio',
          sidebarName: 'Uniform Video',
          navbarName: 'Uniform Video',
          icon: VideoLibrary
        },
        {
          path: '/store/uniformChart',
          sidebarName: 'View Uniform Chart',
          navbarName: 'View Uniform Chart',
          icon: FormatListNumbered
        }
      ]
    },
    {
      path: '#',
      sidebarName: 'SMS/Email',
      navbarName: 'SMS/Email',
      icon: Drafts,
      content: [
        {
          path: '/emailsms/',
          sidebarName: 'Send Email/SMS',
          navbarName: 'Send Email/SMS',
          icon: EmailIcon
        },
        {
          path: '/sms/',
          sidebarName: 'SMS',
          navbarName: 'SMS',
          icon: Message
        }
      ]
    },
    {
      path: '/student',
      sidebarName: 'Students',
      navbarName: 'Students',
      icon: Face
    },
    {
      path: '/timetable',
      sidebarName: 'Time Table',
      navbarName: 'Time Table',
      icon: Timeline
    }
  ],
  MIS: [
    {
      path: '/dashboard',
      sidebarName: 'Dashboard',
      navbarName: 'Dashboard',
      icon: Dashboard
    },

    {
      path: '/v2/circular/view',
      sidebarName: 'Circular',
      navbarName: 'View Circular',
      icon: BlurCircular

    },
    {
      path: '/teacher-report/view',
      sidebarName: 'Teacher Report',
      navbarName: 'Teacher Report',
      icon: School

    },

    {
      path: '/generalDiary',
      sidebarName: 'General Diary',
      navbarName: 'General Diary',
      icon: ListAlt
    },

    {
      path: '/grievance/view',
      sidebarName: 'Grievance',
      navbarName: 'Grievance',
      icon: Visibility
    },
    {
      path: '/excelReports',
      sidebarName: 'ConsolidationReports',
      navbarName: 'ExcelReports',
      icon: Report

    }
  ],
  Developer: [
    {
      path: '/crashreport',
      sidebarName: 'Crash report',
      navbarName: 'Crash report',
      icon: Dashboard
    },
    {
      path: '/integrationtestreport',
      sidebarName: 'IntegrationTest report',
      navbarName: 'IntegrationTest report',
      icon: Dashboard
    },
    {
      path: '/developerreport',
      sidebarName: 'Developer Select',
      navbarName: 'Developer Select',
      icon: Dashboard
    },
    {
      path: '/router_switch',
      sidebarName: 'AWS Router',
      navbarName: 'Router',
      icon: Dashboard
    }
  ],
  GuestStudent: [
    // {
    //   path: '#',
    //   sidebarName: 'Tests',
    //   icon: CheckBox,
    //   content: [
    //     {
    //       path: '/student_test/online',
    //       sidebarName: 'Online test',
    //       navbarName: 'Tests',
    //       icon: CheckBox
    //     },
    //     {
    //       path: '/student_test/practice',
    //       sidebarName: 'Practice test',
    //       navbarName: '',
    //       icon: CheckBox
    //     }
    //   ]
    // },
    // {
    //   path: '#',
    //   sidebarName: 'Practice Questions',
    //   icon: Toc,
    //   content: [
    //     {
    //       path: '/questbox/PracticeQuestions',
    //       sidebarName: 'Practice Questions',
    //       navbarName: 'Practice Questions',
    //       icon: TableChart
    //     },
    //     {
    //       path: '/practice_question_dashboard',
    //       sidebarName: 'Summary',
    //       navbarName: 'Summary',
    //       icon: TableChart
    //     }
    //   ]
    // },

    {
      path: '/questbox/questions/practice/',
      sidebarName: 'Practice Questions',
      navbarName: 'Practice Questions',
      icon: TableChart
    },
    {

      path: '/video/view/',
      sidebarName: 'LMS',
      icon: VideoLibrary

    },
    {
      path: '/video/academic',
      sidebarName: 'Academic Videos',
      icon: VideoLibrary
    },
    {
      path: '/publications',
      sidebarName: 'Publications',
      navbarName: 'Publications',
      icon: CalendarToday
    },

    // {
    //   path: '/ebook/view',
    //   sidebarName: 'View Ebook',
    //   icon: Visibility
    // },
    {
      path: '/questbox/onlineClass',
      sidebarName: 'Online Class ',
      icon: Class
    }, {
      path: '/grievance',
      sidebarName: 'Support',
      navbarName: 'Support',
      icon: ContactSupport
    }, {
      path: '/orchadio/listeners',
      sidebarName: 'Orchadio - The Radio',
      navbarName: 'Orchadio - The Radio',
      icon: RadioIcon
    }
  ],
  StoreManager: [
    {
      path: '/store/studentUniform',
      sidebarName: 'Uniform',
      navbarName: 'Uniform',
      icon: Face
    },
    {
      path: '/store/bulkUniform',
      sidebarName: 'Bulk Uniform Upload',
      navbarName: 'Bulk Uniform Upload',
      icon: LibraryBooks
    },
    {
      path: '/store/bulkUniformVedio',
      sidebarName: 'Uniform Video',
      navbarName: 'Uniform Video',
      icon: VideoLibrary
    },
    {
      path: '/store/uniformChart',
      sidebarName: 'View Uniform Chart',
      navbarName: 'View Uniform Chart',
      icon: FormatListNumbered
    }
  ],
  'Online Class Admin': [
    {
      path: '#',
      sidebarName: 'Online Class',
      icon: MenuBook,
      content: [
        {
          path: '/online_class/add_new',
          sidebarName: 'Add Class',
          icon: AddCircle
        },
        {
          path: '/online_class/view_class',
          sidebarName: 'Class List',
          icon: Visibility
        },
        {
          path: '/onlineclass/branchwisexls',
          sidebarName: 'Excel Download',
          icon: ArrowDownwardIcon
        },
        {
          path: '/online_class/create/group',
          sidebarName: 'Group Guest Students',
          icon: Group
        },
        {
          path: '/class/group',
          sidebarName: 'Class Group Details',
          icon: GroupIcon
        },
        {
          path: '/classGroup/list',
          sidebarName: 'List Class Group ',
          navbarName: 'List Class Group',
          icon: LibraryAdd
        },
        {
          path: '/class/interest',
          sidebarName: 'Class Statistics',
          navbarName: 'Class Statistics',
          icon: PollRounded
        },
        {
          path: '/bulkClass/create',
          sidebarName: 'Bulk Class Creation',
          navbarName: 'Bulk Class Creation',
          icon: AddCircle
        },
        {
          path: '/publications',
          sidebarName: 'Publications',
          navbarName: 'Publications',
          icon: CalendarToday
        }
      ]
    }
  ],
  'Management Admin': [

    {
      path: '/management_dashboard',
      sidebarName: 'Management Dashboard',
      navbarName: 'Management Dashboard',
      icon: Equalizer
    },
    {
      path: '/management_dashboard_digital_marketing',
      sidebarName: 'ManagementDashBoard- DigitalMarketing',
      navbarName: 'ManagementDashBoard- DigitalMarketing',
      icon: TimelineIcon
    }

  ],
  'HomeWork Admin': [
    {
      path: '/homework/dashboard',
      sidebarName: 'Homework dashboard',
      navbarName: 'Homework dashboard',
      icon: ImportContactsRounded
    }
  ],
  'Blog Admin': [
    {
      path: '#',
      sidebarName: 'Blogs',
      icon: WebAsset,
      content: [
        {
          path: '/blog/view/reviewer',
          sidebarName: 'View Blogs',
          icon: Visibility
        }
      ]
    }
  ],
  EMedateAdmin: [
    {
      path: '/finance/e-mandate',
      sidebarName: 'E-Mandate',
      navbarName: 'E-Mandate',
      icon: Money
    },
    {
      path: '/finance/billingDetails',
      sidebarName: 'Billing Details',
      navbarName: 'Billing Details',
      icon: Money
    },
    {
      path: '/finance/e-customerdetails',
      sidebarName: 'Add Customer Details',
      navbarName: 'Add Customer Details',
      icon: CreateIcon
    },
    {
      path: '/finance/e-orderdetails',
      sidebarName: 'Add Order Details',
      navbarName: 'Add Order Details',
      icon: CreateIcon
    },
    {
      path: '/finance/e-generatesubsequentpayment',
      sidebarName: 'Generate Subsequent Payment',
      navbarName: 'Generate Subsequent Payment',
      icon: Money
    },
    {
      path: '/finance/dailybillingdeatils',
      sidebarName: 'Total Billing Details',
      navbarName: 'Total Billing Details',
      icon: Money
    },
    {
      path: '/finance/createLink',
      sidebarName: 'Create Link',
      navbarName: 'Create Link',
      icon: Money
    }
  ]
}

export default SideBarRoutes
