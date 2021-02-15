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
import { createFeePlan, fetchLoggedInUserDetails, getOrderDetails, totalBillingDetails } from './redux/actions';
import TeacherHomework from './containers/homework/teacher-homework';
import HomeworkAdmin from './containers/homework/homework-admin';
import AddHomework from './containers/homework/teacher-homework/add-homework';
import BulkUpload from './containers/user-management/bulk-upload/bulk-upload';
import FeeType from './containers/Finance/src/components/Finance/CreateFeeType/NormalFeeType/feeType.js'
import MiscFeeType from './containers/Finance/src/components/Finance/CreateFeeType/MiscFeeType/miscFeeType';
// import MiscFeeType from './containers/Finance/src/components/Finance/CreateFeeType/MiscFeeType/miscFeeType.js'
import CurrFeeType from './containers/Finance/src/components/Finance/CreateFeeType/CurrFeeType/currFeeType.js'
import AddOtherFees from './containers/Finance/src/components/Finance/BranchAccountant/OtherFees/addOtherFees.js'
import AdminOtherFees from './containers/Finance/src/components/Finance/BranchAccountant/OtherFees/adminOtherFees.js'
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
import CreateReceipt from './containers/Finance/src/components/Finance/ReceiptChanges/createReceipt.js'
import StoreReport from '../src/containers/Finance/src/components/Inventory/StoreAdmin/StoreReports/storeReports.js'
import AddFeePlan from './containers/Finance/src/components/Finance/CreateFeePlan/addFeePlan.js'
import StudentLedgerTab from './containers/Finance/src/components/Finance/BranchAccountant/StudentLedgerTab/studentLedgerTab.js'
import ManageFeeType from '../src/containers/Finance/src/components/Finance/CreateFeePlan/manageFeeType.js'
import RegistrationForm from '../src/containers/Finance/src/components/Finance/BranchAccountant/RegistrationForm/registrationForm.js'
import NewRegistration from '../src/containers/Finance/src/components/Finance/BranchAccountant/RegistrationForm/newRegistrationForm.js'
import AdmissionFormAcc from '../src/containers/Finance/src/components/Finance/BranchAccountant/AdmissionForm/admissionForm.js'
import CustomizedAdmissionForm from '../src/containers/Finance/src/components/Finance/BranchAccountant/AdmissionForm/customizedAdmissionForm.js'
import NewAdmissionForm from './containers/Finance/src/components/Finance/BranchAccountant/AdmissionForm/newAdmissionForm';
import ApplicationFormAcc from '../src/containers/Finance/src/components/Finance/BranchAccountant/ApplicationForm/applicationForm.js'
// import OnlineAdmission from '../src/containers/Finance/src/components/Finance/PendingOnlineAdmission/pendingOnlineAdmission.js'
import TabView from '../src/containers/Finance/src/components/Finance/CorporateBank/CorporateBankTabView/corporateBankTabView.js'
import Bank from './containers/Finance/src/components/Finance/CorporateBank/bank.js'
import ViewBanks from '../src/containers/Finance/src/components/Finance/CorporateBank/ViewBanks/viewBanks.js'
import ViewFeeAccounts from '../src/containers/Finance/src/components/Finance/CorporateBank/ViewFeeAccounts/viewFeeAccounts.js'
import AccToClass from '../src/containers/Finance/src/components/Finance/CorporateBank/AccountToClass/accountToClass.js'
import AccToBranch from '../src/containers/Finance/src/components/Finance/CorporateBank/AccountToBranch/accountToBranch.js'
import AccToStore from '../src/containers/Finance/src/components/Finance/CorporateBank/AccountToStore/accountToStore.js'
import LastDateSettings from '../src/containers/Finance/src/components/Finance/LastDateSettings/lastDate.js'
import ReceiptSettings from '../src/containers/Finance/src/components/Finance/ReceiptSettings/ReceiptSettings.js'
import BulkFeeUpload from  '../src/containers/Finance/src/components/Finance/BulkOperations/BulkFeeUpload/bulkFeeUpload.js'
import StudentWallet from '../src/containers/Finance/src/components/Finance/student/StudentWallet/StudentWallet.js'
import FeeCollection from '../src/containers/Finance/src/components/Finance/BranchAccountant/FeeCollection/FeeCollection.js'
import FeeShowList from './containers/Finance/src/components/Finance/BranchAccountant/FeeCollection/FeeShowList';
import AssignDelieveryCharge from './containers/Finance/src/components/Finance/BranchAccountant/AssignDelieveryCharge/assignDelieveryCharge.js'
import ChangeFeePlanToStudent from './containers/Finance/src/components/Finance/BranchAccountant/ChangeFeePlanToStudent/changeFeePlanToStudent.js'
import BulkReportUpload from './containers/Finance/src/components/Finance/BulkOperations/bulkReportUpload.js'
import BulkReportStatus from './containers/Finance/src/components/Finance/BulkOperations/bulkReportStatus.js'
import OnlinePayment from './containers/Finance/src/components/Finance/UploadOnlinePayments/uploadOnlinePayments.js'
import BulkActiveInactive from './containers/Finance/src/components/Finance/BulkOperations/BulkActiveInactive/bulkActiveInactive.js'
import BulkActiveInactiveParent from './containers/Finance/src/components/Finance/BulkOperations/BulkActiveInactiveParent/bulkActiveInactiveParent.js'
import StudentActivateInactiveAcc from './containers/Finance/src/components/Finance/BranchAccountant/StudentActivateInactivate/studentActivateInactiveacc.js'
import OnlineAdmission from './containers/Finance/src/components/Finance/PendingOnlineAdmission/pendingOnlineAdmission.js'
import StudentPromotion from './containers/Finance/src/components/Finance/BranchAccountant/StudentPromotion/studentPromotion.js'
import QRCodeGenerator from './containers/Finance/src/components/Finance/QRCode/qrCodeGenerator.js'
import CommunicationSMS from './containers/Finance/src/components/Finance/BranchAccountant/Communication/communication.js'
import ItCertificate from './containers/Finance/src/components/Finance/ItCertificate/itCertificate.js'
import FeePaymentChangeRequests from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/feePaymentChangeRequests.js'
import StorePaymentRequests from './containers/Finance/src/components/Finance/StorePaymentRequests/storePaymentRequests.js'
import ApprovedStoreRequests from './containers/Finance/src/components/Finance/StorePaymentRequests/approvedStoreRequests.js'
import RejectedStoreRequests from './containers/Finance/src/components/Finance/StorePaymentRequests/rejectedStoreRequests.js'
import CancelledStoreRequests from './containers/Finance/src/components/Finance/StorePaymentRequests/cancelledStoreRequests';
import PendingStoreRequests from './containers/Finance/src/components/Finance/StorePaymentRequests/pendingStoreRequests';
import ApprovedRequestView from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/approvedRequestView';
import RejectedRequestView from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/rejectedRequestView';
import CancelledRequestView from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/cancelledRequestView';
import PendingRequestView from './containers/Finance/src/components/Finance/FeePaymentChangeRequests/pendingRequestView';
import AcceptRejectPayment from './containers/Finance/src/components/Finance/BranchAccountant/AcceptRejectPayment/acceptRejectPayment';
import PostDateCheque from './containers/Finance/src/components/Finance/BranchAccountant/PostDateCheque/postDateCheque';
import StudentInfoAdm from './containers/Finance/src/components/Finance/StudentInfo/studentInfo.js'
import BillingDetails from './containers/Finance/src/components/Finance/E-mandate/billingDetails';
import AddCustomerDeatils from './containers/Finance/src/components/Finance/E-mandate/addCustomerDeatils';
import OrderDetails from './containers/Finance/src/components/Finance/E-mandate/orderDetails';
import DailyBillingDetails from './containers/Finance/src/components/Finance/E-mandate/dailyBillingDetails'
import PettyExpenses from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/pettyExpenses.js'
import MakeEntry from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/MakeEntry/makeEntry.js'
import BankReport from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/BankReport/bankReport.js'
import CashReport from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/CashReport/cashReport.js'
import LedgerReport from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/LedgerReport/ledgerReport.js'
import FinancialLedgerReport from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/PettyExpenses/FinancialLedgerReport/financialLedgerReport.js'
import Party from './containers/Finance/src/components/Finance/BranchAccountant/ExpenseManagement/Party/Party.js'
import StudentShuffleReq from './containers/Finance/src/components/Finance/ApprovalRequests/StudentShuffle/studentShuffleReq.js'
import ManagePayment from './containers/Finance/src/components/Finance/student/managePayment/managePayment.js'
import FeeStructure from './containers/Finance/src/components/Finance/student/FeeStructure/feeStructure.js'
import BulkUniform from './containers/Finance/src/components/Inventory/StoreManager/BulkUniform/bulkUniform.js'
import ShippingAmount from './containers/Finance/src/components/Inventory/BranchAccountant/shippingAmount/ShippingAmount.js'
import AddItems from './containers/Finance/src/components/Inventory/StoreAdmin/SchoolStore/AddItems/addItems.js'
import Kit from './containers/Finance/src/components/Inventory/StoreAdmin/Kit/kit';
import SubCategoryAllow from './containers/Finance/src/components/Inventory/StoreAdmin/SubCategoryAllow/subCategoryAllow';
import UpdateAdmissionForm from './containers/Finance/src/components/Finance/BranchAccountant/AdmissionForm/updateAdmissionForm';
import AccountantLogin from './containers/Finance/src/components/Finance/BulkOperations/AccountantLogin/AccountantLogin';
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
                  {({ match }) => <AdminOtherFees match={match} />}
              </Route>
              <Route exact path='/feeType/add_otherFee'>
                  {({ match }) => <AddOtherFees match={match} />}
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
                  {({ match }) => <CreateReceipt match={match} />}
                </Route>
                <Route exact path='/finance/StoreReport'>
                  {({ match }) => <StoreReport match={match} />}
                </Route>
                 <Route exact path='/finance/add_feePlan'>
                  {({ match }) => <AddFeePlan match={match} />}
                </Route>
                <Route exact path='/student/LegerTab'>
                  {({ match }) => <StudentLedgerTab match={match} />}
                </Route>
                <Route exact path='/finance/manage_feeType/'>
                  {({ match }) => <ManageFeeType match={match} />}
                </Route>
                <Route exact path='/admissions/registrationForm/'>
                  {({ match }) => <RegistrationForm match={match} />}
                </Route>
                <Route exact path='/finance/accountant/newregistrationForm'>
                  {({ match }) => <NewRegistration match={match} />}
                </Route>
                <Route exact path='/finance/accountant/admissionForm'>
                  {({ match }) => <AdmissionFormAcc match={match} />}
                </Route>
                <Route exact path='/finance/customizedAdmissionForm'>
                  {({ match }) => <CustomizedAdmissionForm match={match} />}
                </Route>
                <Route exact path='/finance/newAdmissionForm'>
                  {({ match }) => <NewAdmissionForm match={match} />}
                </Route>
                <Route exact path='/finance/accountant/applicationFrom'>
                  {({ match }) => <ApplicationFormAcc match={match} />}
                </Route>
                {/* <Route exact path='/finance/accountat/pendingOnlineadmission'>
                  {({ match }) => <OnlineAdmission match={match} />}
                </Route> */}
                <Route exact path='/finance/BankAndFeeAccounts'>
                  {({ match }) => <TabView match={match} />}
                </Route>
                <Route exact path='/finance/Bank'>
                  {({ match }) => <Bank match={match} />}
                </Route>
                <Route exact path='/finance/ViewBank'>
                  {({ match }) => <ViewBanks match={match} />}
                </Route>
                <Route exact path='/finance/ViewFeeAccounts'>
                  {({ match }) => <ViewFeeAccounts match={match} />}
                </Route>
                <Route exact path='/finance/AccToClass'>
                  {({ match }) => <AccToClass match={match} />}
                </Route>
                <Route exact path='/finance/AccToBranch'>
                  {({ match }) => <AccToBranch match={match} />}
                </Route>
                <Route exact path='/finance/AccToStore'>
                  {({ match }) => <AccToStore match={match} />}
                </Route>
                <Route exact path='/finance/Setting/LastDateSetting'>
                  {({ match }) => <LastDateSettings match={match} />}
                </Route>
                <Route exact path='/finance/Setting/ReceiptSettings'>
                  {({ match }) => <ReceiptSettings match={match} />}
                </Route>
                <Route exact path='/finance/BulkOperation/Feestructure'>
                  {({ match }) => <BulkFeeUpload match={match} />}
                </Route>
                <Route exact path='/finance/StudentWallet'>
                  {({ match }) => <StudentWallet match={match} />}
                </Route>
                <Route exact path='/finance/student/FeeCollection'>
                  {({ match }) => <FeeCollection match={match} />}
                </Route>
                <Route exact path= '/finance/feeShowList/'>
                  {({ match }) => <FeeShowList match={match} />}
                </Route>
                <Route exact path= '/finance/student/AssignDeliveryCharge'>
                  {({ match }) => <AssignDelieveryCharge match={match} />}
                </Route>
                <Route exact path= '/finance/student/ChnageFeePlanToStudent'>
                  {({ match }) => <ChangeFeePlanToStudent match={match} />}
                </Route>
                <Route exact path= '/finance/BulkOperation/BulkReportUpload'>
                  {({ match }) => <BulkReportUpload match={match} />}
                </Route>
                <Route exact path= '/finance/BulkOperation/AccountantLogin'>
                  {({ match }) => <AccountantLogin match={match} />}
                </Route>
                <Route exact path= '/finance/BulkOperation/BulkUploadStatus'>
                  {({ match }) => <BulkReportStatus match={match} />}
                </Route>
                <Route exact path= '/finance/BulkOperation/UploadOnlinePayment'>
                  {({ match }) => <OnlinePayment match={match} />}
                </Route>
                <Route exact path= '/finance/BulkOperation/BulkActiveInactive'>
                  {({ match }) => <BulkActiveInactive match={match} />}
                </Route>
                <Route exact path= '/finance/BulkOperation/BulkActiveInactiveParent'>
                  {({ match }) => <BulkActiveInactiveParent match={match} />}
                </Route>
                <Route exact path= '/finance/Student/ActiveInactive'>
                  {({ match }) => <StudentActivateInactiveAcc match={match} />}
                </Route>
                <Route exact path= '/finance/admissions/OnlineAdmission'>
                  {({ match }) => <OnlineAdmission match={match} />}
                </Route>
                <Route exact path= '/finance/Student/StudentPromotion'>
                  {({ match }) => <StudentPromotion match={match} />}
                </Route>
                <Route exact path= '/finance/Student/OqCodeGenerate'>
                  {({ match }) => <QRCodeGenerator match={match} />}
                </Route>
                <Route exact path= '/finance/Student/Communication'>
                  {({ match }) => <CommunicationSMS match={match} />}
                </Route>
                <Route exact path= '/finance/Student/IncomeTaxCertificate'>
                  {({ match }) => <ItCertificate match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/FeePaymentRequests'>
                  {({ match }) => <FeePaymentChangeRequests match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/StorePaymentRequests'>
                  {({ match }) => <StorePaymentRequests match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/ApprovedStorePaymentRequests'>
                  {({ match }) => <ApprovedStoreRequests match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/RejectedStorePaymentRequests'>
                  {({ match }) => <RejectedStoreRequests match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/CancelledStorePaymentRequests'>
                  {({ match }) => <CancelledStoreRequests match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/PendingStorePaymentRequests'>
                  {({ match }) => <PendingStoreRequests match={match} />}
                </Route>
                

                <Route exact path= '/finance/Approval/Requests/ApprovedPaymentRequests'>
                  {({ match }) => <ApprovedRequestView match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/RejectedPaymentRequests'>
                  {({ match }) => <RejectedRequestView match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/CancelledPaymentRequests'>
                  {({ match }) => <CancelledRequestView match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/PendingPaymentRequests'>
                  {({ match }) => <PendingRequestView match={match} />}
                </Route>

                <Route exact path= '/finance/Approval/Requests/AcceptRejectPayment'>
                  {({ match }) => <AcceptRejectPayment match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/PostDateCheque'>
                  {({ match }) => <PostDateCheque match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/PostDateCheque'>
                  {({ match }) => <PostDateCheque match={match} />}
                </Route>
                <Route exact path= '/finance/student/studentInfo'>
                  {({ match }) => <StudentInfoAdm match={match} />}
                </Route>
                <Route exact path= '/finance/E-Mandate/BillingDetails'>
                  {({ match }) => <BillingDetails match={match} />}
                </Route>

                <Route exact path= '/finance/E-Mandate/CustomerDetails'>
                  {({ match }) => <AddCustomerDeatils match={match} />}
                </Route>
                <Route exact path= '/finance/E-Mandate/OrderDetails'>
                  {({ match }) => <OrderDetails match={match} />}
                </Route>
                <Route exact path= '/finance/E-Mandate/TotalBillingDetails'>
                  {({ match }) => <DailyBillingDetails match={match} />}
                </Route>
                <Route exact path= '/finance/Expanse Management/PettyExpense'>
                  {({ match }) => <PettyExpenses match={match} />}
                </Route>
                <Route exact path= '/finance/Expanse Management/MakeEntry'>
                  {({ match }) => <MakeEntry match={match} />}
                </Route>
                <Route exact path= '/finance/Expanse Management/CashReport'>
                  {({ match }) => <CashReport match={match} />}
                </Route>
                <Route exact path= '/finance/Expanse Management/BankReport'>
                  {({ match }) => <BankReport match={match} />}
                </Route>
                <Route exact path= '/finance/Expanse Management/LedgerReport'>
                  {({ match }) => <LedgerReport match={match} />}
                </Route>
                <Route exact path= '/finance/Expanse Management/FinancialLedgerReport'>
                  {({ match }) => <FinancialLedgerReport match={match} />}
                </Route>
                <Route exact path= '/finance/Expanse Management/PartyList'>
                  {({ match }) => <Party match={match} />}
                </Route>
                <Route exact path= '/finance/Approval/Requests/StudentShuffleRequest'>
                  {({ match }) => <StudentShuffleReq match={match} />}
                </Route>
                <Route exact path= '/finance/ManagePayments'>
                  {({ match }) => <ManagePayment match={match} />}
                </Route>
                <Route exact path= '/finance/FeeStructure'>
                  {({ match }) => <FeeStructure match={match} />}
                </Route>
                <Route exact path= '/finance/BooksAndUniform'>
                  {({ match }) => <BulkUniform match={match} />}
                </Route>
                <Route exact path= '/finance/ShippingPayment'>
                  {({ match }) => <ShippingAmount match={match} />}
                </Route>
                <Route exact path= '/Store/AddItems'>
                  {({ match }) => <AddItems match={match} />}
                </Route>
                <Route exact path= '/Store/CreateKit'>
                  {({ match }) => <Kit match={match} />}
                </Route>
                <Route exact path= '/Store/SubCategoryAllow'>
                  {({ match }) => <SubCategoryAllow match={match} />}
                </Route>
                <Route exact path= '/admissions/UpdateRegistrationForm/'>
                  {({ match }) => <UpdateAdmissionForm match={match} />}
                </Route>
              </Switch>
            </ThemeProvider>
          </OnlineclassViewProvider>
        </AlertNotificationProvider>
      </Router>
    </div>
  );
}

export default App;
